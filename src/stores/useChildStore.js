import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './useAuthStore'

export const useChildStore = defineStore('child', () => {
  const STORAGE_KEY_CHILDREN = 'family_homework_children'
  const STORAGE_KEY_CURRENT_CHILD = 'family_homework_current_child_id'

  const children = ref(JSON.parse(localStorage.getItem(STORAGE_KEY_CHILDREN)) || [
    { id: 1, name: 'けんた', icon: '👦' },
    { id: 2, name: 'さくら', icon: '👧' }
  ])

  watch(children, (newItems) => {
    localStorage.setItem(STORAGE_KEY_CHILDREN, JSON.stringify(newItems))
  }, { deep: true })

  const savedCurrentChildId = localStorage.getItem(STORAGE_KEY_CURRENT_CHILD)
  const currentChildId = ref(savedCurrentChildId ? parseInt(savedCurrentChildId) : null)
  const parentSelectedChildId = ref(children.value[0]?.id)

  const activeChildId = computed(() => {
    const authStore = useAuthStore()
    return authStore.isParentMode ? parentSelectedChildId.value : currentChildId.value
  })

  const selectChild = (childId, isParentModeActive) => {
    if (isParentModeActive) {
      parentSelectedChildId.value = childId
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT_CHILD, childId.toString())
      currentChildId.value = childId
    }
  }

  return { children, currentChildId, parentSelectedChildId, activeChildId, selectChild }
})
