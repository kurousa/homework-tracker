<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useChildStore } from '@/stores/useChildStore'

const authStore = useAuthStore()
const childStore = useChildStore()

const emit = defineEmits(['toggle-mode', 'change-child'])

const toggleMode = () => {
  emit('toggle-mode')
}

const changeChild = () => {
  emit('change-child')
}
</script>

<template>
  <header :class="[
    authStore.isParentMode 
      ? 'bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6' 
      : 'bg-white rounded-3xl p-5 shadow-sm border-4 border-amber-200 mb-6'
  , 'theme-transition']">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      
      <!-- Header Left Info -->
      <div class="flex items-center space-x-3 text-center sm:text-left">
        <div :class="[authStore.isParentMode ? 'bg-slate-100 text-slate-600 rounded-md p-2 text-lg' : 'bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-2xl']">
          <i :class="authStore.isParentMode ? 'fa-solid fa-gear' : 'fa-solid fa-pencil-alt'"></i>
        </div>
        <div>
          <span :class="[authStore.isParentMode ? 'text-slate-400 text-[10px]' : 'text-amber-500 text-xs', 'font-bold tracking-wider block']">
            {{ authStore.isParentMode ? 'ADMINISTRATION CONSOLE' : 'STUDENT DASHBOARD' }}
          </span>
          <div class="flex items-center flex-wrap gap-2">
            <h1 :class="[authStore.isParentMode ? 'text-lg font-bold text-slate-800 tracking-tight' : 'text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight']">
              {{ authStore.isParentMode ? '保護者用 宿題管理システム' : (childStore.children.find(c => c.id === childStore.currentChildId)?.name || '') + 'の しゅくだい' }}
            </h1>
            <button v-if="!authStore.isParentMode" @click="changeChild" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-bold px-2 py-1 rounded-lg transition-colors flex items-center">
              <i class="fa-solid fa-users text-[10px] mr-1"></i>かえる
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mode Switcher button -->
      <button @click="toggleMode" 
              :class="[
                authStore.isParentMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition-colors'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold px-5 py-3 rounded-2xl shadow-[0_4px_0_0_#d97706] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#d97706] active:translate-y-[4px] active:shadow-none transition-all duration-100'
              , 'flex items-center space-x-2']">
        <i v-if="!authStore.isParentMode" class="fa-solid fa-lock opacity-50 mr-1"></i>
        <span>{{ authStore.isParentMode ? '👦 子ども画面へ切り替え' : '👩 保護者メニュー' }}</span>
      </button>
    </div>
  </header>
</template>
