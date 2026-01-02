<script setup>
const props = defineProps({
  reached: Boolean
})

defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    class="rounded-full text-xl font-bold transition-all active:scale-95 select-none touch-manipulation shadow-lg flex items-center justify-center"
    :style="{
      width: '220px',
      height: '220px',
      backgroundColor: reached ? '#10b981' : 'hsl(var(--primary))',
      color: reached ? 'white' : 'hsl(var(--primary-foreground))'
    }"
  >
    {{ reached ? 'Teruskan' : 'Tekan untuk Kira' }}
  </button>
</template>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}
</style>
