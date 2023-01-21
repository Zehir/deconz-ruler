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
  const gatewayAPIUriStates = ref({})
  const gatewayWebsocketUri = ref('')

  const data = ref<Partial<GatewayData>>({})

  const gatewayPooling = useGatewayPooling(gatewayAPIUri, data)
  const gatewayWebsocket = useGatewayWebsocket(gatewayWebsocketUri, data)

  // Getters
  const getData = (type: keyof GatewayData, id?: MaybeRef<number>) => {
    if (type === 'config')
      return toRef(data.value, 'config')

    if (unref(id) === undefined) {
      return computed(() => {
        return data.value![type] ?? {}
      })
    }

    return computed(() => {
      return data.value![type]![unref(id as number)] ?? {}
    })
  }

  const connect = () => {
    const apiURI = credentials.value.URIs.find(_uri => _uri.type === 'api')
    if (apiURI !== undefined)
      gatewayAPIUri.value = `${apiURI.address}/api/${credentials.value.apiKey}/`
    const wsURI = credentials.value.URIs.find(_uri => _uri.type === 'websocket')
    if (wsURI !== undefined)
      gatewayWebsocketUri.value = wsURI.address
  }

  // Delay the connection for 1.5 seconds.
  const { stop } = useTimeoutFn(() => {
    connect()
  }, 1500)

  const destroy = () => {
    stop()
    gatewayPooling.destroy()
    gatewayWebsocket.destroy()
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
