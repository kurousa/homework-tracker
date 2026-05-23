<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'

const authStore = useAuthStore()
const toastStore = useToastStore()

const pinInput = ref('')
const pinConfirm = ref('')
const pinError = ref('')

const emit = defineEmits(['close'])

const setupPin = () => {
  if (pinInput.value.length !== 4) {
    pinError.value = '4桁の数字を入力してください'
    return
  }
  if (pinInput.value !== pinConfirm.value) {
    pinError.value = '確認用のPINコードが一致しません'
    return
  }
  
  authStore.setupPin(pinInput.value)
  toastStore.triggerToast('システムログ: 新規PINコードを設定しました')
  pinInput.value = ''
  pinConfirm.value = ''
  pinError.value = ''
}

const cancel = () => {
  pinInput.value = ''
  pinConfirm.value = ''
  pinError.value = ''
  emit('close')
}
</script>
<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4 font-professional">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          <i class="fa-solid fa-lock text-xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">PINコードの設定</h2>
        <p class="text-sm text-slate-500 mt-2">保護者画面をロックするための<br>4桁の数字を決めてください。</p>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">新しいPINコード（4桁）</label>
          <input v-model="pinInput" type="password" maxlength="4" inputmode="numeric" class="w-full text-center text-2xl tracking-[1em] font-mono bg-slate-50 border border-slate-300 rounded-lg py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">PINコード（確認用）</label>
          <input v-model="pinConfirm" type="password" maxlength="4" inputmode="numeric" @keyup.enter="setupPin" class="w-full text-center text-2xl tracking-[1em] font-mono bg-slate-50 border border-slate-300 rounded-lg py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
        </div>
        
        <p v-if="pinError" class="text-rose-500 text-sm font-semibold text-center animate-pulse">{{ pinError }}</p>
      </div>
      
      <div class="mt-8 flex gap-3">
        <button @click="cancel" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors">{{ authStore.isRoleSelected ? 'キャンセル' : '戻る' }}</button>
        <button @click="setupPin" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all">設定する</button>
      </div>
    </div>
  </div>
</template>
