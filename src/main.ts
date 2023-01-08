import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
// import { createWebHashHistory } from 'vue-router'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'

import './styles/main.css'

const routes = setupLayouts(generatedRoutes)

const app = createApp(App)
const head = createHead()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

app.use(head)
app.use(router)

// install all modules under `modules/`
Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({ app, router }))

app.mount('#app')

