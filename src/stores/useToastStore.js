import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref('success')
  const isVisible = ref(false)
  let timeoutId = null

  const triggerToast = (msg, msgType = 'success') => {
    message.value = msg
    type.value = msgType
    isVisible.value = true

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return { message, type, isVisible, triggerToast }
})
