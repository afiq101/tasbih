<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationsStore } from '@/stores/notifications'
import { useWakeLock } from '@/composables/useWakeLock'
import TasbihHeader from '@/components/TasbihHeader.vue'
import TasbihSelector from '@/components/TasbihSelector.vue'
import TasbihCounter from '@/components/TasbihCounter.vue'
import TasbihActions from '@/components/TasbihActions.vue'
import TasbihHistory from '@/components/TasbihHistory.vue'
import TasbihSettings from '@/components/TasbihSettings.vue'

const tasbihStore = useTasbihStore()
const settingsStore = useSettingsStore()
const notificationsStore = useNotificationsStore()
const { requestWakeLock, releaseWakeLock } = useWakeLock()

const showSettings = ref(false)

onMounted(async () => {
  // Apply dark mode
  if (settingsStore.settings.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  // Request notification permission
  await notificationsStore.requestPermission()

  // Setup wake lock
  if (settingsStore.settings.keepScreenAwake) {
    await requestWakeLock()
  }

  // Start periodic reminders if enabled
  if (settingsStore.settings.reminderEnabled && notificationsStore.permissionGranted) {
    notificationsStore.startPeriodicReminder()
  }

  // Create default tasbih if none exist
  if (tasbihStore.tasbihs.length === 0) {
    tasbihStore.createTasbih('SubhanAllah', 33)
  } else if (!tasbihStore.activeTasbihId) {
    // Set first tasbih as active if none is active
    tasbihStore.setActiveTasbih(tasbihStore.tasbihs[0].id)
  }
})

// Watch for settings changes
watch(() => settingsStore.settings.keepScreenAwake, async (newValue) => {
  if (newValue) {
    await requestWakeLock()
  } else {
    await releaseWakeLock()
  }
})

watch(() => settingsStore.settings.reminderEnabled, (newValue) => {
  if (newValue && notificationsStore.permissionGranted) {
    notificationsStore.startPeriodicReminder()
  } else {
    notificationsStore.stopPeriodicReminder()
  }
})

watch(() => settingsStore.settings.reminderInterval, () => {
  if (settingsStore.settings.reminderEnabled && notificationsStore.permissionGranted) {
    notificationsStore.stopPeriodicReminder()
    notificationsStore.startPeriodicReminder()
  }
})

watch(() => settingsStore.settings.theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// Settings control
function openSettings() {
  showSettings.value = true
}

// Expose settings opener to header
defineExpose({ openSettings })
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container max-w-md mx-auto px-4 py-6 space-y-6">
      <TasbihHeader @open-settings="showSettings = true" />
      <TasbihSelector />
      <TasbihCounter />
      <TasbihActions />
      <TasbihHistory />
    </div>

    <TasbihSettings v-model:open="showSettings" />
  </div>
</template>
