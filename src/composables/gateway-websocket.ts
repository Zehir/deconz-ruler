import type { Ref } from 'vue'
import type { GatewayData, Group, Light, Sensor, WebSocketEvent } from '~/interfaces/deconz'

export function useGatewayWebsocket(gatewayWebsocketUri: Ref<string>, data: Ref<GatewayData>) {
  const currentEvent = ref('{}')
  const websocket: Ref<ReturnType<typeof useWebSocket> | undefined> = ref(undefined)

  const state = computed(() => {
    if (websocket.value === undefined)
      return 'disconnected'
    switch (unref(websocket.value.status)) {
      case 'OPEN':
        return 'connected'
      case 'CONNECTING':
        return 'pending'
      case 'CLOSED':
        return 'disconnected'
    }
  })

  watch(gatewayWebsocketUri, (newUri) => {
    if (websocket.value !== undefined)
      websocket.value.close()
    if (newUri.length === 0)
      return
    websocket.value = useWebSocket(newUri, {
      autoReconnect: true,
      heartbeat: {
        message: 'ping',
        interval: 10000,
      },
      onMessage: (ws: WebSocket, event: MessageEvent) => {
        currentEvent.value = event.data
      },
    })
  }, { immediate: true })

  watch(currentEvent, (msg) => {
    if (typeof msg !== 'string')
      return
    const event = JSON.parse(msg) as WebSocketEvent
    if (event.id === undefined || event.t !== 'event')
      return

    // console.log('event', event)

    if (event.e === 'changed') {
      const objectRef = data.value[event.r][parseInt(event.id)]
      if (objectRef === undefined) {
        console.warn('Got a changed event for an object that is not in the gateway data', event)
        return
      }

      if (event.state)
        objectRef.state = event.state
      if (event.config)
        objectRef.config = event.config
      if (event.name)
        objectRef.name = event.name
      if (event.attr) {
        const attr = event.attr as Record<string, any>
        Object.keys(attr).forEach((key) => {
          objectRef[key] = attr[key]
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
    if (websocket.value)
      websocket.value.close()
  }

  return { shell: websocket, state, foo: 'bar', destroy }
}
