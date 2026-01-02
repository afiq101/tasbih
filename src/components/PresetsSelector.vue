<script setup>
import { ref, computed } from 'vue'
import { useTasbihStore, DHIKR_TEMPLATES } from '@/stores/tasbih'
import { Sparkles } from 'lucide-vue-next'
import Modal from './Modal.vue'
import ConfirmModal from './ConfirmModal.vue'

defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open'])

const tasbihStore = useTasbihStore()

const showConfirm = ref(false)
const selectedTemplateKey = ref(null)

const selectedTemplate = computed(() => {
  if (!selectedTemplateKey.value) return null
  return DHIKR_TEMPLATES[selectedTemplateKey.value]
})

const confirmMessage = computed(() => {
  if (!selectedTemplate.value) return ''
  return `Ini akan mencipta ${selectedTemplate.value.tasbihs.length} tasbih baharu:\n\n${selectedTemplate.value.tasbihs.map((t) => `• ${t.name} (${t.targetCount})`).join('\n')}`
})

function handleSelectTemplate(templateKey) {
  selectedTemplateKey.value = templateKey
  showConfirm.value = true
}

function confirmAddTemplate() {
  if (selectedTemplateKey.value) {
    tasbihStore.createFromTemplate(selectedTemplateKey.value)
    emit('update:open', false)
    selectedTemplateKey.value = null
  }
}
</script>

<template>
  <Modal :open="open" title="Templat Zikir" @update:open="$emit('update:open', $event)">
    <p class="text-sm text-muted-foreground">
      Tambah set zikir biasa dengan cepat menggunakan kiraan dan teks Arab yang telah dikonfigurasi.
    </p>

    <div class="space-y-3">
        <button
          v-for="(template, key) in DHIKR_TEMPLATES"
          :key="key"
          @click="handleSelectTemplate(key)"
          class="w-full text-left p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
              <Sparkles :size="20" :style="{ color: 'hsl(var(--primary))' }" />
            </div>
            <div class="flex-1">
              <div class="font-semibold">{{ template.name }}</div>
              <div class="text-sm text-muted-foreground mt-1">
                {{ template.description }}
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="(tasbih, idx) in template.tasbihs"
                  :key="idx"
                  class="text-xs px-2 py-1 rounded-full bg-secondary"
                >
                  {{ tasbih.name }} ({{ tasbih.targetCount }})
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
  </Modal>

  <ConfirmModal
    v-model:open="showConfirm"
    :title="`Tambah ${selectedTemplate?.name}?`"
    :message="confirmMessage"
    confirm-text="Tambah Templat"
    cancel-text="Batal"
    @confirm="confirmAddTemplate"
  />
</template>
