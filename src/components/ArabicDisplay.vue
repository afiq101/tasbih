<script setup>
defineProps({
  arabic: String,
  transliteration: String
})
</script>

<template>
  <div v-if="arabic || transliteration" class="text-center space-y-2 py-3">
    <div
      v-if="arabic"
      class="text-4xl font-bold"
      :style="{
        fontFamily: 'serif',
        direction: 'rtl',
        lineHeight: '1.6',
        color: 'hsl(var(--foreground))'
      }"
    >
      {{ arabic }}
    </div>
    <div
      v-if="transliteration"
      class="text-sm text-muted-foreground italic"
      :style="{ letterSpacing: '0.02em' }"
    >
      {{ transliteration }}
    </div>
  </div>
</template>
