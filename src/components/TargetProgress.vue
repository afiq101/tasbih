<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  progress: Number,
  reached: Boolean
})

const isPulsing = ref(false)

// Trigger pulse animation when progress changes
watch(() => props.progress, () => {
  isPulsing.value = true
  setTimeout(() => {
    isPulsing.value = false
  }, 400)
})
</script>

<template>
  <div class="relative px-2">
    <div class="w-full rounded-full overflow-hidden" :style="{
      height: '20px'
    }">
      <div class="h-full transition-all relative" :style="{
        width: `${Math.max(progress, 2)}%`,
        backgroundColor: reached ? '#10b981' : '#3b82f6',
        transitionDuration: '500ms',
        transitionTimingFunction: 'ease-out',
        transform: isPulsing ? 'scaleY(1.1)' : 'scaleY(1)',
        transformOrigin: 'left center'
      }">
        <div v-if="isPulsing" class="absolute inset-0 animate-pulse"
          :style="{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }" />
      </div>
    </div>
    <div class="text-center font-bold mt-2" :style="{
      fontSize: '16px',
      color: '#888'
    }">
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.1;
  }
}

.animate-pulse {
  animation: pulse 0.4s ease-in-out;
}
</style>
