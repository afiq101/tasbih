<script setup>
defineProps({
  open: Boolean,
  title: String
})

const emit = defineEmits(['update:open'])

function close() {
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
    @click.self="close"
  >
    <div
      class="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto"
      style="background-color: hsl(var(--background)); color: hsl(var(--foreground))"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <button
          @click="close"
          class="text-2xl rounded-lg px-2 transition-colors hover:opacity-80"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>
