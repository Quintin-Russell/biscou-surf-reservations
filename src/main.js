// router
import router from "@/router/index.js";
// store
import { createPinia } from 'pinia'
// 3rd-party packages
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
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
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .use(ToastService)
  .use(ConfirmationService)

webSocketService.init()

  app.mount('#app')