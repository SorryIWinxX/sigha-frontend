<template>
    <div class="flex items-center gap-4">
        <div :class="[
            modelValue ? 'bg-[#67B83C]' : 'bg-gray-300',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]" @click="toggle" class="w-14 transition-all duration-500 h-8 flex items-center rounded-full p-1">
            <div :class="{ 'translate-x-6': modelValue }"
                class="w-6 h-6 transition-all duration-500 transform bg-white rounded-full shadow-md">
            </div>
        </div>
        <span class="text-sm text-gray-600">
            {{ modelValue ? activeText : inactiveText }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    activeText: {
        type: String,
        default: 'Activo'
    },
    inactiveText: {
        type: String,
        default: 'Inactivo'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
    if (props.disabled) return
    emit('update:modelValue', !props.modelValue)
}
</script>