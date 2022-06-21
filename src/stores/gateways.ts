import { acceptHMRUpdate, defineStore } from 'pinia'
import type { GatewayCredentials } from '~/interfaces/deconz'

export const useGatewaysStore = defineStore('gateways', () => {
  const credentials = reactive<Record<string, GatewayCredentials>>({})

  const data = reactive({})

  /*
  watch(credentials, (currentValue, oldValue) => {
    console.log(Object.keys(currentValue).length)
    console.log('tu')
    console.log(Object.keys(oldValue).length)
  })
  */

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

