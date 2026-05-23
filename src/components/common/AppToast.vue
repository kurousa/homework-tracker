<script setup>
import { useToastStore } from '@/stores/useToastStore'
import { useAuthStore } from '@/stores/useAuthStore'

const toastStore = useToastStore()
const authStore = useAuthStore()

const handleClose = (id) => {
  toastStore.removeToast(id)
}
</script>

<template>
  <!-- 画面の右下に配置。他の要素へのクリックを邪魔しないようにpointer-events-noneを設定 -->
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col items-end space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        :class="[
          authStore.isParentMode 
            ? 'bg-slate-800 text-slate-100 border border-slate-700 font-professional shadow-xl' 
            : 'bg-rose-500 text-white font-kids shadow-rose-200/50 shadow-lg',
          'pointer-events-auto py-3 px-5 rounded-2xl flex items-center justify-between space-x-3 w-full sm:w-auto min-w-[280px] transition-all duration-300 transform'
        ]"
      >
        <div class="flex items-center space-x-2.5 flex-1 min-w-0">
          <i :class="[
            authStore.isParentMode 
              ? 'fa-solid fa-bell text-blue-400' 
              : 'fa-solid fa-circle-exclamation text-lg text-white'
          ]"></i>
          <span class="text-sm font-bold tracking-wide break-words">{{ toast.message }}</span>
        </div>
        <!-- 閉じるボタン -->
        <button 
          @click="handleClose(toast.id)" 
          class="flex-shrink-0 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none ml-2 cursor-pointer"
          aria-label="閉じる"
        >
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Transition Group Animations */
.toast-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-list-leave-active {
  position: absolute;
  width: 100%;
}
@media (min-width: 640px) {
  .toast-list-leave-active {
    width: auto;
  }
}
</style>
