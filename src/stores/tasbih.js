import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// Preset dhikr templates
export const DHIKR_TEMPLATES = {
  afterSalah: {
    name: 'Set Selepas Solat',
    description: 'Set lengkap zikir selepas solat fardhu',
    tasbihs: [
      {
        name: 'SubhanAllah',
        targetCount: 33,
        arabic: 'سُبْحَانَ ٱللَّٰهِ',
        transliteration: 'Subḥān Allāh'
      },
      {
        name: 'Alhamdulillah',
        targetCount: 33,
        arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
        transliteration: 'Al-ḥamdu lillāh'
      },
      {
        name: 'Allahu Akbar',
        targetCount: 34,
        arabic: 'ٱللَّٰهُ أَكْبَرُ',
        transliteration: 'Allāhu akbar'
      }
    ]
  },
  morning: {
    name: 'Zikir Pagi',
    description: 'Zikir pagi yang penting',
    tasbihs: [
      {
        name: 'Ayat al-Kursi',
        targetCount: 1,
        arabic: 'آيَةُ ٱلْكُرْسِيِّ',
        transliteration: 'Āyat al-Kursī'
      },
      {
        name: 'Last 3 Surahs',
        targetCount: 3,
        arabic: 'ٱلْمُعَوِّذَات',
        transliteration: "Al-Mu'awwidhāt"
      },
      {
        name: 'SubhanAllah wa bihamdihi',
        targetCount: 100,
        arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
        transliteration: 'Subḥān Allāhi wa biḥamdih'
      }
    ]
  },
  evening: {
    name: 'Zikir Petang',
    description: 'Zikir petang yang penting',
    tasbihs: [
      {
        name: 'Ayat al-Kursi',
        targetCount: 1,
        arabic: 'آيَةُ ٱلْكُرْسِيِّ',
        transliteration: 'Āyat al-Kursī'
      },
      {
        name: 'Last 3 Surahs',
        targetCount: 3,
        arabic: 'ٱلْمُعَوِّذَات',
        transliteration: "Al-Mu'awwidhāt"
      },
      {
        name: 'SubhanAllah wa bihamdihi',
        targetCount: 100,
        arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
        transliteration: 'Subḥān Allāhi wa biḥamdih'
      }
    ]
  },
  common: {
    name: 'Zikir Biasa',
    description: 'Zikir yang paling biasa dibaca',
    tasbihs: [
      {
        name: 'SubhanAllah',
        targetCount: 33,
        arabic: 'سُبْحَانَ ٱللَّٰهِ',
        transliteration: 'Subḥān Allāh'
      },
      {
        name: 'Alhamdulillah',
        targetCount: 33,
        arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
        transliteration: 'Al-ḥamdu lillāh'
      },
      {
        name: 'Allahu Akbar',
        targetCount: 33,
        arabic: 'ٱللَّٰهُ أَكْبَرُ',
        transliteration: 'Allāhu akbar'
      },
      {
        name: 'La ilaha illallah',
        targetCount: 100,
        arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
        transliteration: 'Lā ilāha illā Allāh'
      },
      {
        name: 'Astaghfirullah',
        targetCount: 100,
        arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
        transliteration: 'Astaghfiru Allāh'
      }
    ]
  },
  daily100: {
    name: 'Harian 100',
    description: 'Zikir harian yang disyorkan (100 kali setiap satu)',
    tasbihs: [
      {
        name: 'SubhanAllah wa bihamdihi',
        targetCount: 100,
        arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
        transliteration: 'Subḥān Allāhi wa biḥamdih'
      },
      {
        name: 'Astaghfirullah',
        targetCount: 100,
        arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
        transliteration: 'Astaghfiru Allāh'
      },
      {
        name: 'La hawla wa la quwwata illa billah',
        targetCount: 100,
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
        transliteration: 'Lā ḥawla wa lā quwwata illā billāh'
      }
    ]
  }
}

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
  function createTasbih(name, targetCount = 33, arabic = null, transliteration = null) {
    const newTasbih = {
      id: Date.now().toString(),
      name,
      targetCount,
      currentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [],
      arabic,
      transliteration
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

  function decrement(id) {
    const index = tasbihs.value.findIndex(t => t.id === id)
    if (index !== -1 && tasbihs.value[index].currentCount > 0) {
      tasbihs.value[index] = {
        ...tasbihs.value[index],
        currentCount: tasbihs.value[index].currentCount - 1,
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

      // Record completion in statistics if target was reached
      if (session.completed) {
        // Import statistics store dynamically to avoid circular dependency
        import('./statistics').then((module) => {
          const statisticsStore = module.useStatisticsStore()
          statisticsStore.recordCompletionToday()
        })
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

  function createFromTemplate(templateKey) {
    const template = DHIKR_TEMPLATES[templateKey]
    if (!template) return []

    const createdTasbihs = []
    const baseTime = Date.now()

    template.tasbihs.forEach((tasbihTemplate, index) => {
      const newTasbih = {
        id: (baseTime + index).toString(),
        name: tasbihTemplate.name,
        targetCount: tasbihTemplate.targetCount,
        currentCount: 0,
        createdAt: baseTime + index,
        updatedAt: baseTime + index,
        history: [],
        arabic: tasbihTemplate.arabic || null,
        transliteration: tasbihTemplate.transliteration || null
      }
      tasbihs.value.push(newTasbih)
      createdTasbihs.push(newTasbih)
    })

    // Set first tasbih as active
    if (createdTasbihs.length > 0) {
      activeTasbihId.value = createdTasbihs[0].id
    }

    return createdTasbihs
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
    decrement,
    reset,
    setActiveTasbih,
    clearHistory,
    createFromTemplate
  }
})
