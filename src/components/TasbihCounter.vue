<script setup>
import { computed } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { useHaptics } from '@/composables/useHaptics'
import { useSounds } from '@/composables/useSounds'
import { useNotificationsStore } from '@/stores/notifications'
import CounterDisplay from './CounterDisplay.vue'
import TargetProgress from './TargetProgress.vue'
import CounterButton from './CounterButton.vue'

const tasbihStore = useTasbihStore()
const notificationsStore = useNotificationsStore()
const { lightTap, successPattern } = useHaptics()
const { playCountSound, playTargetReachedSound } = useSounds()

const activeTasbih = computed(() => tasbihStore.activeTasbih)
const progress = computed(() => {
  if (!activeTasbih.value) return 0
  return Math.min((activeTasbih.value.currentCount / activeTasbih.value.targetCount) * 100, 100)
})

const isTargetReached = computed(() => {
  if (!activeTasbih.value) return false
  return activeTasbih.value.currentCount >= activeTasbih.value.targetCount
})

function handleIncrement() {
  if (!activeTasbih.value) return

  const wasTargetReached = isTargetReached.value
  tasbihStore.increment(activeTasbih.value.id)

  // Haptic feedback
  lightTap()

  // Sound feedback
  playCountSound()

  // Check if target just reached
  if (!wasTargetReached && isTargetReached.value) {
    successPattern()
    playTargetReachedSound()
    notificationsStore.showTargetReachedNotification(
      activeTasbih.value.name,
      activeTasbih.value.currentCount
    )
  }
}
</script>

<template>
  <div v-if="activeTasbih" class="space-y-6">
    <CounterDisplay
      :count="activeTasbih.currentCount"
      :target="activeTasbih.targetCount"
      :name="activeTasbih.name"
    />
    <TargetProgress :progress="progress" :reached="isTargetReached" />
    <div class="flex justify-center">
      <CounterButton @click="handleIncrement" :reached="isTargetReached" />
    </div>
  </div>
</template>
