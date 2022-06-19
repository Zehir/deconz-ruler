import { acceptHMRUpdate, defineStore } from 'pinia'

import { useGatewayCredentials } from '~/composables/gateway-credentials'

export const useGatewaysStore = defineStore('gateways', () => {
  const credentials = reactive(useGatewayCredentials())

  return { credentials }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate

  persist: {
    paths: [
      'credentials',
    ],
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
