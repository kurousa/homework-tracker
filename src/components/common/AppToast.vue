<script setup>
import { useToastStore } from '@/stores/useToastStore'
import { useAuthStore } from '@/stores/useAuthStore'

const toastStore = useToastStore()
const authStore = useAuthStore()
</script>

<template>
  <div v-if="toastStore.message" 
       :class="[authStore.isParentMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-rose-500 text-white', 'fixed top-5 left-1/2 -translate-x-1/2 z-50 font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 transform translate-y-0']">
    <i :class="authStore.isParentMode ? 'fa-solid fa-bell text-blue-400' : 'fa-solid fa-circle-exclamation text-lg'"></i>
    <span class="text-sm tracking-wide">{{ toastStore.message }}</span>
  </div>
</template>
