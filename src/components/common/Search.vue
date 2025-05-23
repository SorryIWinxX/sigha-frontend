<script setup>
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Search'
    }
})

const emit = defineEmits(['search'])
const query = ref('')

const handleSearch = (e) => {
    e.preventDefault()
    emit('search', query.value)
}
</script>

<template>
    <form @submit="handleSearch" class=" w-full">
        <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search class="h-4 w-4 sm:h-5 sm:w-5 text-[#8f95a3]" />
            </div>
            <input type="text" v-model="query"
                class="w-full py-1.5 sm:py-2 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base border border-[#dcdfe3] rounded-sm text-[#231f20] placeholder-[#8f95a3] focus:outline-none focus:ring-2 focus:ring-[#67B83C] focus:border-none transition-colors"
                :placeholder="placeholder" />
        </div>
    </form>
</template>