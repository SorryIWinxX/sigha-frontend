<script setup>
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Search'
    },
    modelValue: {
        type: String,
        default: ''
    },
    debounceMs: {
        type: Number,
        default: 300
    }
})

const emit = defineEmits(['update:modelValue', 'search'])

const query = ref(props.modelValue)
let debounceTimer = null

// Watch for prop changes (parent updates)
watch(() => props.modelValue, (newValue) => {
    query.value = newValue
})

// Watch for local changes and emit to parent with debounce
watch(query, (newQuery) => {
    emit('update:modelValue', newQuery)

    // Clear previous timer
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    // Set new timer for debounced search
    debounceTimer = setTimeout(() => {
        emit('search', newQuery)
    }, props.debounceMs)
})

const handleSearch = (e) => {
    e.preventDefault()
    // Clear debounce timer and emit immediately on form submit
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    emit('search', query.value)
}
</script>

<template>
    <form @submit="handleSearch" class="w-full">
        <div
            class="flex items-center bg-white border border-gray-300 focus-within:shadow-[inset_0_0_0_2px_#67B83C] focus-within:border-transparent rounded-sm transition-all duration-200">
            <div class="flex items-center justify-center pl-4 pr-3">
                <Search class="h-5 w-5 text-gray-400 peer-focus:text-[#67B83C]" />
            </div>
            <input type="text" v-model="query" :placeholder="placeholder"
                class="peer flex-1 py-2 pr-4 text-gray-700 placeholder:text-md placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0" />
        </div>
    </form>
</template>