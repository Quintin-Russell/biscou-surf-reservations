// router
import router from "./router/index.js";
// store
import { createPinia } from 'pinia'
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
  .use(createPinia())
  .use(PrimeVue, { theme: {
    preset: Aura,
      options :{
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue'
        }
      }
  } })
  .mount('#app')
console.log('app mounted')