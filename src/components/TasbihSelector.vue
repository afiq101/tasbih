<script setup>
import { ref, computed } from 'vue'
import { useTasbihStore } from '@/stores/tasbih'
import { Plus, Pencil } from 'lucide-vue-next'
import TasbihFormModal from './TasbihFormModal.vue'
import ConfirmModal from './ConfirmModal.vue'

const tasbihStore = useTasbihStore()

const tasbihs = computed(() => tasbihStore.tasbihsList)

const showModal = ref(false)
const modalMode = ref('create')
const editingTasbih = ref(null)

const showDeleteConfirm = ref(false)
const deletingTasbihId = ref(null)

function handleSelect(id) {
  tasbihStore.setActiveTasbih(id)
}

function handleCreate() {
  modalMode.value = 'create'
  editingTasbih.value = null
  showModal.value = true
}

function handleEdit(tasbih, event) {
  event.stopPropagation()
  modalMode.value = 'edit'
  editingTasbih.value = tasbih
  showModal.value = true
}

function handleDelete(id, event) {
  event.stopPropagation()
  deletingTasbihId.value = id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (deletingTasbihId.value) {
    tasbihStore.deleteTasbih(deletingTasbihId.value)
    deletingTasbihId.value = null
  }
}

function handleFormSubmit(data) {
  if (modalMode.value === 'create') {
    tasbihStore.createTasbih(data.name, data.targetCount, data.arabic, data.transliteration)
  } else if (modalMode.value === 'edit' && editingTasbih.value) {
    tasbihStore.updateTasbih(editingTasbih.value.id, {
      name: data.name,
      targetCount: data.targetCount,
      arabic: data.arabic,
      transliteration: data.transliteration
    })
  }
}
</script>

<template>
  <div v-if="tasbihs.length > 0" class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-muted-foreground">Tasbih Anda</h3>
      <button
        @click="handleCreate"
        class="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Tambah tasbih baharu"
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
        <div class="absolute top-1 right-1 flex gap-1">
          <button
            @click="(e) => handleEdit(tasbih, e)"
            class="p-1 rounded hover:bg-secondary transition-colors"
            aria-label="Kemaskini"
          >
            <Pencil :size="12" />
          </button>
          <button
            v-if="tasbihs.length > 1"
            @click="(e) => handleDelete(tasbih.id, e)"
            class="px-1.5 py-0.5 text-xs rounded hover:bg-destructive hover:text-destructive-foreground"
          >
            ×
          </button>
        </div>
      </button>
    </div>
  </div>
  <div v-else class="text-center py-8">
    <button
      @click="handleCreate"
      class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
    >
      Cipta Tasbih Pertama Anda
    </button>
  </div>

  <TasbihFormModal
    v-model:open="showModal"
    :mode="modalMode"
    :tasbih="editingTasbih"
    @submit="handleFormSubmit"
  />

  <ConfirmModal
    v-model:open="showDeleteConfirm"
    title="Padam Tasbih"
    message="Adakah anda pasti ingin memadam tasbih ini? Tindakan ini tidak boleh dibatalkan."
    confirm-text="Padam"
    cancel-text="Batal"
    destructive
    @confirm="confirmDelete"
  />
</template>
