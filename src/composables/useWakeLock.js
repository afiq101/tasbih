import { ref, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useWakeLock() {
  const wakeLock = ref(null)
  const isSupported = 'wakeLock' in navigator
  const settingsStore = useSettingsStore()

  async function requestWakeLock() {
    if (!isSupported || !settingsStore.settings.keepScreenAwake) return

    try {
      wakeLock.value = await navigator.wakeLock.request('screen')

      wakeLock.value.addEventListener('release', () => {
        console.log('Wake Lock released')
      })
    } catch (err) {
      console.error('Wake Lock error:', err)
    }
  }

  async function releaseWakeLock() {
    if (wakeLock.value) {
      await wakeLock.value.release()
      wakeLock.value = null
    }
  }

  onUnmounted(() => {
    releaseWakeLock()
  })

  return {
    isSupported,
    requestWakeLock,
    releaseWakeLock
  }
}
