import { acceptHMRUpdate, defineStore } from 'pinia'
import type { GatewayCredentials } from '~/interfaces/deconz'

export const useGatewaysStore = defineStore('gateways', () => {
  const credentials = reactive<Record<string, GatewayCredentials>>({})
  const credentials_array = ref<GatewayCredentials[]>([])

  const data_array = ref<any[]>([])
  // data_array.value[0] = 3

  const data_record = reactive({})
  // data_record.foo = 35

  const test = computed(() => 14)

  /*
  watch(credentials, (currentValue, oldValue) => {
    console.log(Object.keys(currentValue).length)
    console.log('tu')
    console.log(Object.keys(oldValue).length)
  })
  */

  return { credentials, credentials_array, data_array, data_record, test }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate

  // For later : https://github.com/prazdevs/pinia-plugin-persistedstate/issues/60#issuecomment-1120244473

  persist: {
    paths: [
      'data_array',
      'data_record',
      /*
      'credentials',
      'credentials_array',
      */
    ],
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))

