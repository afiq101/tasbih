import { useSettingsStore } from '@/stores/settings'

export function useHaptics() {
  const settingsStore = useSettingsStore()

  function vibrate(pattern = [50]) {
    if (!settingsStore.settings.vibrationEnabled) return

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  function lightTap() {
    vibrate([10])
  }

  function mediumTap() {
    vibrate([50])
  }

  function successPattern() {
    vibrate([100, 50, 100, 50, 100])
  }

  function errorPattern() {
    vibrate([200])
  }

  return {
    vibrate,
    lightTap,
    mediumTap,
    successPattern,
    errorPattern
  }
}
