// router
import router from "./router/index.js";
// 3rd-party packages
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
// styles
import './style.css'
// native Vue
import App from './App.vue'
import { createApp } from 'vue'

createApp(App)
  .use(router)
  .use(PrimeVue, { theme: { preset: Aura } })
  .mount('#app')
