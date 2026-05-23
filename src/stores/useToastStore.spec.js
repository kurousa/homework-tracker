import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToastStore } from './useToastStore'

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('triggers a toast and auto-hides it after 3 seconds', () => {
    const store = useToastStore()
    expect(store.isVisible).toBe(false)

    store.triggerToast('Test Message', 'success')
    expect(store.isVisible).toBe(true)
    expect(store.message).toBe('Test Message')
    expect(store.type).toBe('success')

    vi.advanceTimersByTime(3000)
    expect(store.isVisible).toBe(false)
  })
})
