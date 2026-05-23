import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useChildStore } from './useChildStore'
import { useAuthStore } from './useAuthStore'

describe('useChildStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default child', () => {
    const store = useChildStore()
    expect(store.children.length).toBe(2)
    expect(store.currentChildId).toBe(null)
  })

  it('computes activeChildId based on isParentMode', () => {
    const store = useChildStore()
    const authStore = useAuthStore()
    
    authStore.isParentMode = true
    store.selectChild(2, true)
    
    expect(store.activeChildId).toBe(2)
    
    authStore.isParentMode = false
    store.selectChild(1, false)
    
    expect(store.activeChildId).toBe(1)
  })
})
