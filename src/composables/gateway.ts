import type { MaybeRef } from '@vueuse/core'
import { createFetch, get } from '@vueuse/core'
import type { Ref } from 'vue'
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
      return data.value[type][unref(id as number)] ?? ref({})
    })
  }

  // Uris
  const gatewayAPIUri = computed(() => {
    const uri = credentials.value.URIs.find(_uri => _uri.type === 'api')
    if (uri === undefined)
      return ''
    return `${uri.address}/api/${credentials.value.apiKey}/`
  })

  const gatewayWebsocketUri = computed(() => {
    const uri = credentials.value.URIs.find(_uri => _uri.type === 'websocket')
    if (uri === undefined)
      return ''
    return uri.address
  })

  // Pooling
  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 2000,
    },
  })

  const gatewayShell = useGatewayFetch('/', {
    // immediate: false,
    refetch: true,
    initialData: data,
  }).get().json()

  const pooling = useIntervalFn(() => {
    if (get(gatewayShell.isFetching) === true)
      return
    gatewayShell.execute()
  }, 30000)

  // Websocket
  const websocket = useWebSocket(gatewayWebsocketUri.value, {
    autoReconnect: true,
    heartbeat: {
      message: 'ping',
      interval: 1000,
    },
  })

  watch(websocket.data, (msg) => {
    const event = JSON.parse(msg) as WebSocketEvent
    if (event.id === undefined || event.t !== 'event')
      return
    // eslint-disable-next-line no-console
    console.log('event', event)

    if (event.e === 'changed') {
      const objectRef = getData(event.r, parseInt(event.id))
      if (event.state)
        objectRef.value.state = event.state
      if (event.config)
        objectRef.value.config = event.config
      if (event.name)
        objectRef.value.name = event.name
      if (event.attr) {
        const attr = event.attr as Record<string, any>
        Object.keys(attr).forEach((key) => {
          objectRef.value[key] = attr[key]
        })
      }
    }
    else if (event.e === 'added') {
      switch (event.r) {
        case 'groups':
          data.value[event.r][parseInt(event.id)] = event.group as Group
          break
        case 'lights':
          data.value[event.r][parseInt(event.id)] = event.light as Light
          break
        case 'sensors':
          data.value[event.r][parseInt(event.id)] = event.sensor as Sensor
          break
      }
    }
    else if (event.e === 'deleted') {
      delete data.value[event.r][parseInt(event.id)]
    }
  })

  const destroy = () => {
    pooling.pause()
    gatewayShell.abort()
    websocket.close()
    delete gatewayStore.data[credentials.value.id]
  }

  return { credentials, gatewayShell, data, getData, destroy }
}
