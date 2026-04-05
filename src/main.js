// router
import router from "@/router/index.js";
// store
import { createPinia } from 'pinia'
// 3rd-party packages
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
// necessary app startup
import { webSocketService } from './services'
// styles
import '@/style.css'
import '@/assets/scss/primevue-overrides.scss'
// native Vue
import App from '@/App.vue'
import { createApp } from 'vue'

const app = createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })

webSocketService.init()

  app.mount('#app')