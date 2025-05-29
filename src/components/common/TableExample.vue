<template>
    <div class=" space-y-8">
        <div>
            <Table :data="users" :columns="userColumns" :selectable="true" :pagination="true" :items-per-page="3" />
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import Table from './Table.vue'

// Datos de usuarios
const users = ref([
    {
        id: "1",
        name: "Leslie Maya",
        email: "leslie@gmail.com",
        lastLogin: "October 2, 2010",
        permission: "Admin",
        status: "active"
    },
    {
        id: "2",
        name: "John Doe",
        email: "john@gmail.com",
        lastLogin: "October 5, 2010",
        permission: "Profesor",
        status: "active"
    },
    {
        id: "3",
        name: "Jane Smith",
        email: "jane@gmail.com",
        lastLogin: "October 1, 2010",
        permission: "Profesor",
        status: "inactive"
    },
    {
        id: "4",
        name: "Mike Johnson",
        email: "mike@gmail.com",
        lastLogin: "September 28, 2010",
        permission: "Admin",
        status: "active"
    },
    {
        id: "5",
        name: "Sarah Wilson",
        email: "sarah@gmail.com",
        lastLogin: "October 3, 2010",
        permission: "Profesor",
        status: "active"
    }
])

// Configuración de columnas para usuarios (simplificada para compatibilidad)
const userColumns = ref([
    {
        key: 'name',
        label: 'Nombre',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'email',
        label: 'Email',
        sortable: false,
        formatter: (value) => value
    },
    {
        key: 'lastLogin',
        label: 'Último Ingreso',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'permission',
        label: 'Permisos',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'status',
        label: 'Estado',
        sortable: true,
        formatter: (value) => value === 'active' ? 'Activo' : 'Inactivo'
    }
])

// Datos de productos
const products = ref([
    { id: 1, name: 'Laptop Dell', category: 'Electrónicos', price: 1200, stock: 15 },
    { id: 2, name: 'Mouse Inalámbrico', category: 'Accesorios', price: 25, stock: 50 },
    { id: 3, name: 'Teclado Mecánico', category: 'Accesorios', price: 80, stock: 30 },
    { id: 4, name: 'Monitor 4K', category: 'Electrónicos', price: 400, stock: 8 },
    { id: 5, name: 'Webcam HD', category: 'Accesorios', price: 60, stock: 20 }
])

// Configuración de columnas para productos
const productColumns = ref([
    {
        key: 'name',
        label: 'Producto',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'category',
        label: 'Categoría',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'price',
        label: 'Precio',
        sortable: true,
        formatter: (value) => `$${value}`
    },
    {
        key: 'stock',
        label: 'Stock',
        sortable: true,
        formatter: (value) => value.toString()
    }
])

// Datos de tareas
const tasks = ref([
    { id: 1, title: 'Completar informe', priority: 'alta', completed: false },
    { id: 2, title: 'Revisar código', priority: 'media', completed: true },
    { id: 3, title: 'Actualizar documentación', priority: 'baja', completed: false }
])

// Configuración de columnas para tareas
const taskColumns = ref([
    {
        key: 'title',
        label: 'Tarea',
        sortable: true,
        formatter: (value) => value
    },
    {
        key: 'priority',
        label: 'Prioridad',
        sortable: true,
        formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    {
        key: 'completed',
        label: 'Estado',
        sortable: true,
        formatter: (value) => value ? 'Completada' : 'Pendiente'
    }
])

// Manejadores de eventos
const handleUserAction = ({ action, item }) => {
    console.log(`Acción ${action} en usuario:`, item)
    alert(`Acción: ${action} en ${item.name}`)
}

const handleSelectionChange = (selectedItems) => {
    console.log('Elementos seleccionados:', selectedItems)
}

const handleSortChange = (sortConfig) => {
    console.log('Configuración de ordenamiento:', sortConfig)
}
</script>