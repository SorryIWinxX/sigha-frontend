import './assets/main.css'
import 'mosha-vue-toastify/dist/style.css'
import 'animate.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar el store de autenticación después de montar Pinia
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.mount('#app')

// $cookies.set('token', '1234567890')
// $cookies.get('token')
// $cookies.remove('token')
// $cookies.isKey('auth')
// $cookies.keys()
