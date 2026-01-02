import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useSounds() {
  const settingsStore = useSettingsStore()
  const audioContext = ref(null)

  // Initialize Web Audio API
  function initAudio() {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContext.value
  }

  // Generate beep sound
  function playBeep(frequency = 440, duration = 100) {
    if (!settingsStore.settings.soundEnabled) return

    const ctx = initAudio()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration / 1000)
  }

  function playCountSound() {
    playBeep(600, 50)
  }

  function playTargetReachedSound() {
    playBeep(800, 100)
    setTimeout(() => playBeep(1000, 100), 150)
    setTimeout(() => playBeep(1200, 150), 300)
  }

  return {
    playCountSound,
    playTargetReachedSound
  }
}
