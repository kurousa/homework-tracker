<script setup>
const emit = defineEmits(['close', 'refire'])
</script>

<template>
  <div class="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col justify-center items-center z-[150] p-6 text-center">
    <!-- Giant Award Cup -->
    <div class="mb-6 relative">
      <span class="text-8xl md:text-9xl block animate-bounce">🏆</span>
      <span class="absolute -top-3 -right-3 text-4xl animate-ping">✨</span>
      <span class="absolute -bottom-3 -left-3 text-4xl animate-ping delay-300">✨</span>
    </div>

    <h2 class="text-3xl md:text-5xl font-black text-rose-500 tracking-tight leading-snug celebrate-pulse mb-4 font-kids">
      🎉 ぜんぶ できたね！<br>
      すばらしい！ 🎉
    </h2>
    
    <p class="text-slate-600 font-bold max-w-sm mb-8 font-kids">
      きょうの しゅくだいは ぜんぶ おわり！<br>
      おうちの人に みせて、いっぱい ほめてもらおうね！
    </p>

    <!-- Celebration Control Panel -->
    <div class="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center font-kids">
      <button @click="$emit('refire')" 
              class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>もういちど 紙ふぶき！</span>
      </button>
      <button @click="$emit('close')" 
              class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-3 px-6 rounded-2xl active:translate-y-1 transition-all">
        閉じる
      </button>
    </div>
  </div>
</template>
