<script setup>
defineProps({
  count: Number,
  target: Number,
  name: String
})
</script>

<template>
  <div class="text-center space-y-2">
    <h2 class="text-2xl font-semibold text-muted-foreground">{{ name }}</h2>
    <div class="text-7xl font-bold tabular-nums">
      {{ count }}
    </div>
    <p class="text-xl text-muted-foreground">
      of {{ target }}
    </p>
  </div>
</template>
