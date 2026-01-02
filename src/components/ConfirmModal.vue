<script setup>
import Modal from './Modal.vue'

defineProps({
  open: Boolean,
  title: {
    type: String,
    default: 'Sahkan'
  },
  message: String,
  confirmText: {
    type: String,
    default: 'Sahkan'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  destructive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <Modal :open="open" :title="title" @update:open="$emit('update:open', $event)">
    <div class="space-y-6">
      <p class="text-sm">{{ message }}</p>

      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 px-4 py-2 rounded-lg transition-colors"
          :style="
            destructive
              ? 'background-color: hsl(var(--destructive)); color: hsl(var(--destructive-foreground))'
              : 'background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground))'
          "
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </Modal>
</template>
