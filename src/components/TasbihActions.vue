<script setup>
import { ref } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { Minus } from 'lucide-vue-next'
import TasbihFormModal from './TasbihFormModal.vue'
import ConfirmModal from './ConfirmModal.vue'

const tasbihStore = useTasbihStore()

const showEditModal = ref(false)
const showResetConfirm = ref(false)

function handleDecrement() {
  if (tasbihStore.activeTasbih) {
    tasbihStore.decrement(tasbihStore.activeTasbih.id)
  }
}

function handleReset() {
  showResetConfirm.value = true
}

function confirmReset() {
  if (tasbihStore.activeTasbih) {
    tasbihStore.reset(tasbihStore.activeTasbih.id)
  }
}

function handleEdit() {
  showEditModal.value = true
}

function handleEditSubmit(data) {
  if (tasbihStore.activeTasbih) {
    tasbihStore.updateTasbih(tasbihStore.activeTasbih.id, {
      name: data.name,
      targetCount: data.targetCount,
      arabic: data.arabic,
      transliteration: data.transliteration
    })
  }
}
</script>

<template>
  <div v-if="tasbihStore.activeTasbih" class="flex gap-3">
    <button
      @click="handleDecrement"
      :disabled="tasbihStore.activeTasbih.currentCount === 0"
      class="px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Tolak kiraan sebanyak 1"
    >
      <Minus :size="18" />
    </button>
    <button
      @click="handleReset"
      class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
    >
      Tetap Semula
    </button>
    <button
      @click="handleEdit"
      class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
    >
      Kemaskini
    </button>
  </div>

  <TasbihFormModal
    v-model:open="showEditModal"
    mode="edit"
    :tasbih="tasbihStore.activeTasbih"
    @submit="handleEditSubmit"
  />

  <ConfirmModal
    v-model:open="showResetConfirm"
    title="Tetap Semula Kiraan"
    message="Tetap semula kiraan? Ini akan menyimpan kiraan semasa anda ke sejarah dan bermula dari 0."
    confirm-text="Tetap Semula"
    cancel-text="Batal"
    @confirm="confirmReset"
  />
</template>
