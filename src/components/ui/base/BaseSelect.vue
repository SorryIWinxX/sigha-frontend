<template>
    <div>
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="relative" ref="containerRef">
            <button :id="id" type="button" @click="toggleDropdown" :disabled="disabled" :class="[
                'relative w-full rounded-sm border px-3 py-2 text-left focus:outline-none focus:ring-2',
                disabled
                    ? 'border-[#dcdfe3] bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'border-[#dcdfe3] bg-white text-[#3b3e45] cursor-pointer hover:border-gray-400',
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'
            ]" :aria-expanded="showList" aria-haspopup="listbox" :aria-labelledby="label ? `${id}-label` : undefined">
                <span class="block truncate">
                    {{ displayValue || placeholder || 'Seleccionar...' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown class="h-5 w-5 text-gray-400 transition-transform duration-200"
                        :class="{ 'rotate-180': showList }" />
                </span>
            </button>

            <!-- Dropdown -->
            <div v-show="showList && !disabled"
                class="absolute z-50 mt-1 w-full max-h-60 overflow-hidden rounded-sm border border-gray-300 bg-white shadow-lg"
                role="listbox" :aria-labelledby="label ? `${id}-label` : undefined">
                <!-- Search input -->
                <input v-if="searchable && options.length > 5" ref="searchInputRef" type="text" v-model="searchTerm"
                    placeholder="Buscar..."
                    class="w-full border-b border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    @click.stop />
                <!-- Options list -->
                <div class="combo-box-scrollbar max-h-60 overflow-y-auto">
                    <div v-for="option in filteredOptions" :key="option.value" @click="selectOption(option)" :class="[
                        'cursor-pointer px-3 py-2 text-sm transition-colors',
                        isSelected(option.value)
                            ? 'bg-primary-500 text-white'
                            : 'text-[#3b3e45] hover:bg-primary-700 hover:text-white'
                    ]" role="option" :aria-selected="isSelected(option.value)" tabindex="0"
                        @keydown.enter="selectOption(option)" @keydown.escape="closeDropdown">
                        {{ option.label }}
                    </div>
                    <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
                        No se encontraron opciones
                    </div>
                </div>
            </div>
        </div>
        <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    modelValue: {
        type: [String, Number, null, undefined],
        default: null
    },
    options: {
        type: Array,
        default: () => []
    },
    label: {
        type: String,
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
    searchable: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showList = ref(false)
const searchTerm = ref('')
const containerRef = ref(null)
const searchInputRef = ref(null)

// Computed properties
const displayValue = computed(() => {
    const value = props.modelValue
    if (value === null || value === undefined || value === '') {
        return ''
    }
    const option = props.options.find(opt => {
        const optValue = opt.value
        return optValue === value || String(optValue) === String(value) || (optValue === '' && value === '')
    })
    return option ? option.label : String(value)
})

const filteredOptions = computed(() => {
    if (!searchTerm.value.trim()) {
        return props.options
    }
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
    }
    const term = normalizeText(searchTerm.value.trim())
    return props.options.filter(option =>
        normalizeText(option.label).includes(term)
    )
})

// Methods
const isSelected = (value) => {
    const modelValue = props.modelValue
    if (modelValue === null || modelValue === undefined || modelValue === '') {
        return value === '' || value === null || value === undefined
    }
    return modelValue === value || String(modelValue) === String(value)
}

const selectOption = (option) => {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    searchTerm.value = ''
    showList.value = false
}

const toggleDropdown = () => {
    if (props.disabled) return
    showList.value = !showList.value
    if (showList.value && props.searchable && props.options.length > 5) {
        nextTick(() => {
            searchInputRef.value?.focus()
        })
    }
}

const closeDropdown = () => {
    searchTerm.value = ''
    showList.value = false
}

const handleClickOutside = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
        closeDropdown()
    }
}

const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showList.value) {
        closeDropdown()
    }
}

// Watch for modelValue changes to close dropdown if needed
watch(() => props.modelValue, () => {
    if (showList.value) {
        closeDropdown()
    }
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.combo-box-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.combo-box-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.combo-box-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.combo-box-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
