<template>
    <div>
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
        <div class="relative">
            <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :required="required" :disabled="disabled" :class="[
                    'w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2',
                    errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-[#dcdfe3] focus:ring-[#67B83C]',
                    { 'uppercase': uppercase, 'pr-10': !!$slots.suffix }
                ]" v-bind="$attrs" />
            <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-2 flex items-center">
                <slot name="suffix"></slot>
            </div>
        </div>
        <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
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
    },
    errorMessage: {
        type: String,
        default: ''
    }
});

defineEmits(['update:modelValue']);
</script>
