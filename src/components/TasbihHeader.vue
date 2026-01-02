<script setup>
import { Settings } from 'lucide-vue-next'
import StreakTracker from './StreakTracker.vue'

defineEmits(['open-settings'])
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Tasbih</h1>
      <button
        @click="$emit('open-settings')"
        class="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Tetapan"
      >
        <Settings :size="24" />
      </button>
    </div>
    <StreakTracker />
  </div>
</template>
