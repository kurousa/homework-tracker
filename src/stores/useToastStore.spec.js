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
    expect(store.toasts.length).toBe(0)

    store.triggerToast('Test Message', 'success')
    expect(store.isVisible).toBe(true)
    expect(store.message).toBe('Test Message')
    expect(store.type).toBe('success')
    expect(store.toasts.length).toBe(1)

    vi.advanceTimersByTime(3000)
    expect(store.isVisible).toBe(false)
    expect(store.toasts.length).toBe(0)
  })

  it('supports stacking multiple toasts and auto-hides them independently', () => {
    const store = useToastStore()
    
    store.triggerToast('First Message', 'success')
    vi.advanceTimersByTime(1000) // 1秒経過
    
    store.triggerToast('Second Message', 'error')
    
    expect(store.toasts.length).toBe(2)
    expect(store.toasts[0].message).toBe('First Message')
    expect(store.toasts[1].message).toBe('Second Message')
    expect(store.message).toBe('Second Message') // 最新のトーストメッセージを返す

    vi.advanceTimersByTime(2000) // さらに2秒経過（合計3秒経過、最初のトーストが消えるはず）
    expect(store.toasts.length).toBe(1)
    expect(store.toasts[0].message).toBe('Second Message')

    vi.advanceTimersByTime(1000) // さらに1秒経過（合計4秒経過、2つ目も消えるはず）
    expect(store.toasts.length).toBe(0)
    expect(store.isVisible).toBe(false)
  })

  it('supports manually removing a toast by id', () => {
    const store = useToastStore()
    
    store.triggerToast('Message to delete', 'success')
    const toastId = store.toasts[0].id
    
    expect(store.toasts.length).toBe(1)
    
    store.removeToast(toastId)
    expect(store.toasts.length).toBe(0)
    expect(store.isVisible).toBe(false)
  })
})
