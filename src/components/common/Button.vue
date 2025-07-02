<script setup>
defineProps({
    customClass: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'warning', 'danger', 'info', 'success'].includes(value)
    }
});
</script>

<template>
    <button :class="[
        'inline-flex whitespace-nowrap items-center justify-center gap-1.5 transition-all duration-200 ease-in-out text-sm font-medium cursor-pointer rounded-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
        customClass,
        {
            'opacity-50 pointer-events-none cursor-not-allowed': disabled,
        },
        // Primary variant
        {
            'bg-primary-500 text-white hover:bg-primary-600 focus:bg-primary-700 focus:ring-primary-300': variant === 'primary'
        },
        // Secondary variant
        {
            ' text-gray-700 hover:bg-secondary-100 focus:bg-secondary-400 focus:ring-secondary-300 border border-gray-300': variant === 'secondary'
        },
        // Warning variant
        {
            'bg-warning-500 text-white hover:bg-warning-600 focus:bg-warning-700 focus:ring-warning-300': variant === 'warning'
        },
        // Danger variant
        {
            'bg-danger-500 text-white hover:bg-danger-600 focus:bg-danger-700 focus:ring-danger-300': variant === 'danger'
        },
        // Info variant
        {
            'bg-info-500 text-white hover:bg-info-600 focus:bg-info-700 focus:ring-info-300': variant === 'info'
        },
        // Success variant
        {
            'bg-success-500 text-white hover:bg-success-600 focus:bg-success-700 focus:ring-success-300': variant === 'success'
        }
    ]" :disabled="disabled" v-bind="$attrs">
        <slot name="icon" />
        <slot />
    </button>
</template>
