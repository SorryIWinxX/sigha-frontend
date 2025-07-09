<script setup>
import ToastExample from '@/components/ToastExample.vue';
</script>

<template>
    <div class="toast-demo">
        <h1>Toast Notification Demo</h1>
        <p>Click on any button below to see different types of toast notifications.</p>
        <ToastExample />
    </div>
</template>

<style scoped>
.toast-demo {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

h1 {
    margin-bottom: 10px;
}

p {
    margin-bottom: 30px;
    color: #666;
}
</style>