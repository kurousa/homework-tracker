<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChildStore } from '@/stores/useChildStore'
import { useHomeworkStore } from '@/stores/useHomeworkStore'

import AppHeader from '@/components/common/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'
import RoleSelectionModal from '@/components/modals/RoleSelectionModal.vue'
import ChildSelectionModal from '@/components/modals/ChildSelectionModal.vue'
import PinSetupModal from '@/components/modals/PinSetupModal.vue'
import PinEntryModal from '@/components/modals/PinEntryModal.vue'
import CelebrationModal from '@/components/modals/CelebrationModal.vue'
import ChildGoalAddModal from '@/components/modals/ChildGoalAddModal.vue'
import ParentDashboard from '@/components/dashboards/ParentDashboard.vue'
import ChildDashboard from '@/components/dashboards/ChildDashboard.vue'
import ChildRegisterModal from '@/components/modals/ChildRegisterModal.vue'
import { useToastStore } from '@/stores/useToastStore'

import { fireConfetti } from '@/utils/confetti'

const authStore = useAuthStore()
const childStore = useChildStore()
const homeworkStore = useHomeworkStore()
const toastStore = useToastStore()

const { isRoleSelected, isParentMode, showPinSetup, showPinEntry } = storeToRefs(authStore)
const { currentChildId } = storeToRefs(childStore)
const { allDone } = storeToRefs(homeworkStore)

// Local state for modals that are not in authStore
const showChildSelection = ref(false)
const showChildAddModal = ref(false)
const showCelebration = ref(true)
const showChildRegisterFromChild = ref(false)

// Initialization logic
onMounted(() => {
  if (authStore.defaultRole === 'child' && !childStore.currentChildId) {
    showChildSelection.value = true
  }
})

// Update body class for styling
watch(isParentMode, (parentMode) => {
  if (parentMode) {
    document.body.className = 'bg-slate-50 font-professional text-slate-900 min-h-screen antialiased selection:bg-blue-100 theme-transition';
  } else {
    document.body.className = 'bg-amber-50 font-kids text-slate-700 min-h-screen antialiased selection:bg-amber-200 theme-transition';
  }
}, { immediate: true });

// Confetti logic
watch(allDone, (isFinished) => {
  if (isFinished && !isParentMode.value && isRoleSelected.value) {
    fireConfetti();
  }
});

const handleSelectChildRole = () => {
  if (childStore.children.length === 0) {
    showChildRegisterFromChild.value = true
    return
  }
  showChildSelection.value = true
}

const handleSelectParentRole = () => {
  if (!authStore.parentPin) {
    authStore.showPinSetup = true
  } else {
    authStore.setRole('parent')
  }
}

const handleChildSelected = (childId) => {
  childStore.selectChild(childId, false)
  authStore.setRole('child')
  showChildSelection.value = false
}

const handleToggleMode = () => {
  authStore.toggleMode()
  if (authStore.isParentMode === false && !childStore.currentChildId) {
    showChildSelection.value = true
  }
}

const closePinSetup = () => {
  authStore.showPinSetup = false
}

const closePinEntry = () => {
  authStore.showPinEntry = false
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen">
    
    <!-- 1. 初回起動時：だれがつかう？画面 -->
    <transition name="fade">
      <RoleSelectionModal 
        v-if="!isRoleSelected && !showChildSelection" 
        @select-child-role="handleSelectChildRole" 
        @select-parent-role="handleSelectParentRole" 
      />
    </transition>

    <!-- 子ども選択画面 (初回 & 切り替え共通) -->
    <transition name="fade">
      <ChildSelectionModal 
        v-if="showChildSelection" 
        @child-selected="handleChildSelected"
        @close="showChildSelection = false"
        :can-close="isRoleSelected || currentChildId !== null"
      />
    </transition>

    <!-- 2. PINコード設定画面 -->
    <transition name="fade">
      <PinSetupModal v-if="showPinSetup" @close="closePinSetup" />
    </transition>

    <!-- 6. 子どもの初期登録モーダル (子ども画面からの誘導用) -->
    <transition name="fade">
      <ChildRegisterModal 
        v-if="showChildRegisterFromChild" 
        :is-from-child="true"
        @back-to-roles="showChildRegisterFromChild = false"
        @close="showChildRegisterFromChild = false"
      />
    </transition>

    <!-- 3. PINコード入力画面 -->
    <transition name="fade">
      <PinEntryModal v-if="showPinEntry" @close="closePinEntry" />
    </transition>

    <!-- 4. じぶんの目標 追加モーダル (子ども画面用) -->
    <transition name="fade">
      <ChildGoalAddModal v-if="showChildAddModal" @close="showChildAddModal = false" />
    </transition>

    <!-- 5. 子どもの初期登録モーダル (保護者画面用) -->
    <transition name="fade">
      <ChildRegisterModal v-if="isParentMode && childStore.children.length === 0" @back-to-roles="authStore.resetRole()" />
    </transition>

    <!-- Stylized Toast Notification -->
    <AppToast />

    <!-- Header -->
    <AppHeader 
      v-if="isRoleSelected"
      @toggle-mode="handleToggleMode" 
      @change-child="showChildSelection = true" 
    />

    <main v-if="isRoleSelected" class="flex-grow">
      <ParentDashboard v-if="isParentMode" />
      <ChildDashboard v-else @openAddGoal="showChildAddModal = true" />
    </main>

    <!-- Celebration Modal -->
    <transition name="fade">
      <CelebrationModal 
        v-if="allDone && !isParentMode && showCelebration && isRoleSelected" 
        @close="showCelebration = false" 
        @refire="fireConfetti" 
      />
    </transition>
    <!-- Dynamic Footer Layout -->
    <footer class="mt-8 py-4 text-center text-[11px] text-slate-400 font-medium border-t border-dashed border-slate-200">
      <span v-if="isParentMode" class="font-sans">
        Parental Control System &copy; 2026 - 宿題管理エンジン搭載
      </span>
      <span v-else class="font-kids">
        きょうのしゅくだいアプリ &copy; 2026 ・ 親子でもっと楽しく宿題管理
      </span>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
