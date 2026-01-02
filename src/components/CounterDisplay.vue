<script setup>
defineProps({
  count: Number,
  target: Number,
  name: String
})
</script>

<template>
  <div class="text-center space-y-1">
    <div class="text-5xl font-bold tabular-nums">
      {{ count }}
    </div>
    <p class="text-lg text-muted-foreground">
      of {{ target }}
    </p>
  </div>
</template>
