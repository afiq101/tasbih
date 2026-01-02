<script setup>
import { computed } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { Plus } from 'lucide-vue-next'

const tasbihStore = useTasbihStore()

const tasbihs = computed(() => tasbihStore.tasbihsList)

function handleSelect(id) {
  tasbihStore.setActiveTasbih(id)
}

function handleCreate() {
  const name = prompt('Enter tasbih name:', 'SubhanAllah')
  if (name && name.trim()) {
    const target = prompt('Enter target count:', '33')
    if (target && !isNaN(target)) {
      tasbihStore.createTasbih(name.trim(), parseInt(target))
    }
  }
}

function handleDelete(id, event) {
  event.stopPropagation()
  if (confirm('Delete this tasbih?')) {
    tasbihStore.deleteTasbih(id)
  }
}
</script>

<template>
  <div v-if="tasbihs.length > 0" class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-muted-foreground">Your Tasbihs</h3>
      <button
        @click="handleCreate"
        class="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Add new tasbih"
      >
        <Plus :size="20" />
      </button>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="tasbih in tasbihs"
        :key="tasbih.id"
        @click="handleSelect(tasbih.id)"
        class="relative p-3 rounded-lg border transition-all"
        :class="tasbih.id === tasbihStore.activeTasbihId
          ? 'border-primary bg-primary/5'
          : 'border-border hover:bg-secondary'"
      >
        <div class="text-left">
          <div class="font-medium text-sm truncate">{{ tasbih.name }}</div>
          <div class="text-xs text-muted-foreground">
            {{ tasbih.currentCount }} / {{ tasbih.targetCount }}
          </div>
        </div>
        <button
          v-if="tasbihs.length > 1"
          @click="(e) => handleDelete(tasbih.id, e)"
          class="absolute top-1 right-1 px-1.5 py-0.5 text-xs rounded hover:bg-destructive hover:text-destructive-foreground"
        >
          ×
        </button>
      </button>
    </div>
  </div>
  <div v-else class="text-center py-8">
    <button
      @click="handleCreate"
      class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
    >
      Create Your First Tasbih
    </button>
  </div>
</template>
