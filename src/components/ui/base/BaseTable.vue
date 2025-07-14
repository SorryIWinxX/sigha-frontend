<script setup>
// Props
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <div class="w-full bg-white">
        <div class="overflow-hidden border border-gray-300 rounded-sm">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-300">
                    <tr>
                        <th v-for="column in columns" :key="column.key" class="px-4 py-3 text-left">
                            <span class="text-gray-900 font-medium text-sm">
                                {{ column.label }}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-300">
                    <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50 transition-colors">
                        <td v-for="column in columns" :key="column.key" class="px-4 py-4">
                            <span class="text-gray-900 text-sm">
                                {{ item[column.key] }}
                            </span>
                        </td>
                    </tr>
                    <tr v-if="data.length === 0">
                        <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">
                            No hay datos para mostrar
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>