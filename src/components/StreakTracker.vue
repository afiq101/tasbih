<script setup>
import { computed } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { Flame } from 'lucide-vue-next'

const statisticsStore = useStatisticsStore()

const streak = computed(() => statisticsStore.currentStreak)
const hasStreak = computed(() => streak.value > 0)
</script>

<template>
  <div
    v-if="hasStreak"
    class="flex items-center gap-2 px-3 py-1.5 rounded-full"
    :style="{
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      border: '1px solid rgba(251, 146, 60, 0.3)'
    }"
  >
    <Flame :size="18" :style="{ color: '#fb923c' }" />
    <span class="text-sm font-bold" :style="{ color: '#fb923c' }">
      {{ streak }} hari
    </span>
  </div>
</template>
