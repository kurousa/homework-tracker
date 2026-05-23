import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useHomeworkStore } from './useHomeworkStore'
import { useChildStore } from './useChildStore'
import { useAuthStore } from './useAuthStore'

describe('useHomeworkStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default homeworks if local storage is empty', () => {
    const store = useHomeworkStore()
    expect(store.homeworks.length).toBe(2)
  })

  it('adds a new homework', () => {
    const store = useHomeworkStore()
    const initialCount = store.homeworks.length
    
    store.addHomework({
      subject: '理科',
      title: 'テスト勉強',
      childId: 1,
      type: 'parent'
    })
    
    expect(store.homeworks.length).toBe(initialCount + 1)
    const newHomework = store.homeworks[store.homeworks.length - 1]
    expect(newHomework.subject).toBe('理科')
    expect(newHomework.is_completed).toBe(false)
  })

  it('toggles homework completion status', () => {
    const store = useHomeworkStore()
    const target = store.homeworks[0]
    const currentStatus = target.is_completed
    
    store.toggleComplete(target.id)
    
    expect(store.homeworks[0].is_completed).toBe(!currentStatus)
  })

  it('calculates progress percentage correctly', () => {
    const store = useHomeworkStore()
    const childStore = useChildStore()
    
    // childStore.children is ['たろう', 'はなこ', 'じろう'] by default.
    const activeChildId = childStore.children[0].id
    childStore.selectChild(activeChildId, false)
    
    // clear homeworks and add 2 for the active child
    store.homeworks = [
      { id: 1, is_completed: true, childId: activeChildId, type: 'parent' },
      { id: 2, is_completed: false, childId: activeChildId, type: 'parent' }
    ]
    
    // progress should be 50%
    expect(store.progressPercentage).toBe(50)
    expect(store.allDone).toBe(false)
    
    store.toggleComplete(2)
    
    // progress should be 100%
    expect(store.progressPercentage).toBe(100)
    expect(store.allDone).toBe(true)
  })
})
