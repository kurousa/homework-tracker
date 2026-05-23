import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PinSetupModal from '@/components/modals/PinSetupModal.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToastStore } from '@/stores/useToastStore'

describe('PinSetupModal.vue', () => {
  let wrapper
  let authStore
  let toastStore

  beforeEach(() => {
    wrapper = mount(PinSetupModal, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      }
    })
    authStore = useAuthStore()
    toastStore = useToastStore()
  })

  it('renders correctly', () => {
    expect(wrapper.find('h2').text()).toBe('PINコードの設定')
  })

  it('shows error if PIN is less than 4 digits', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('123')
    await inputs[1].setValue('123')
    
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click') // 設定する button
    
    expect(wrapper.vm.pinError).toBe('4桁の数字を入力してください')
    expect(authStore.setupPin).not.toHaveBeenCalled()
  })

  it('shows error if PINs do not match', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('1234')
    await inputs[1].setValue('1235')
    
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    
    expect(wrapper.vm.pinError).toBe('確認用のPINコードが一致しません')
    expect(authStore.setupPin).not.toHaveBeenCalled()
  })

  it('calls setupPin on success', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('1234')
    await inputs[1].setValue('1234')
    
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    
    expect(authStore.setupPin).toHaveBeenCalledWith('1234')
    expect(toastStore.triggerToast).toHaveBeenCalled()
    expect(wrapper.vm.pinError).toBe('')
  })

  it('emits close event on cancel', async () => {
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click') // キャンセル/戻る button
    
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
