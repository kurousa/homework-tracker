<script setup>
import { useChildStore } from '@/stores/useChildStore'
import { useAuthStore } from '@/stores/useAuthStore'

const childStore = useChildStore()
const authStore = useAuthStore()

const emit = defineEmits(['select', 'close'])

const selectChild = (id) => {
  childStore.selectChild(id, authStore.isParentMode)
  emit('select', id)
}
</script>
<template>
  <div class="fixed inset-0 bg-amber-50/95 backdrop-blur-md flex flex-col justify-center items-center z-[115] p-6 text-center font-kids">
    <h2 class="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-12">だれが つかう？</h2>
    <div class="flex flex-wrap gap-6 w-full max-w-2xl justify-center">
      <button v-for="child in childStore.children" :key="child.id" @click="selectChild(child.id)"
              class="bg-white border-4 border-emerald-300 rounded-3xl p-8 shadow-[0_8px_0_0_#6ee7b7] hover:translate-y-1 hover:shadow-[0_4px_0_0_#6ee7b7] active:translate-y-2 active:shadow-none transition-all group min-w-[200px]">
        <div class="text-7xl mb-4 group-hover:scale-110 transition-transform">{{ child.icon }}</div>
        <h3 class="text-2xl font-black text-emerald-700">{{ child.name }}</h3>
      </button>
    </div>
    <button v-if="authStore.isRoleSelected || childStore.currentChildId" @click="$emit('close')" class="mt-12 text-slate-500 font-bold underline text-lg hover:text-slate-700">もどる</button>
  </div>
</template>
