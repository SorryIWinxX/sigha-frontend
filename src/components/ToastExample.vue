<template>
    <div class="toast-example">
        <h2>Toast Notification Examples</h2>
        <div class="buttons">
            <button @click="showDefaultToast">Default Toast</button>
            <button @click="showSuccessToast">Success Toast</button>
            <button @click="showErrorToast">Error Toast</button>
            <button @click="showInfoToast">Info Toast</button>
            <button @click="showWarningToast">Warning Toast</button>
            <button @click="showCustomToast">Custom Toast</button>
        </div>
    </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../utils/toast';

export default {
    name: 'ToastExample',
    methods: {
        showDefaultToast() {
            showSuccessToast('This is a default success toast');
        },
        showSuccessToast() {
            showSuccessToast('Operation completed successfully!');
        },
        showErrorToast() {
            showErrorToast('An error occurred!');
        },
        showInfoToast() {
            showInfoToast('Here is some information for you.');
        },
        showWarningToast() {
            showWarningToast('Warning: This action cannot be undone!');
        },
        showCustomToast() {
            // Using the exact format provided by the user
            createToast('Some text',
                {
                    type: 'success',
                    position: 'top-right',
                    transition: 'slide',
                    hideProgressBar: 'true',
                    showIcon: 'true',
                });
        }
    }
};
</script>

<style scoped>
.toast-example {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}
</style>