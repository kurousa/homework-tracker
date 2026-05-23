import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PinEntryModal from '@/components/modals/PinEntryModal.vue'
import { useAuthStore } from '@/stores/useAuthStore'

describe('PinEntryModal.vue', () => {
  let wrapper
  let authStore

  beforeEach(() => {
    wrapper = mount(PinEntryModal, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      }
    })
    authStore = useAuthStore()
  })

  it('renders correctly', () => {
    expect(wrapper.find('h2').text()).toBe('おうちのひとの かくにん')
  })

  it('verifies correct PIN', async () => {
    authStore.verifyPin.mockReturnValue(true)
    
    const input = wrapper.find('input')
    await input.setValue('1234')
    await wrapper.find('button').trigger('click')
    
    expect(authStore.verifyPin).toHaveBeenCalledWith('1234')
    expect(wrapper.vm.pinError).toBe('')
    expect(wrapper.vm.pinInput).toBe('')
  })

  it('shows error for incorrect PIN', async () => {
    authStore.verifyPin.mockReturnValue(false)
    
    const input = wrapper.find('input')
    await input.setValue('0000')
    await wrapper.find('button').trigger('click')
    
    expect(authStore.verifyPin).toHaveBeenCalledWith('0000')
    expect(wrapper.vm.pinError).toBe('PINコードがちがいます')
  })

  it('emits close event on cancel', async () => {
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click') // もどる button
    
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
