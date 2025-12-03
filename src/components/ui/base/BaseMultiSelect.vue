<template>
    <div class="relative w-full" aria-haspopup="listbox" role="combobox" :aria-expanded="showList">
        <div ref="boxContainer">
            <button @click="toggleDropdown"
                class="relative flex w-full items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-controls="multiselect-dropdown" aria-labelledby="multiselect-label">
                <div class="flex items-center gap-2 flex-wrap">
                    <template v-if="selectedTags.length > 0">
                        <span v-for="tag in selectedTags.slice(0, 2)" :key="tag"
                            class="inline-flex items-center rounded bg-primary-500 px-2 py-0.5 text-xs font-medium text-white">
                            {{ tag.length > 20 ? tag.substring(0, 20) + '...' : tag }}
                        </span>
                        <span v-if="selectedTags.length > 2" class="text-xs text-gray-500">
                            +{{ selectedTags.length - 2 }} más
                        </span>
                    </template>
                    <span v-else class="text-gray-500">{{ placeholder || 'Seleccionar opciones' }}</span>
                </div>
                <span class="ml-2">
                    <ChevronDown class="size-5 transition-transform duration-200"
                        :class="showList ? 'rotate-180' : 'rotate-0'" />
                </span>
            </button>

            <div v-show="showList"
                class="absolute z-50 mt-1 w-full overflow-hidden rounded-sm border border-gray-300 bg-white"
                id="multiselect-dropdown">
                <div class="flex items-center gap-3 border-b border-gray-200 px-3 py-2">
                    <BaseCheckbox :modelValue="areAllVisibleTagsSelected" @update:modelValue="selectAllTags" />
                    <input type="text" v-model="searchTerm" ref="searchInput"
                        :placeholder="searchPlaceholder || 'Buscar...'"
                        class="w-full bg-transparent py-1 focus:outline-none text-gray-900" />
                </div>
                <div class="max-h-60 overflow-y-auto">
                    <div v-for="tag in filteredTags" :key="tag" @click.self="selectTag(tag)"
                        @keypress.space="selectTag(tag)"
                        class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-primary-600 hover:text-white focus:outline-none transition-colors"
                        role="option" :aria-selected="isSelected(tag)" tabindex="0">
                        <BaseCheckbox :modelValue="isSelected(tag)"
                            @update:modelValue="(value) => toggleTag(tag, value)" @click.stop />
                        <label @click="selectTag(tag)" class="text-sm cursor-pointer flex-1">{{ tag }}</label>
                    </div>
                    <div v-if="filteredTags.length === 0" class="px-3 py-4 text-center text-gray-500 text-sm">
                        No se encontraron resultados
                    </div>
                </div>
                <div class="border-t border-gray-300 px-3 py-2 text-right">
                    <button @click="showList = false"
                        class="rounded-sm cursor-pointer text-sm bg-primary-500 px-3 py-1 text-white hover:bg-primary-600 focus:bg-primary-700 focus:ring-primary-300 transition-colors">
                        Seleccionar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { ChevronDown } from "lucide-vue-next";
import BaseCheckbox from "./BaseCheckbox.vue";

// Props
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    options: {
        type: Array,
        default: () => []
    },
    placeholder: {
        type: String,
        default: 'Seleccionar opciones'
    },
    searchPlaceholder: {
        type: String,
        default: 'Buscar...'
    }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Reactive state
const selectedTags = ref([...props.modelValue]);
const searchTerm = ref("");
const showList = ref(false);
const boxContainer = ref(null);
const searchInput = ref(null);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
    selectedTags.value = [...newValue];
}, { deep: true });

// Watch for changes to selectedTags and emit update
watch(selectedTags, (newValue) => {
    emit('update:modelValue', [...newValue]);
}, { deep: true });

function toggleDropdown() {
    showList.value = !showList.value;
}

function selectTag(tag) {
    if (isSelected(tag)) {
        selectedTags.value = selectedTags.value.filter((t) => t !== tag);
    } else {
        selectedTags.value.push(tag);
    }
}

function toggleTag(tag, value) {
    if (value) {
        if (!selectedTags.value.includes(tag)) {
            selectedTags.value.push(tag);
        }
    } else {
        selectedTags.value = selectedTags.value.filter((t) => t !== tag);
    }
}

function isSelected(tag) {
    return selectedTags.value.includes(tag);
}

const filteredTags = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return props.options.filter((tag) => tag.toLowerCase().includes(term));
});

function selectAllTags(value) {
    const currentlyFilteredTags = filteredTags.value;
    if (value) {
        const newTags = currentlyFilteredTags.filter(
            (tag) => !selectedTags.value.includes(tag)
        );
        selectedTags.value.push(...newTags);
    } else {
        selectedTags.value = selectedTags.value.filter(
            (tag) => !currentlyFilteredTags.includes(tag)
        );
    }
}

const areAllVisibleTagsSelected = computed(() => {
    const currentlyFilteredTags = filteredTags.value;
    return (
        currentlyFilteredTags.length > 0 &&
        currentlyFilteredTags.every((tag) => selectedTags.value.includes(tag))
    );
});

function closeDropdown(event) {
    if (
        !boxContainer.value.contains(event.target) &&
        !searchInput.value.contains(event.target)
    ) {
        searchTerm.value = "";
        showList.value = false;
    }
}

onMounted(() => {
    window.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
    window.removeEventListener("click", closeDropdown);
});
</script>

<style scoped>
/* Scrollbar styling for the dropdown */
.max-h-60::-webkit-scrollbar {
    width: 8px;
}

.max-h-60::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.max-h-60::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>