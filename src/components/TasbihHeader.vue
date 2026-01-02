<script setup>
import { Settings } from 'lucide-vue-next'

defineEmits(['open-settings'])
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold">Tasbih</h1>
    <button
      @click="$emit('open-settings')"
      class="p-2 rounded-lg hover:bg-secondary transition-colors"
      aria-label="Settings"
    >
      <Settings :size="24" />
    </button>
  </div>
</template>
