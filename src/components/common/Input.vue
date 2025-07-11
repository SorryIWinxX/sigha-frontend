<template>
    <div>
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
        <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" :required="required" :disabled="disabled" :class="[
                'w-full px-3 py-2 border border-[#dcdfe3] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#67B83C]',
                { 'uppercase': uppercase }
            ]" v-bind="$attrs" />
    </div>
</template>

<script setup>
defineProps({
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
    type: {
        type: String,
        default: 'text'
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
    uppercase: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:modelValue']);
</script>
