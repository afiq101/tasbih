<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useNotificationsStore } from '@/stores/notifications'
import { useStatisticsStore } from '@/stores/statistics'
import Modal from './Modal.vue'
import ConfirmModal from './ConfirmModal.vue'

defineProps({
  open: Boolean
})

defineEmits(['update:open'])

const settingsStore = useSettingsStore()
const notificationsStore = useNotificationsStore()
const statisticsStore = useStatisticsStore()
const showResetConfirm = ref(false)

async function requestNotificationPermission() {
  await notificationsStore.requestPermission()
  if (notificationsStore.permissionGranted && settingsStore.settings.reminderEnabled) {
    notificationsStore.startPeriodicReminder()
  }
}

function handleResetStreak() {
  statisticsStore.resetStreak()
  showResetConfirm.value = false
}
</script>

<template>
  <Modal :open="open" title="Tetapan" @update:open="$emit('update:open', $event)">
    <div class="space-y-4">
        <!-- Vibration -->
        <div class="flex items-center justify-between">
          <label for="vibration" class="font-medium">Getar maklum balas</label>
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
          <label for="sound" class="font-medium">Kesan bunyi</label>
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
          <label for="wake" class="font-medium">Kekalkan skrin aktif</label>
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
            <label for="reminder" class="font-medium">Peringatan berkala</label>
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
              Jarak peringatan (minit)
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
            Benarkan Pemberitahuan
          </button>
        </div>

        <!-- Reset Streak -->
        <div class="pt-4" style="border-top: 1px solid hsl(var(--border))">
          <button
            @click="showResetConfirm = true"
            class="w-full px-4 py-2 rounded-lg transition-colors border border-border hover:bg-destructive/10 hover:border-destructive"
            style="color: hsl(var(--destructive))"
          >
            Tetap Semula Rekod Berturut
          </button>
        </div>
      </div>

    <ConfirmModal
      :open="showResetConfirm"
      title="Tetap Semula Rekod Berturut?"
      message="Adakah anda pasti ingin menetapkan semula rekod berturut anda? Tindakan ini tidak boleh dibatalkan."
      confirm-text="Tetap Semula"
      :destructive="true"
      @update:open="showResetConfirm = $event"
      @confirm="handleResetStreak"
    />
  </Modal>
</template>
