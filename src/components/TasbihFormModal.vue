<script setup>
import { ref, watch } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  open: Boolean,
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  },
  tasbih: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:open', 'submit'])

const name = ref('')
const targetCount = ref(33)
const arabic = ref('')
const transliteration = ref('')

// Reset form when modal opens or tasbih changes
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.mode === 'edit' && props.tasbih) {
        name.value = props.tasbih.name
        targetCount.value = props.tasbih.targetCount
        arabic.value = props.tasbih.arabic || ''
        transliteration.value = props.tasbih.transliteration || ''
      } else {
        name.value = ''
        targetCount.value = 33
        arabic.value = ''
        transliteration.value = ''
      }
    }
  }
)

function handleSubmit() {
  if (!name.value.trim()) {
    alert('Sila masukkan nama')
    return
  }

  if (!targetCount.value || targetCount.value < 1) {
    alert('Sila masukkan sasaran kiraan yang sah')
    return
  }

  emit('submit', {
    name: name.value.trim(),
    targetCount: parseInt(targetCount.value),
    arabic: arabic.value.trim() || null,
    transliteration: transliteration.value.trim() || null
  })

  emit('update:open', false)
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Modal
    :open="open"
    :title="mode === 'create' ? 'Cipta Tasbih Baru' : 'Kemaskini Tasbih'"
    @update:open="$emit('update:open', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium mb-2">Nama *</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="SubhanAllah"
          required
          class="w-full px-3 py-2 rounded-lg"
          style="
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          "
        />
      </div>

      <!-- Target Count -->
      <div>
        <label for="target" class="block text-sm font-medium mb-2">Sasaran Kiraan *</label>
        <input
          id="target"
          v-model.number="targetCount"
          type="number"
          min="1"
          step="1"
          required
          class="w-full px-3 py-2 rounded-lg"
          style="
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          "
        />
      </div>

      <!-- Arabic Text (Optional) -->
      <div>
        <label for="arabic" class="block text-sm font-medium mb-2">
          Teks Arab (Pilihan)
        </label>
        <input
          id="arabic"
          v-model="arabic"
          type="text"
          placeholder="سُبْحَانَ ٱللَّٰهِ"
          dir="rtl"
          class="w-full px-3 py-2 rounded-lg text-xl"
          style="
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            font-family: serif;
          "
        />
      </div>

      <!-- Transliteration (Optional) -->
      <div>
        <label for="transliteration" class="block text-sm font-medium mb-2">
          Transliterasi (Pilihan)
        </label>
        <input
          id="transliteration"
          v-model="transliteration"
          type="text"
          placeholder="Subḥān Allāh"
          class="w-full px-3 py-2 rounded-lg"
          style="
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
          "
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button
          type="button"
          @click="close"
          class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          class="flex-1 px-4 py-2 rounded-lg transition-colors"
          style="
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
          "
        >
          {{ mode === 'create' ? 'Cipta' : 'Simpan' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
