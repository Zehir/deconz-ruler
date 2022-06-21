import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { GatewayCredentials } from '~/interfaces/deconz'

export interface GatewaysState {
  id: string
  credentials: Ref<GatewayCredentials>
}

export const useGatewaysStore = defineStore('gateways', () => {
  const credentials = reactive<Record<string, GatewayCredentials>>({})
  const data = reactive<Record<string, GatewaysState>>({})

  watch(() => Object.entries(credentials).length, (currentValue, oldValue) => {
    if (oldValue < currentValue) {
      // Credentials was added
      Object.keys(credentials).forEach((id) => {
        if (!data[id]) {
          data[id] = {
            id,
            credentials: toRef(credentials, id),
          }
        }
      })
    }
    else {
      // Credentials was deleted
      Object.keys(data).forEach((id) => {
        if (!credentials[id])
          delete data[id]
      })
    }
  })

  return { credentials, data }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate
  // For later : https://github.com/prazdevs/pinia-plugin-persistedstate/issues/60#issuecomment-1120244473
  persist: {
    paths: [
      'credentials',
    ],
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
/*
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
*/
// Workaround for https://github.com/prazdevs/pinia-plugin-persistedstate/issues/79
// This will force a webpage refrech on edit
if (import.meta.hot)
  import.meta.hot.accept(import.meta.hot.invalidate)
