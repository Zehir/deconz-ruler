import { acceptHMRUpdate, defineStore } from 'pinia'

export interface Gateway {
  id: string
  name: string
  ip: string
  port: number
  ws_port: number
  apiKey: string
  secured: boolean
}

export const useGatewaysStore = defineStore('gateways', () => {
  const gateways: Record<string, Gateway> = reactive({})
  const currentGatewayID = ref('Toto')
  const currentGateway = computed(() => gateways[currentGatewayID.value])

  return {
    gateways,
    currentGatewayID,
    currentGateway,
  }
})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
