<template>
    <div :class="containerClass">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
        <div class="relative">
            <select :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :required="required" :disabled="disabled" :class="selectClasses" v-bind="$attrs">
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <slot></slot>
            </select>
            <!-- Custom dropdown arrow -->
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown class="w-5 h-5 text-gray-400" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    customClass: {
        type: String,
        default: ''
    },
    containerClass: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: 'w-full'
    },
    height: {
        type: String,
        default: 'h-10'
    }
});

defineEmits(['update:modelValue']);

const selectClasses = computed(() => {
    const baseClasses = `${props.width} ${props.height} px-3 py-2 border border-[#dcdfe3] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C] bg-white text-[#3b3e45] text-sm appearance-none cursor-pointer`;
    return props.customClass ? `${baseClasses} ${props.customClass}` : baseClasses;
});
</script>
