import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const defaultRole = localStorage.getItem('homework_default_role')
  const isRoleSelected = ref(defaultRole !== null)
  const isParentMode = ref(defaultRole === 'parent')
  
  const parentPin = ref(localStorage.getItem('homework_parent_pin'))
  const showPinSetup = ref(false)
  const showPinEntry = ref(false)

  watch(parentPin, (newVal) => {
    if (newVal) {
      localStorage.setItem('homework_parent_pin', newVal)
    } else {
      localStorage.removeItem('homework_parent_pin')
    }
  })

  const setRole = (role) => {
    localStorage.setItem('homework_default_role', role)
    isParentMode.value = (role === 'parent')
    isRoleSelected.value = true
  }

  const setupPin = (pin) => {
    parentPin.value = pin
    showPinSetup.value = false
    setRole('parent') // automatically switch to parent mode
  }

  const verifyPin = (pin) => {
    if (pin === parentPin.value) {
      isParentMode.value = true
      showPinEntry.value = false
      return true
    }
    return false
  }

  const toggleMode = () => {
    if (isParentMode.value) {
      // switch to child mode immediately
      isParentMode.value = false
    } else {
      // switch to parent mode requires PIN
      if (parentPin.value) {
        showPinEntry.value = true
      } else {
        showPinSetup.value = true
      }
    }
  }

  const resetRole = () => {
    localStorage.removeItem('homework_default_role')
    isParentMode.value = false
    isRoleSelected.value = false
  }

  return { 
    isRoleSelected, isParentMode, parentPin, 
    showPinSetup, showPinEntry, 
    setRole, setupPin, verifyPin, toggleMode, resetRole 
  }
})
