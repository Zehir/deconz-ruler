import type { MaybeRef } from '@vueuse/core'
import { createFetch } from '@vueuse/core'
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
  const getDataRef = (type: keyof GatewayData, id?: MaybeRef<number>) => {
    if (type === 'config')
      return toRef(data.value, 'config')

    return computed(() => {
      if (unref(id) === undefined)
        return ref({})
      return data.value[type][unref(id as number)]
    })
  }

  // Pooling
  const gatewayAPIUri = computed(() => {
    return `${credentials.value.URIs[0].address}/api/${credentials.value.apiKey}/`
  })

  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 2000,
    },
  })

  const gatewayShell = useGatewayFetch('/', {
    immediate: false,
    refetch: true,
    initialData: data,
  }).get().json()

  const pooling = useIntervalFn(() => {
    gatewayShell.execute()
  }, 5000, { immediateCallback: true })

  // Websocket
  const gatewayWebsocketUri = computed(() => {
    return 'ws://localhost:443'
  })

  const websocket = useWebSocket(gatewayWebsocketUri.value, {
    autoReconnect: true,
    heartbeat: {
      message: 'ping',
      interval: 1000,
    },
  })

  watch(websocket.data, (msg) => {
    const event = JSON.parse(msg) as WebSocketEvent
    if (event.id === undefined)
      return
    const objectRef = getDataRef(event.r, parseInt(event.id))
    if (objectRef.value === undefined)
      return

    console.log('event', event)

    switch (event.t) {
      case 'event':

        switch (event.e) {
          case 'added':

            break

          case 'changed':
            if (event.state)
              objectRef.value.state = event.state
            break

          case 'deleted':

            break

          case 'scene-called':

            break
        }
        break
    }
  })

  const destroy = () => {
    pooling.pause()
    gatewayShell.abort()
    websocket.close()
    delete gatewayStore.data[credentials.value.id]
  }

  return { credentials, gatewayShell, data, getDataRef, destroy }
}
