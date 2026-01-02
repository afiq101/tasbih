<script setup>
import { ref, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-vue-next'

const statisticsStore = useStatisticsStore()
const showStats = ref(false)

const stats = computed(() => statisticsStore.totalStats)
const averages = computed(() => statisticsStore.averages)
const streak = computed(() => statisticsStore.currentStreak)

function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}
</script>

<template>
  <div class="border border-border rounded-lg">
    <button
      @click="showStats = !showStats"
      class="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors rounded-lg"
    >
      <div class="flex items-center gap-2">
        <BarChart3 :size="20" />
        <span class="font-semibold">Statistik</span>
      </div>
      <ChevronDown v-if="!showStats" :size="20" />
      <ChevronUp v-if="showStats" :size="20" />
    </button>

    <div v-if="showStats" class="p-4 pt-0 space-y-4">
      <!-- Streak -->
      <div class="grid grid-cols-1 gap-3">
        <div class="p-3 rounded-lg bg-secondary/50">
          <div class="text-xs text-muted-foreground uppercase tracking-wide">
            Rekod Berturut Semasa
          </div>
          <div class="text-2xl font-bold mt-1">
            {{ streak }} hari
          </div>
        </div>
      </div>

      <!-- Lifetime Stats -->
      <div>
        <h4 class="text-sm font-semibold mb-2">Sepanjang Masa</h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Jumlah Kiraan</div>
            <div class="text-xl font-bold mt-1">
              {{ stats.totalLifetimeCount.toLocaleString() }}
            </div>
          </div>
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Selesai</div>
            <div class="text-xl font-bold mt-1">{{ stats.totalCompletedSessions }}</div>
          </div>
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Masa Dihabiskan</div>
            <div class="text-xl font-bold mt-1">
              {{ formatTime(stats.estimatedTimeMinutes) }}
            </div>
          </div>
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Paling Kerap</div>
            <div class="text-sm font-bold mt-1 truncate">
              {{ stats.mostUsedTasbih || 'T/A' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Averages -->
      <div>
        <h4 class="text-sm font-semibold mb-2">Purata Harian</h4>
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Hari Ini</div>
            <div class="text-lg font-bold mt-1">{{ averages.daily }}</div>
          </div>
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Purata Minggu</div>
            <div class="text-lg font-bold mt-1">{{ averages.weekly }}</div>
          </div>
          <div class="p-3 rounded-lg bg-secondary/50">
            <div class="text-xs text-muted-foreground">Purata Bulan</div>
            <div class="text-lg font-bold mt-1">{{ averages.monthly }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
