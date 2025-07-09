<template>
    <svg :width="width" :height="height" viewBox="0 0 482 449" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="31" width="54" height="418" rx="16.7782" fill="#67B83C" />
        <rect x="214" y="31" width="54" height="418" rx="16.7782" fill="#67B83C" />
        <rect x="428" y="31" width="54" height="418" rx="16.7782" fill="#67B83C" />
        <rect x="107" width="54" height="418" rx="16.7782" fill="#1E2772" />
        <rect x="321" width="54" height="418" rx="16.7782" fill="#1E2772" />
    </svg>
</template>

<script>
export default {
    props: {
        width: {
            type: [String, Number],
            default: 120
        },
        height: {
            type: [String, Number],
            default: 120
        }
    }
}
</script>