<template>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)"
        :disabled="disabled" :class="[
            'w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-0',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        ]" :style="{ accentColor: color }" />
</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#67b83c'
    }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    border: 1px solid #d1d5db;
    position: relative;
}

input[type="checkbox"]:checked {
    background-color: v-bind(color);
    border-color: v-bind(color);
}

input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
}

input[type="checkbox"]:focus {
    outline: 2px solid v-bind(color);
    outline-offset: 2px;
}
</style>