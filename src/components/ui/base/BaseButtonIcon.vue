<template>
    <button :class="buttonClasses" :disabled="disabled || loading" :title="title" @click="handleClick">
        <component :is="loading ? LoaderIcon : icon" :class="iconClass" />
    </button>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const LoaderIcon = Loader2

const props = defineProps({
    icon: {
        type: [Object, Function],
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    variant: {
        type: String,
        default: 'default', // 'default', 'danger'
        validator: (value) => ['default', 'danger'].includes(value)
    }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}

const buttonClasses = computed(() => {
    const baseClasses = 'h-10 w-10 p-0 border border-gray-200 text-gray-500 cursor-pointer hover:text-white hover:border-white rounded-sm flex items-center justify-center transition-all duration-200 focus:outline-none'

    const variantClasses = {
        default: 'hover:bg-[#67b83c] hover:border-gray-300',
        danger: 'hover:bg-[#B83C3C] hover:border-red-300'
    }

    const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500 hover:border-gray-200'

    const variant = variantClasses[props.variant] || variantClasses.default

    return props.disabled || props.loading
        ? `${baseClasses} ${disabledClasses}`
        : `${baseClasses} ${variant}`
})

const iconClass = computed(() => {
    return props.loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'
})
</script>
