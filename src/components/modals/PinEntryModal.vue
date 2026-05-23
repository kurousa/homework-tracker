<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const pinInput = ref('')
const pinError = ref('')
const pinInputRef = ref(null)

const emit = defineEmits(['close'])

const verifyPin = () => {
  if (authStore.verifyPin(pinInput.value)) {
    pinInput.value = ''
    pinError.value = ''
  } else {
    pinError.value = 'PINコードがちがいます'
    pinInput.value = ''
    if (pinInputRef.value) pinInputRef.value.focus()
  }
}

const cancel = () => {
  pinInput.value = ''
  pinError.value = ''
  emit('close')
}

onMounted(() => {
  if (pinInputRef.value) pinInputRef.value.focus()
})
</script>
<template>
  <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-[110] p-4 font-professional">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 overflow-hidden transform transition-all">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4 shadow-inner">
          <i class="fa-solid fa-shield-halved text-3xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800">おうちのひとの かくにん</h2>
        <p class="text-sm text-slate-500 mt-2 font-medium">ここからさきは、おうちのひとに<br>パスワードを いれてもらってね。</p>
      </div>
      
      <div class="space-y-4">
        <input ref="pinInputRef" v-model="pinInput" type="password" maxlength="4" inputmode="numeric" @keyup.enter="verifyPin" class="w-full text-center text-3xl tracking-[0.5em] font-mono bg-slate-50 border-2 border-slate-200 rounded-xl py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all" placeholder="••••" />
        
        <p v-if="pinError" class="text-rose-500 text-sm font-bold text-center animate-pulse">{{ pinError }}</p>
      </div>
      
      <div class="mt-8 flex flex-col gap-3">
        <button @click="verifyPin" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">あける</button>
        <button @click="cancel" class="w-full bg-transparent hover:bg-slate-100 text-slate-500 font-bold py-3 rounded-xl transition-colors">もどる</button>
      </div>
    </div>
  </div>
</template>
