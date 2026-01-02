<script setup>
import { ref, computed } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-vue-next'

const tasbihStore = useTasbihStore()
const expanded = ref(false)

const history = computed(() => tasbihStore.activeTasbih?.history || [])

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString()
}

function handleClearHistory() {
  if (confirm('Clear all history? This cannot be undone.')) {
    tasbihStore.clearHistory(tasbihStore.activeTasbih.id)
  }
}
</script>

<template>
  <div v-if="tasbihStore.activeTasbih" class="border rounded-lg overflow-hidden">
    <button
      @click="expanded = !expanded"
      class="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
    >
      <div class="flex items-center gap-3">
        <span class="font-semibold">History</span>
        <span class="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
          {{ history.length }} sessions
        </span>
      </div>
      <ChevronDown v-if="!expanded" :size="20" />
      <ChevronUp v-else :size="20" />
    </button>

    <div v-if="expanded" class="border-t">
      <div v-if="history.length === 0" class="text-center text-muted-foreground py-8">
        No history yet
      </div>
      <div v-else>
        <div class="max-h-64 overflow-y-auto">
          <div
            v-for="session in history"
            :key="session.id"
            class="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-secondary/50"
          >
            <div>
              <div class="font-semibold">{{ session.count }} counts</div>
              <div class="text-sm text-muted-foreground">
                {{ formatDate(session.completedAt) }}
              </div>
            </div>
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="session.completed
                ? 'bg-green-500/10 text-green-600'
                : 'bg-secondary text-secondary-foreground'"
            >
              {{ session.completed ? 'Completed' : 'Partial' }}
            </span>
          </div>
        </div>
        <div class="p-3 border-t">
          <button
            @click="handleClearHistory"
            class="w-full px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            style="background-color: hsl(var(--destructive)); color: hsl(var(--destructive-foreground))"
          >
            <Trash2 :size="16" />
            Clear All History
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
