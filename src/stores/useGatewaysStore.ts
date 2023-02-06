import { acceptHMRUpdate, defineStore } from 'pinia'
import { assign, createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { useLocalStorage } from '@vueuse/core'
import type { GatewayCredentials } from '~/interfaces/deconz'

export interface GatewayMachineContext {
  credentials: GatewayCredentials
}

export type GatewayMachineEvent = | {
  type: 'CONNECT'
} | {
  type: 'DISCONNECT'
  reconnect?: boolean
} | {
  type: 'RECONNECT'
} | {
  type: 'LOAD/CREDENTIALS'
  value: GatewayCredentials
  reconnect?: boolean
} | {
  type: 'CONNECTED'
} | {
  type: 'DISCONNECTED'
} | {
  type: 'ENABLE/POOLING'
} | {
  type: 'DISABLE/POOLING'
} | {
  type: 'ENABLE/WS'
} | {
  type: 'DISABLE/WS'
} | {
  type: 'ERROR'
  message: string
} | {
  type: 'ERROR/UNREACHABLE'
} | {
  type: 'ERROR/INVALID_API_KEY'
}

/** @xstate-layout N4IgpgJg5mDOIC5RQIYBcwHcUE8DEAogEpEDyRA2gAwC6ioADgPawCWarTAdvSAB6IAjFUEAmAHQA2ABzSALNNEBmAOxUlq0QBoQORNICsVKQdErRVNYOlKFAXzs7UGbDnHcANqy5g8AEQBJAGUAYVIAOXCCEIAVajokEGY2Dm5eAQQAWjljMUkFFQBOMVE5OQMDSR09BDLpKTlC4sKjQtkVFQcndCxcdy4vH3FmJkGocTAuFAAjD0h-YIBBACEAGQIAegAFUlJVgPCAcXjeZPZOHkSMzIMVSXEKuUlJMyoyyRUDasRJQQNxYRlO5NX6iURdEDOXpuTzeMDDJijbzjCCsWAzOYQQjhFbrba7fZHE6JM6pS6ga63OTiJSKaRUUSFSRKUSVKq6RCmJTiQxAyQgkoQqGufqDeGYMDTWBMADGAGswGhxKj0bN5gQcWtNgB1ILExgsc5pK6IG7M8QtKiSAwsyoKUTSb4IdriMpyJSSK3Wl6WIU9EWwoYSqWyhVKyYY+aBIK4nV62inQ1k9KmtkAwRyFSCQSFOSCFSGdk1FqCAG52lKCq0t5KP0uPpMABmjbFeDCkWicQTJKTFxTCFp9UaVqaBmkHSrSidBkKKhpTUKVBr+REcjr0PEMu4PhlHC4UEIJHIGwAquEiARFiEABKx-VJXvGimIWwSUojlrjz42qcchDmalpCaOQwXyCoZEkdcRS3Lgdz3A9iDIIgNgOAA1RZ9j8AB9RYtgCLCAGkCAATXvUk+xNAc8wtd16UEfkWizFQ5CdDpCnnXNiiUYRs1zKC+hguDkTbCIoliAg-DIx9yX4U1VHET4-g0GRpF+fMymnWcOOaVp2k6RxIX9PoVUEsBd2E6N2zEmIJKklIKOfAdngBJRig+T0f1sL4-zqBomhzXSv34twTO3Mz4LwC8rM7OyjRkjIM3YkCHQ9JR1CzKhc2nHMeQXZQWXKQxgrwVZSEWPwNhCC8-A1GIAgw+MEgNeyn1khAxFLVQZ3pVQs1nX8ag0CR+XdGRGSMP5SgcAyuCYCA4F4YVcETFr4tNQx2OeCpWV+D4xAGxBSn+HNRq9SoLH07p6xhAY4RWuL+0yaRsyka1TEqeis2UJ1bHqXknnzVQhr4gylpusUESRfd7uTSjMjubktve3avoO2oPRpAx3kKD0PjMTNgtFOFIbGCYpjVCAYYctrMlsUsFDeAw-hsVTREENGuR5LGFGtFlVNMQnA3hEZSZVSNKZ7VbHqzf4kZ2z79unZQubqXmHWtcFQaM8HieDaV5UVKnWuuT5qUtZ5DEmvrWKaGj3WKaxuLaaRBduoNJX1sNlTRcWjbWrI1Huc2ZCZ0xrb-F03Q9M6fUuwzrqJ92QwN8NycxP3HsrXIWleG0bEZQonUjspXNkMQZ1sQXmzFDPKOZXJuPy9QjDZn7fgBRoHdkN4cfoquW2JsWKdrxyPnqdn9rSrPW58hQ-J0zK9P7iGwAAJ1XphV5HtqZGMZ7x2ZbaZ2KJ1mTnZQHVKfIvLMZfibXjfV-EABXLhV7AFAZQAC0jbeMhUDGVpxz2hxs9VipQFIsiKHmVkwCDB3yGA-TeL8uBylmpgGS5FjaIGYnOQwS4K4OiZMyIuRgTBmAuiIGw9gtYJybAPRB69kHeAAG4oC8BAAABLhAInCFQ1Gag9Si5g-rWARkffyrFxwWjpFfd05Rb60I3KZcy0NJZCMcn8OclRbB3HOt5GoM45yuSaEuUaOQMyE1CrBcKyI-5CCeApLaqkp4ZSyrPeo+RTHLgsaoaadggA */
export const gatewayMachine = createMachine({
  id: 'gateway',
  initial: 'connecting',

  // https://xstate.js.org/docs/guides/actions.html
  predictableActionArguments: true,

  schema: {
    context: {} as GatewayMachineContext,
    events: {} as GatewayMachineEvent,
  },

  tsTypes: {} as import('./useGatewaysStore.typegen').Typegen0,

  context: {
    credentials: {
      id: '',
      name: '',
      apiKey: '',
      URIs: { },
    },
  },

  states: {
    online: {
      type: 'parallel',

      states: {
        pooling: {
          states: {
            enabled: {
              on: {
                'DISABLE/POOLING': 'disabled',
              },
            },

            disabled: {
              on: {
                'ENABLE/POOLING': 'enabled',
              },
            },
          },

          initial: 'disabled',
        },

        websocket: {
          states: {
            disabled: {
              on: {
                'ENABLE/WS': 'enabled',
              },
            },

            enabled: {
              on: {
                'DISABLE/WS': 'disabled',
              },
            },
          },

          initial: 'disabled',
        },
      },
      on: {
        DISCONNECT: 'disconnecting',
      },
    },

    offline: {
      states: {
        disabled: {},

        error: {
          states: {
            'unreachable': {},
            'unknown': {},
            'invalid API key': {},
          },

          initial: 'unknown',
        },
      },

      initial: 'disabled',

      on: {
        CONNECT: 'connecting',
      },
    },

    connecting: {
      on: {
        'ERROR/UNREACHABLE': 'offline.error.unreachable',
        'ERROR/INVALID_API_KEY': 'offline.error.invalid API key',
        'CONNECTED': 'online',
      },
    },

    disconnecting: {
      on: {
        DISCONNECTED: 'offline',
        RECONNECT: 'connecting',
      },
    },
  },

  on: {
    'ERROR': '.offline.error.unknown',
    'LOAD/CREDENTIALS': {
      target: '.disconnecting',
      actions: ['log'],
    },
  },
}, {
  actions: {
    log: (context, event) => {
      // eslint-disable-next-line no-console
      console.log(event.type, context, event)
    },
    /*
    increment: assign({ count: context => context.count + 1 }),
    decrement: assign({ count: context => context.count - 1 }),
    */
  },
})

export const useGatewaysStore = defineStore(
  gatewayMachine.id,
  () => {
    const route = useRoute()
    const credentials = useLocalStorage<Record<string, GatewayCredentials>>('gateways/credentials', {})

    const makeMachine = (id: string) => {
      const context = gatewayMachine.context
      const creds = toRef(credentials.value, id)
      context.credentials = creds.value

      const machine = useMachine(gatewayMachine.withContext(context), {
        id: `${gatewayMachine.id}/${id}`,
        devTools: true,
        // state: state.value,
        actions: {
          // saveCredentials: (ctx, event) => {
          //  credentials.value = ctx.credentials
          // },
          // loadCredentials: assign((context, event) => {
          //  context.credentials = event.value
          //  return context
          // }),
        },
      })

      watch(creds, (newValue) => {
        machine.send('LOAD/CREDENTIALS', {
          value: newValue,
          reconnect: true,
        })
      })

      return {
        id,
        ...machine,
      }
    }

    const gateways = shallowReactive<Record<string, ReturnType<typeof makeMachine>>>({})

    watch(() => Object.entries(credentials.value).length, (currentValue, oldValue) => {
      if ((oldValue ?? 0) < currentValue) {
        // Credentials was added
        objectKeys(credentials.value).forEach((id) => {
          if (!gateways[id])
            gateways[id] = makeMachine(id)
        })
      }
      else {
        // Credentials was deleted
        objectKeys(gateways).forEach((id) => {
          if (credentials.value[id] === undefined) {
            // gatewayMachines[id].destroy()
            delete gateways[id]
          }
        })
      }
    }, { immediate: true })

    const activeCredential = computed({
      get() {
        if (typeof route.params.gateway !== 'string')
          return undefined
        return credentials.value[route.params.gateway]
      },
      set(newValue) {
        if (newValue !== undefined && typeof route.params.gateway === 'string')
          credentials.value[route.params.gateway] = newValue
      },
    })

    const activeGateway = computed(() => {
      if (typeof route.params.gateway !== 'string')
        return undefined
      return gateways[route.params.gateway]
    })

    return {
      credentials,
      gateways,
      activeCredential,
      activeGateway,
      // localstate: state,
    }
  },
)

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
// if (import.meta.hot)
//  import.meta.hot.accept(acceptHMRUpdate(useGatewaysMachine, import.meta.hot))
// Workaround for https://github.com/prazdevs/pinia-plugin-persistedstate/issues/79
// This will force a webpage refrech on edit
if (import.meta.hot)
  import.meta.hot.invalidate()
