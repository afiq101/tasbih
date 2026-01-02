import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useTasbihStore = defineStore('tasbih', () => {
  // State - persisted to localStorage
  const tasbihs = useStorage('tasbihs', [], localStorage, {
    serializer: {
      read: (v) => v ? JSON.parse(v) : [],
      write: (v) => JSON.stringify(v)
    }
  })

  const activeTasbihId = useStorage('activeTasbihId', null, localStorage)

  // Computed
  const activeTasbih = computed(() => {
    if (!activeTasbihId.value) return null
    return tasbihs.value.find(t => t.id === activeTasbihId.value)
  })

  const tasbihsList = computed(() => {
    return tasbihs.value.sort((a, b) => b.updatedAt - a.updatedAt)
  })

  // Actions
  function createTasbih(name, targetCount = 33) {
    const newTasbih = {
      id: Date.now().toString(),
      name,
      targetCount,
      currentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: []
    }
    tasbihs.value.push(newTasbih)
    activeTasbihId.value = newTasbih.id
    return newTasbih
  }

  function deleteTasbih(id) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasbihs.value.splice(index, 1)
      if (activeTasbihId.value === id) {
        activeTasbihId.value = tasbihs.value[0]?.id || null
      }
    }
  }

  function updateTasbih(id, updates) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasbihs.value[index] = {
        ...tasbihs.value[index],
        ...updates,
        updatedAt: Date.now()
      }
    }
  }

  function increment(id) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasbihs.value[index] = {
        ...tasbihs.value[index],
        currentCount: tasbihs.value[index].currentCount + 1,
        updatedAt: Date.now()
      }
    }
  }

  function reset(id) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1 && tasbihs.value[index].currentCount > 0) {
      const tasbih = tasbihs.value[index]

      // Save to history
      const session = {
        id: Date.now().toString(),
        count: tasbih.currentCount,
        targetCount: tasbih.targetCount,
        completedAt: Date.now(),
        completed: tasbih.currentCount >= tasbih.targetCount
      }

      const newHistory = [session, ...tasbih.history]

      // Limit history to last 100 sessions
      if (newHistory.length > 100) {
        newHistory.length = 100
      }

      // Reset count
      tasbihs.value[index] = {
        ...tasbih,
        currentCount: 0,
        history: newHistory,
        updatedAt: Date.now()
      }
    }
  }

  function setActiveTasbih(id) {
    activeTasbihId.value = id
  }

  function clearHistory(id) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasbihs.value[index] = {
        ...tasbihs.value[index],
        history: [],
        updatedAt: Date.now()
      }
    }
  }

  return {
    tasbihs,
    activeTasbihId,
    activeTasbih,
    tasbihsList,
    createTasbih,
    deleteTasbih,
    updateTasbih,
    increment,
    reset,
    setActiveTasbih,
    clearHistory
  }
})
