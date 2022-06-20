import { acceptHMRUpdate, defineStore } from 'pinia'
import type { GatewayCredentials } from '~/interfaces/deconz'

export const useGatewaysStore = defineStore('gateways', () => {
  const credentials = ref<GatewayCredentials[]>([])

  return { credentials }
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
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
