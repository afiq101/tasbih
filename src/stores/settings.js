import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  // State with localStorage persistence
  const settings = useStorage('tasbih-settings', {
    vibrationEnabled: true,
    soundEnabled: true,
    keepScreenAwake: true,
    notificationsEnabled: false,
    reminderInterval: 60, // minutes
    reminderEnabled: false,
    theme: 'dark'
  }, localStorage)

  // Actions
  function updateSetting(key, value) {
    settings.value[key] = value
  }

  function toggleVibration() {
    settings.value.vibrationEnabled = !settings.value.vibrationEnabled
  }

  function toggleSound() {
    settings.value.soundEnabled = !settings.value.soundEnabled
  }

  function toggleScreenAwake() {
    settings.value.keepScreenAwake = !settings.value.keepScreenAwake
  }

  function toggleReminder() {
    settings.value.reminderEnabled = !settings.value.reminderEnabled
  }

  function setReminderInterval(minutes) {
    settings.value.reminderInterval = minutes
  }

  return {
    settings,
    updateSetting,
    toggleVibration,
    toggleSound,
    toggleScreenAwake,
    toggleReminder,
    setReminderInterval
  }
})
