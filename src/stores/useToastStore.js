import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  // 後方互換性のための計算プロパティ
  const message = computed(() => {
    const lastToast = toasts.value.slice(-1)[0]
    return lastToast ? lastToast.message : ''
  })
  const type = computed(() => {
    const lastToast = toasts.value.slice(-1)[0]
    return lastToast ? lastToast.type : 'success'
  })
  const isVisible = computed(() => toasts.value.length > 0)

  const triggerToast = (msg, msgType = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 11)
    toasts.value.push({
      id,
      message: msg,
      type: msgType
    })

    // 3秒後に自動削除
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, message, type, isVisible, triggerToast, removeToast }
})
