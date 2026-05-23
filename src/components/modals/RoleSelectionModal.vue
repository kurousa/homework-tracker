<script setup>
const emit = defineEmits(['select-child-role', 'select-parent-role'])
</script>
<template>
  <div class="fixed inset-0 bg-amber-50/95 backdrop-blur-md flex flex-col justify-center items-center z-[100] p-6 text-center font-kids">
    <h2 class="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-12">だれが つかう？</h2>
    <div class="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
      <button @click="$emit('select-child-role')" class="flex-1 bg-white border-4 border-amber-300 rounded-3xl p-8 shadow-[0_8px_0_0_#fcd34d] hover:translate-y-1 hover:shadow-[0_4px_0_0_#fcd34d] active:translate-y-2 active:shadow-none transition-all group">
        <div class="text-7xl mb-4 group-hover:scale-110 transition-transform">👦</div>
        <h3 class="text-2xl font-black text-amber-700">子どもの画面</h3>
        <p class="text-amber-600 mt-2 font-bold">（しゅくだいチェック）</p>
      </button>
      <button @click="$emit('select-parent-role')" class="flex-1 bg-white border-4 border-blue-300 rounded-3xl p-8 shadow-[0_8px_0_0_#93c5fd] hover:translate-y-1 hover:shadow-[0_4px_0_0_#93c5fd] active:translate-y-2 active:shadow-none transition-all group">
        <div class="text-7xl mb-4 group-hover:scale-110 transition-transform">👩</div>
        <h3 class="text-2xl font-black text-blue-700">保護者の画面</h3>
        <p class="text-blue-600 mt-2 font-bold">（しゅくだい登録）</p>
      </button>
    </div>
  </div>
</template>
