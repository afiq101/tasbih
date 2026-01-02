<script setup>
defineProps({
  progress: Number,
  reached: Boolean
})
</script>

<template>
  <div class="relative">
    <div class="w-full bg-secondary rounded-full h-3 overflow-hidden">
      <div
        class="h-full transition-all duration-300 rounded-full"
        :class="reached ? 'bg-green-500' : 'bg-primary'"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <div class="text-center text-sm text-muted-foreground mt-2">
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>
