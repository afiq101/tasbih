<script setup>
const props = defineProps({
  reached: Boolean
})

defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    class="rounded-full text-2xl font-bold transition-all active:scale-95 select-none touch-manipulation shadow-lg flex items-center justify-center"
    :style="{
      width: '280px',
      height: '280px',
      backgroundColor: reached ? '#10b981' : 'hsl(var(--primary))',
      color: reached ? 'white' : 'hsl(var(--primary-foreground))'
    }"
  >
    {{ reached ? 'Continue' : 'Tap to Count' }}
  </button>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}
</style>
