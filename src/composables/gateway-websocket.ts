import type { ComputedRef, Ref } from 'vue'
import type { GatewayData, Group, Light, Sensor, WebSocketEvent } from '~/interfaces/deconz'

export function useGatewayWebsocket(gatewayWebsocketUri: ComputedRef<string>, data: Ref<GatewayData>) {
  const currentEvent = ref('{}')
  let websocket: ReturnType<typeof useWebSocket> | undefined

  watch(gatewayWebsocketUri, (newUri) => {
    console.log('Connect to websocket:', newUri)
    if (websocket !== undefined)
      websocket.close()
    if (newUri.length === 0)
      return
    websocket = useWebSocket(newUri, {
      autoReconnect: true,
      heartbeat: {
        message: 'ping',
        interval: 1000,
      },
    })
    syncRef(websocket.data, currentEvent, { direction: 'ltr' })
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
    if (websocket)
      websocket.close()
  }

  return { destroy }
}
