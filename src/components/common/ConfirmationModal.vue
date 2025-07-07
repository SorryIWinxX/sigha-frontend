<template>
    <teleport to="body">
        <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div class="bg-white shadow-xl rounded-sm border border-gray-200 p-6 max-w-md w-full mx-4">
                <div class="text-center">
                    <h3 class="text-lg font-semibold text-[#3b3e45] mb-4">
                        {{ title }}
                    </h3>
                    <p class="text-sm text-[#666e7d] mb-6">
                        {{ message }}
                    </p>
                    <div class="flex justify-center gap-3">
                        <Button @click="handleCancel" :variant="cancelVariant">
                            {{ cancelText }}
                        </Button>
                        <Button @click="handleConfirm" :variant="confirmVariant">
                            {{ confirmText }}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import Button from './Button.vue'

// Props
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Confirmación'
    },
    message: {
        type: String,
        default: '¿Estás seguro de que deseas continuar?'
    },
    confirmText: {
        type: String,
        default: 'Confirmar'
    },
    cancelText: {
        type: String,
        default: 'Cancelar'
    },
    confirmVariant: {
        type: String,
        default: 'primary'
    },
    cancelVariant: {
        type: String,
        default: 'secondary'
    }
})

// Emits
const emit = defineEmits(['confirm', 'cancel'])

// Methods
const handleConfirm = () => {
    emit('confirm')
}

const handleCancel = () => {
    emit('cancel')
}
</script>
