<script setup>
import { ref } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'

const tasbihStore = useTasbihStore()
const showEditDialog = ref(false)

function handleReset() {
  if (confirm('Reset counter? This will save current count to history.')) {
    tasbihStore.reset(tasbihStore.activeTasbih.id)
  }
}

function handleEdit() {
  const newName = prompt('Enter new name:', tasbihStore.activeTasbih.name)
  if (newName && newName.trim()) {
    const newTarget = prompt('Enter new target:', tasbihStore.activeTasbih.targetCount)
    if (newTarget && !isNaN(newTarget)) {
      tasbihStore.updateTasbih(tasbihStore.activeTasbih.id, {
        name: newName.trim(),
        targetCount: parseInt(newTarget)
      })
    }
  }
}
</script>

<template>
  <div v-if="tasbihStore.activeTasbih" class="flex gap-3">
    <button
      @click="handleReset"
      class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
    >
      Reset
    </button>
    <button
      @click="handleEdit"
      class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
    >
      Edit
    </button>
  </div>
</template>
