<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useNotificationsStore } from '@/stores/notifications'

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open'])

const settingsStore = useSettingsStore()
const notificationsStore = useNotificationsStore()

async function requestNotificationPermission() {
  await notificationsStore.requestPermission()
  if (notificationsStore.permissionGranted && settingsStore.settings.reminderEnabled) {
    notificationsStore.startPeriodicReminder()
  }
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
    @click.self="close"
  >
    <div class="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto" style="background-color: hsl(var(--background)); color: hsl(var(--foreground))">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Settings</h2>
        <button
          @click="close"
          class="text-2xl rounded-lg px-2 transition-colors hover:opacity-80"
        >
          ×
        </button>
      </div>

      <div class="space-y-4">
        <!-- Vibration -->
        <div class="flex items-center justify-between">
          <label for="vibration" class="font-medium">Vibration feedback</label>
          <input
            id="vibration"
            type="checkbox"
            :checked="settingsStore.settings.vibrationEnabled"
            @change="settingsStore.toggleVibration"
            class="w-5 h-5"
          />
        </div>

        <!-- Sound -->
        <div class="flex items-center justify-between">
          <label for="sound" class="font-medium">Sound effects</label>
          <input
            id="sound"
            type="checkbox"
            :checked="settingsStore.settings.soundEnabled"
            @change="settingsStore.toggleSound"
            class="w-5 h-5"
          />
        </div>

        <!-- Screen Awake -->
        <div class="flex items-center justify-between">
          <label for="wake" class="font-medium">Keep screen awake</label>
          <input
            id="wake"
            type="checkbox"
            :checked="settingsStore.settings.keepScreenAwake"
            @change="settingsStore.toggleScreenAwake"
            class="w-5 h-5"
          />
        </div>

        <div class="pt-4" style="border-top: 1px solid hsl(var(--border))">
          <!-- Reminders -->
          <div class="flex items-center justify-between mb-3">
            <label for="reminder" class="font-medium">Periodic reminders</label>
            <input
              id="reminder"
              type="checkbox"
              :checked="settingsStore.settings.reminderEnabled"
              @change="settingsStore.toggleReminder"
              class="w-5 h-5"
            />
          </div>

          <div v-if="settingsStore.settings.reminderEnabled" class="space-y-2 pl-4">
            <label for="interval" class="text-sm" style="color: hsl(var(--muted-foreground))">
              Reminder interval (minutes)
            </label>
            <input
              id="interval"
              type="number"
              :value="settingsStore.settings.reminderInterval"
              @input="settingsStore.setReminderInterval(Number($event.target.value))"
              min="5"
              step="5"
              class="w-full px-3 py-2 rounded-lg"
              style="border: 1px solid hsl(var(--border)); background-color: hsl(var(--background))"
            />
          </div>

          <button
            v-if="!notificationsStore.permissionGranted"
            @click="requestNotificationPermission"
            class="mt-3 w-full px-4 py-2 rounded-lg transition-colors"
            style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
          >
            Enable Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
