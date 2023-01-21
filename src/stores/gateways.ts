import { acceptHMRUpdate, defineStore } from 'pinia'
import { useGateway } from '~/composables/gateway'
import type { GatewayCredentials, GatewayData } from '~/interfaces/deconz'

export const useGatewaysStore = defineStore('gateways', () => {
  const route = useRoute()
  const credentials = reactive<Record<string, GatewayCredentials>>({})
  const gateways = reactive<Record<string, ReturnType<typeof useGateway>>>({})

  // const test = computed(() => 1)
  // Sync gateway data with credentials
  watch(() => Object.entries(credentials).length, (currentValue, oldValue) => {
    if (oldValue < currentValue) {
      // Credentials was added
      Object.keys(credentials).forEach((id) => {
        if (!gateways[id])
          gateways[id] = useGateway(toRef(credentials, id))
      })
    }
    else {
      // Credentials was deleted
      Object.keys(gateways).forEach((id) => {
        if (credentials[id] === undefined) {
          gateways[id].destroy()
          delete gateways[id]
        }
      })
    }
  })

  const getGateway = (gatewayID: string) => computed<null | ReturnType<typeof useGateway>>(() => {
    if (!gateways[gatewayID])
      return null
    return gateways[gatewayID]
  })

  const activeGateway = computed(() => {
    if (typeof route.params.gateway !== 'string')
      return null
    return getGateway(route.params.gateway)
  })

  const getData = (gatewayID: string, domain: keyof GatewayData, resource?: number | string) => computed(() => {
    if (!gateways[gatewayID])
      return {}
    return gateways[gatewayID].getData(domain, typeof resource === 'string' ? parseInt(resource) : resource).value
  })

  const updateCredentials = (newCredentials: GatewayCredentials) => {
    credentials[newCredentials.id] = newCredentials
  }

  const removeCredentials = (gatewayID: string) => {
    delete credentials[gatewayID]
  }

  return { credentials, gateway: gateways, getGateway, getData, updateCredentials, removeCredentials, activeGateway }
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
// if (import.meta.hot)
//  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
// Workaround for https://github.com/prazdevs/pinia-plugin-persistedstate/issues/79
// This will force a webpage refrech on edit
if (import.meta.hot)
  import.meta.hot.invalidate()
