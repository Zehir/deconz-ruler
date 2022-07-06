import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { useGatewayPooling } from './gateway-pooling'
import { useGatewayWebsocket } from './gateway-websocket'
import type { AlarmSystem, Config, GatewayCredentials, GatewayData, Group, Light, ResourceLink, Rule, Scene, Schedule, Sensor, WebSocketEvent } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

export function useGateway(credentials: Ref<GatewayCredentials>) {
  // Data
  const gatewayStore = useGatewaysStore()

  const data = ref<GatewayData>({
    alarmsystems: {} as Record<number, AlarmSystem>,
    config: {} as Config,
    groups: {} as Record<number, Group>,
    lights: {} as Record<number, Light>,
    resourcelinks: {} as Record<number, ResourceLink>,
    rules: {} as Record<number, Rule>,
    scenes: {} as Record<number, Scene>,
    schedules: {} as Record<number, Schedule>,
    sensors: {} as Record<number, Sensor>,
  })

  // Getters
  const getData = (type: keyof GatewayData, id?: MaybeRef<number>) => {
    if (type === 'config')
      return toRef(data.value, 'config')

    return computed(() => {
      return data.value[type][unref(id as number)] ?? {}
    })
  }

  const gatewayAPIUri = computed(() => {
    const uri = credentials.value.URIs.find(_uri => _uri.type === 'api')
    if (uri === undefined)
      return ''
    return `${uri.address}/api/${credentials.value.apiKey}/`
  })

  const gatewayPooling = useGatewayPooling(gatewayAPIUri, data)

  const gatewayWebsocketUri = computed(() => {
    const uri = credentials.value.URIs.find(_uri => _uri.type === 'websocket')
    if (uri === undefined)
      return ''
    return uri.address
  })

  const gatewayWebsocket = useGatewayWebsocket(gatewayWebsocketUri, data)

  const destroy = () => {
    gatewayPooling.destroy()
    gatewayWebsocket.destroy()
    delete gatewayStore.data[credentials.value.id]
  }

  return { credentials, /* gatewayShell: gatewayPooling.shell, */ data, getData, destroy }
}
