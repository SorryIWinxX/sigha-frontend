<script setup>
defineProps({
    customClass: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>
<template>
    <button :class="[
        'inline-flex items-center gap-1.5 transition-all text-sm font-normal cursor-pointer rounded-sm',
        customClass,
        {
            'opacity-50 pointer-events-none': disabled,
        }
    ]" :disabled="disabled" v-bind="$attrs">
        <slot name="icon" />
        <slot />
    </button>
</template>
