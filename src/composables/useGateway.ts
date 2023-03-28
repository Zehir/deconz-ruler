import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { useGatewayPooling } from './useGatewayPooling'
import { useGatewayWebsocket } from './useGatewayWebsocket'
import { useGatewayScanner } from './useGatewayScanner'
import type { GatewayCredentials, GatewayData, GatewayURI, GatewayURITypes } from '~/interfaces/deconz'

export function useGateway(credentials: Ref<GatewayCredentials>) {
  const gatewayAPIUri = ref('')
  const gatewayWebsocketUri = ref('')
  const id = computed(() => credentials.value?.id)
  // const id2 = toRef(credentials.value, 'id')

  const data = ref<Partial<GatewayData>>({})

  const scanner = useGatewayScanner()

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
    if (credentials.value.URIs.api) {
      const scanner = useGatewayScanner()
      const addresses = scanner.findGatewayAddress(credentials.value.id, credentials.value.URIs.api)
    }

    const apiURI = credentials.value.URIs.api?.[0]
    if (apiURI !== undefined)
      gatewayAPIUri.value = `${apiURI}/api/${credentials.value.apiKey}/`

    /*
    const wsURI = credentials.value.URIs.websocket?.[0]
    if (wsURI !== undefined)
      gatewayWebsocketUri.value = wsURI
      */
  }

  // Delay the connection for 1.5 seconds.
  const { stop } = useTimeoutFn(() => {
    connect()
  }, 100)

  const destroy = () => {
    stop()
    gatewayPooling.destroy()
    gatewayWebsocket.destroy()
  }

  return {
    id,
    credentials,
    pooling: gatewayPooling,
    websocket: gatewayWebsocket,
    data,
    getData,
    connect,
    destroy,
  }
}
