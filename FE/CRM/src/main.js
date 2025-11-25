import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/** Global Stylesheet Imports */
import './assets/css/base.css'
import './assets/css/icons.css'
import './assets/css/style.css'
import '@/components/ms-toast/toast.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
