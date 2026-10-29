import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useChildStore } from './useChildStore'

const STORAGE_KEY_ITEMS = 'family_homework_items'

export const useHomeworkStore = defineStore('homework', () => {
  const childStore = useChildStore()
  
  // Initialize from LocalStorage
  const savedData = localStorage.getItem(STORAGE_KEY_ITEMS)
  let initialHomeworks = savedData ? JSON.parse(savedData) : []
  
  // Set default items if empty and children exist
  if (initialHomeworks.length === 0 && childStore.children.length > 0) {
    const defaultChildId = childStore.children[0].id
    initialHomeworks = [
      { id: 1, subject: '国語', title: 'かんじドリル 3ページ', is_completed: false, childId: defaultChildId, type: 'parent' },
      { id: 2, subject: '算数', title: 'ぷりんと 1まい', is_completed: true, childId: defaultChildId, type: 'parent' }
    ]
  }
  
  const homeworks = ref(initialHomeworks)

  // Watch and sync to LocalStorage
  watch(homeworks, (newItems) => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems))
  }, { deep: true })

  // Getters
  const activeHomeworks = computed(() => {
    const activeId = childStore.activeChildId
    return homeworks.value.filter(h => h.childId === activeId)
  })

  const parentHomeworks = computed(() => {
    return activeHomeworks.value.filter(h => h.type !== 'self')
  })

  const childGoals = computed(() => {
    return activeHomeworks.value.filter(h => h.type === 'self')
  })

  // Perf optimization: Count completed items without allocating intermediate arrays via .filter()
  const completedCount = computed(() => {
    let count = 0
    const list = activeHomeworks.value
    for (let i = 0; i < list.length; i++) {
      if (list[i].is_completed) count++
    }
    return count
  })

  const progressPercentage = computed(() => {
    const list = activeHomeworks.value
    if (list.length === 0) return 0
    return Math.round((completedCount.value / list.length) * 100)
  })

  // Perf optimization: Early exit loop instead of .every() array iteration
  const allDone = computed(() => {
    const list = activeHomeworks.value
    if (list.length === 0) return false
    for (let i = 0; i < list.length; i++) {
      if (!list[i].is_completed) return false
    }
    return true
  })

  // Actions
  // Perf optimization: Find max ID in single loop without allocating intermediate array via .map() and spreading
  const addHomework = (homeworkData) => {
    let maxId = 0
    const list = homeworks.value
    for (let i = 0; i < list.length; i++) {
      if (list[i].id > maxId) {
        maxId = list[i].id
      }
    }
    homeworks.value.push({
      id: maxId + 1,
      is_completed: false,
      ...homeworkData
    })
  }

  const deleteHomework = (id) => {
    homeworks.value = homeworks.value.filter(item => item.id !== id)
  }

  const toggleComplete = (id) => {
    const item = homeworks.value.find(h => h.id === id)
    if (item) {
      item.is_completed = !item.is_completed
    }
  }

  const updateHomework = (id, updates) => {
    const index = homeworks.value.findIndex(h => h.id === id)
    if (index !== -1) {
      homeworks.value[index] = { ...homeworks.value[index], ...updates }
    }
  }

  const deleteHomeworksForChild = (childId) => {
    homeworks.value = homeworks.value.filter(h => h.childId !== childId)
  }

  return {
    homeworks,
    activeHomeworks,
    parentHomeworks,
    childGoals,
    completedCount,
    progressPercentage,
    allDone,
    addHomework,
    deleteHomework,
    toggleComplete,
    updateHomework,
    deleteHomeworksForChild
  }
})
