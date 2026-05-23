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

  it('initializes with default homeworks as empty array if children are empty', () => {
    const store = useHomeworkStore()
    expect(store.homeworks.length).toBe(0)
  })

  it('adds a new homework', () => {
    const store = useHomeworkStore()
    const initialCount = store.homeworks.length // 0
    
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
    
    // Add mock homework since initially empty
    store.homeworks = [
      { id: 1, subject: '国語', title: 'テスト', is_completed: false, childId: 1, type: 'parent' }
    ]
    
    const target = store.homeworks[0]
    const currentStatus = target.is_completed
    
    store.toggleComplete(target.id)
    
    expect(store.homeworks[0].is_completed).toBe(!currentStatus)
  })

  it('calculates progress percentage correctly', () => {
    const store = useHomeworkStore()
    const childStore = useChildStore()
    
    // Add mock child since initial state is empty
    const addedChild = childStore.addChild('たろう', '👦')
    const activeChildId = addedChild.id
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

  it('deletes all homeworks for a specific child', () => {
    const store = useHomeworkStore()
    
    store.homeworks = [
      { id: 1, subject: '国語', title: '漢字', is_completed: false, childId: 1, type: 'parent' },
      { id: 2, subject: '算数', title: '計算', is_completed: false, childId: 2, type: 'parent' },
      { id: 3, subject: '理科', title: '観察', is_completed: false, childId: 1, type: 'parent' }
    ]
    
    store.deleteHomeworksForChild(1)
    
    expect(store.homeworks.length).toBe(1)
    expect(store.homeworks[0].id).toBe(2)
    expect(store.homeworks[0].childId).toBe(2)
  })
})
