// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {

  }
  missingImplementations: {
    actions: never
    delays: never
    guards: never
    services: 'initAxios'
  }
  eventsCausingActions: {
    'log': 'LOAD/CREDENTIALS'
  }
  eventsCausingDelays: {

  }
  eventsCausingGuards: {

  }
  eventsCausingServices: {
    'initAxios': 'CONNECT' | 'RECONNECT' | 'xstate.init'
  }
  matchesStates: 'connecting' | 'disconnecting' | 'offline' | 'offline.disabled' | 'offline.error' | 'offline.error.invalid API key' | 'offline.error.unknown' | 'offline.error.unreachable' | 'online' | 'online.pooling' | 'online.pooling.disabled' | 'online.pooling.enabled' | 'online.websocket' | 'online.websocket.disabled' | 'online.websocket.enabled' | { 'offline'?: 'disabled' | 'error' | { 'error'?: 'invalid API key' | 'unknown' | 'unreachable' }
    'online'?: 'pooling' | 'websocket' | { 'pooling'?: 'disabled' | 'enabled'
      'websocket'?: 'disabled' | 'enabled'; }; }
  tags: never
}

