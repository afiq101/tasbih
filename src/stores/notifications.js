import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'

export const useNotificationsStore = defineStore('notifications', () => {
  const permissionGranted = ref(false)
  const reminderIntervalId = ref(null)

  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      permissionGranted.value = true
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      permissionGranted.value = permission === 'granted'
      return permissionGranted.value
    }

    return false
  }

  function showNotification(title, options = {}) {
    if (permissionGranted.value && 'Notification' in window) {
      new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      })
    }
  }

  function showTargetReachedNotification(tasbihName, count) {
    showNotification('Target Reached!', {
      body: `You've completed ${count} for ${tasbihName}`,
      tag: 'target-reached',
      vibrate: [200, 100, 200]
    })
  }

  function showReminderNotification() {
    showNotification('Time for Tasbih', {
      body: 'Remember to do your prayer counting',
      tag: 'reminder',
      requireInteraction: false
    })
  }

  function startPeriodicReminder() {
    const settingsStore = useSettingsStore()

    if (reminderIntervalId.value) {
      clearInterval(reminderIntervalId.value)
    }

    if (settingsStore.settings.reminderEnabled && permissionGranted.value) {
      const intervalMs = settingsStore.settings.reminderInterval * 60 * 1000
      reminderIntervalId.value = setInterval(() => {
        showReminderNotification()
      }, intervalMs)
    }
  }

  function stopPeriodicReminder() {
    if (reminderIntervalId.value) {
      clearInterval(reminderIntervalId.value)
      reminderIntervalId.value = null
    }
  }

  return {
    permissionGranted,
    requestPermission,
    showNotification,
    showTargetReachedNotification,
    showReminderNotification,
    startPeriodicReminder,
    stopPeriodicReminder
  }
})
