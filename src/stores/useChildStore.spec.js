import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useChildStore } from './useChildStore'
import { useAuthStore } from './useAuthStore'

describe('useChildStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default child as empty array', () => {
    const store = useChildStore()
    expect(store.children.length).toBe(0)
    expect(store.currentChildId).toBe(null)
  })

  it('computes activeChildId based on isParentMode', () => {
    const store = useChildStore()
    const authStore = useAuthStore()
    
    // Add mock children since initial state is empty
    store.addChild('けんた', '👦') // id: 1
    store.addChild('さくら', '👧') // id: 2

    authStore.isParentMode = true
    store.selectChild(2, true)
    
    expect(store.activeChildId).toBe(2)
    
    authStore.isParentMode = false
    store.selectChild(1, false)
    
    expect(store.activeChildId).toBe(1)
  })

  it('adds a new child', () => {
    const store = useChildStore()
    const initialCount = store.children.length
    
    const added = store.addChild('たろう', '🐶')
    
    expect(store.children.length).toBe(initialCount + 1)
    expect(added.name).toBe('たろう')
    expect(added.icon).toBe('🐶')
    expect(added.id).toBe(1) // first child id will be 1
  })

  it('deletes a child and handles selection fallback', () => {
    const store = useChildStore()
    
    // Add 3 children
    store.addChild('けんた', '👦') // id: 1
    store.addChild('さくら', '👧') // id: 2
    store.addChild('たろう', '🐶') // id: 3
    expect(store.children.length).toBe(3)
    
    store.selectChild(3, true)
    store.selectChild(3, false)
    expect(store.parentSelectedChildId).toBe(3)
    expect(store.currentChildId).toBe(3)
    
    const result = store.deleteChild(3)
    expect(result).toBe(true)
    expect(store.children.length).toBe(2)
    
    expect(store.parentSelectedChildId).toBe(1)
    expect(store.currentChildId).toBe(1)
  })

  it('allows deleting the last child and resets IDs', () => {
    const store = useChildStore()
    
    // Add 2 children
    store.addChild('けんた', '👦') // id: 1
    store.addChild('さくら', '👧') // id: 2
    expect(store.children.length).toBe(2)

    const res1 = store.deleteChild(2)
    expect(res1).toBe(true)
    expect(store.children.length).toBe(1)
    
    const res2 = store.deleteChild(1)
    expect(res2).toBe(true)
    expect(store.children.length).toBe(0)
    expect(store.currentChildId).toBe(null)
    expect(store.parentSelectedChildId).toBe(null)
  })
})
