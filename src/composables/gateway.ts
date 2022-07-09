import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { useGatewayPooling } from './gateway-pooling'
import { useGatewayWebsocket } from './gateway-websocket'
import type { GatewayCredentials, GatewayData } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

export function useGateway(credentials: Ref<GatewayCredentials>) {
  // Data
  const gatewayStore = useGatewaysStore()
  const gatewayAPIUri = ref('')
  const gatewayWebsocketUri = ref('')
  const isConnected = ref(false)

  const data = ref<GatewayData>({
    alarmsystems: {},
    config: undefined,
    groups: {},
    lights: {},
    resourcelinks: {},
    rules: {},
    scenes: {},
    schedules: {},
    sensors: {},
  })

  const gatewayPooling = useGatewayPooling(gatewayAPIUri, data)
  const gatewayWebsocket = useGatewayWebsocket(gatewayWebsocketUri, data)

  // Getters
  const getData = (type: keyof GatewayData, id?: MaybeRef<number>) => {
    if (type === 'config')
      return toRef(data.value, 'config')

    return computed(() => {
      return data.value![type]![unref(id as number)] ?? {}
    })
  }

  const connect = () => {
    isConnected.value = true
    const apiURI = credentials.value.URIs.find(_uri => _uri.type === 'api')
    if (apiURI !== undefined)
      gatewayAPIUri.value = `${apiURI.address}/api/${credentials.value.apiKey}/`
    const wsURI = credentials.value.URIs.find(_uri => _uri.type === 'websocket')
    if (wsURI !== undefined)
      gatewayWebsocketUri.value = wsURI.address
  }

  const { isPending, start, stop } = useTimeoutFn(() => {
    connect()
  }, 1500)

  const destroy = () => {
    isConnected.value = false
    gatewayPooling.destroy()
    gatewayWebsocket.destroy()
    delete gatewayStore.gateway[credentials.value.id]
  }

  return {
    credentials,
    pooling: gatewayPooling,
    websocket: gatewayWebsocket,
    data,
    getData,
    connect,
    destroy,
  }
}
