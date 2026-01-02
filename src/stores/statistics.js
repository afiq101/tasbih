import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useTasbihStore } from './tasbih'

export const useStatisticsStore = defineStore('statistics', () => {
  // State - persisted to localStorage
  const completionDates = useStorage('completionDates', [], localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : []),
      write: (v) => JSON.stringify(v)
    }
  })

  // Computed - Current streak
  const currentStreak = computed(() => {
    if (completionDates.value.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sortedDates = [...completionDates.value]
      .map((d) => new Date(d))
      .sort((a, b) => b - a)

    let streak = 0
    let checkDate = new Date(today)

    for (const date of sortedDates) {
      const completionDate = new Date(date)
      completionDate.setHours(0, 0, 0, 0)

      if (completionDate.getTime() === checkDate.getTime()) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (completionDate.getTime() < checkDate.getTime()) {
        break
      }
    }

    return streak
  })

  // Computed - Total statistics from tasbih store
  const totalStats = computed(() => {
    const tasbihStore = useTasbihStore()
    const tasbihs = tasbihStore.tasbihs

    let totalLifetimeCount = 0
    let totalCompletedSessions = 0
    const tasbihUsage = {}

    tasbihs.forEach((tasbih) => {
      // Add current count
      totalLifetimeCount += tasbih.currentCount

      // Process history
      tasbih.history.forEach((session) => {
        totalLifetimeCount += session.count
        if (session.completed) {
          totalCompletedSessions++
        }

        // Track usage per tasbih
        if (!tasbihUsage[tasbih.name]) {
          tasbihUsage[tasbih.name] = 0
        }
        tasbihUsage[tasbih.name] += session.count
      })

      // Add current count to usage
      if (!tasbihUsage[tasbih.name]) {
        tasbihUsage[tasbih.name] = 0
      }
      tasbihUsage[tasbih.name] += tasbih.currentCount
    })

    // Find most used tasbih
    let mostUsedTasbih = null
    let maxCount = 0
    Object.entries(tasbihUsage).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostUsedTasbih = name
      }
    })

    // Calculate estimated time (assuming ~1 second per count)
    const estimatedTimeMinutes = Math.round(totalLifetimeCount / 60)

    return {
      totalLifetimeCount,
      totalCompletedSessions,
      mostUsedTasbih,
      mostUsedCount: maxCount,
      estimatedTimeMinutes,
      tasbihUsage
    }
  })

  // Computed - Daily/Weekly/Monthly averages
  const averages = computed(() => {
    const tasbihStore = useTasbihStore()
    const tasbihs = tasbihStore.tasbihs

    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const oneWeekMs = 7 * oneDayMs
    const oneMonthMs = 30 * oneDayMs

    let dailyCount = 0
    let weeklyCount = 0
    let monthlyCount = 0

    tasbihs.forEach((tasbih) => {
      // Current count is today
      dailyCount += tasbih.currentCount
      weeklyCount += tasbih.currentCount
      monthlyCount += tasbih.currentCount

      tasbih.history.forEach((session) => {
        const age = now - session.completedAt

        if (age < oneDayMs) {
          dailyCount += session.count
        }
        if (age < oneWeekMs) {
          weeklyCount += session.count
        }
        if (age < oneMonthMs) {
          monthlyCount += session.count
        }
      })
    })

    return {
      daily: dailyCount,
      weekly: Math.round(weeklyCount / 7),
      monthly: Math.round(monthlyCount / 30)
    }
  })

  // Actions
  function recordCompletionToday() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    // Only add if not already recorded today
    if (!completionDates.value.includes(todayStr)) {
      completionDates.value.push(todayStr)
    }
  }

  function resetStreak() {
    completionDates.value = []
  }

  return {
    completionDates,
    currentStreak,
    totalStats,
    averages,
    recordCompletionToday,
    resetStreak
  }
})
