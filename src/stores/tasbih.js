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
    const tasbih = tasbihs.value.find(t => t.id === id)
    if (tasbih) {
      Object.assign(tasbih, updates, { updatedAt: Date.now() })
    }
  }

  function increment(id) {
    const tasbih = tasbihs.value.find(t => t.id === id)
    if (tasbih) {
      tasbih.currentCount++
      tasbih.updatedAt = Date.now()
    }
  }

  function reset(id) {
    const tasbih = tasbihs.value.find(t => t.id === id)
    if (tasbih && tasbih.currentCount > 0) {
      // Save to history
      const session = {
        id: Date.now().toString(),
        count: tasbih.currentCount,
        targetCount: tasbih.targetCount,
        completedAt: Date.now(),
        completed: tasbih.currentCount >= tasbih.targetCount
      }
      tasbih.history.unshift(session)

      // Limit history to last 100 sessions
      if (tasbih.history.length > 100) {
        tasbih.history = tasbih.history.slice(0, 100)
      }

      // Reset count
      tasbih.currentCount = 0
      tasbih.updatedAt = Date.now()
    }
  }

  function setActiveTasbih(id) {
    activeTasbihId.value = id
  }

  function clearHistory(id) {
    const tasbih = tasbihs.value.find(t => t.id === id)
    if (tasbih) {
      tasbih.history = []
      tasbih.updatedAt = Date.now()
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
