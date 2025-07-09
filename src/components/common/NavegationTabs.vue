<template>
    <div class="flex justify-between items-center">
        <div class="relative inline-flex items-center border border-gray-200 bg-gray-100 rounded-sm p-1 cursor-pointer">
            <div v-for="(tab, index) in tabs" :key="tab.value" @click="$emit('update:modelValue', tab.value)" :class="[
                'relative z-10 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                modelValue === tab.value
                    ? 'bg-white text-gray-900'
                    : 'text-gray-600 hover:text-gray-900',
                index > 0 ? 'ml-1' : ''
            ]">
                <div class="flex items-center gap-2">
                    <component v-if="tab.icon" :is="tab.icon" :size="16" />
                    <span>{{ tab.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

interface Tab {
    value: string
    label: string
    icon?: any
}

defineProps<{
    modelValue: string
    tabs: Tab[]
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>