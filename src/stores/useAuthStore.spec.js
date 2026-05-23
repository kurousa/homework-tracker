import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with false role selection if no local storage', () => {
    const store = useAuthStore()
    expect(store.isRoleSelected).toBe(false)
  })

  it('sets role and updates local storage', () => {
    const store = useAuthStore()
    store.setRole('parent')
    expect(store.isRoleSelected).toBe(true)
    expect(store.isParentMode).toBe(true)
    expect(localStorage.getItem('homework_default_role')).toBe('parent')
  })

  it('verifies correct PIN', () => {
    const store = useAuthStore()
    store.setupPin('1234')
    expect(store.parentPin).toBe('1234')
    
    // Switch to child
    store.isParentMode = false
    
    // Verify PIN
    const isSuccess = store.verifyPin('1234')
    expect(isSuccess).toBe(true)
    expect(store.isParentMode).toBe(true)
  })
})
