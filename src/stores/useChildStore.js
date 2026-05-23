import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './useAuthStore'

export const useChildStore = defineStore('child', () => {
  const STORAGE_KEY_CHILDREN = 'family_homework_children'
  const STORAGE_KEY_CURRENT_CHILD = 'family_homework_current_child_id'

  const children = ref(JSON.parse(localStorage.getItem(STORAGE_KEY_CHILDREN)) || [])

  watch(children, (newItems) => {
    localStorage.setItem(STORAGE_KEY_CHILDREN, JSON.stringify(newItems))
  }, { deep: true })

  const savedCurrentChildId = localStorage.getItem(STORAGE_KEY_CURRENT_CHILD)
  const currentChildId = ref(savedCurrentChildId ? parseInt(savedCurrentChildId) : null)
  const parentSelectedChildId = ref(children.value[0]?.id || null)

  const activeChildId = computed(() => {
    const authStore = useAuthStore()
    return authStore.isParentMode ? parentSelectedChildId.value : currentChildId.value
  })

  const selectChild = (childId, isParentModeActive) => {
    const numericId = Number(childId)
    if (isParentModeActive) {
      parentSelectedChildId.value = numericId
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT_CHILD, numericId.toString())
      currentChildId.value = numericId
    }
  }

  const addChild = (name, icon) => {
    if (!name.trim()) return null
    const newId = children.value.length > 0 ? Math.max(...children.value.map(c => Number(c.id))) + 1 : 1
    const newChild = { id: newId, name: name.trim(), icon: icon || '👦' }
    children.value.push(newChild)

    // 最初に追加した子どもをデフォルト選択状態にする
    if (children.value.length === 1) {
      parentSelectedChildId.value = newId
    }
    return newChild
  }

  const deleteChild = (childId) => {
    const targetId = Number(childId)
    children.value = children.value.filter(c => Number(c.id) !== targetId)

    // 子どもが0人になった場合はすべてリセット
    if (children.value.length === 0) {
      parentSelectedChildId.value = null
      currentChildId.value = null
      localStorage.removeItem(STORAGE_KEY_CURRENT_CHILD)
    } else {
      // Handle case where deleted child was currently selected
      if (parentSelectedChildId.value !== null && Number(parentSelectedChildId.value) === targetId) {
        parentSelectedChildId.value = children.value[0]?.id || null
      }
      if (currentChildId.value !== null && Number(currentChildId.value) === targetId) {
        const nextId = children.value[0]?.id || null
        currentChildId.value = nextId
        if (nextId) {
          localStorage.setItem(STORAGE_KEY_CURRENT_CHILD, nextId.toString())
        } else {
          localStorage.removeItem(STORAGE_KEY_CURRENT_CHILD)
        }
      }
    }
    return true
  }

  return { children, currentChildId, parentSelectedChildId, activeChildId, selectChild, addChild, deleteChild }
})
