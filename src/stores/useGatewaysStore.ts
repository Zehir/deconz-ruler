import { acceptHMRUpdate, defineStore } from 'pinia'
import { State, assign, createMachine, interpret } from 'xstate'
import { useLocalStorage } from '@vueuse/core'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { GatewayCredentials } from '~/interfaces/deconz'
import { useGatewayScanner } from '~/composables/useGatewayScanner'

export interface GatewayMachineContext {
  credentials: GatewayCredentials
  axios?: AxiosInstance
  errorMessage?: string
}

export type GatewayMachineEvents = | {
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

export type GatewayMachineServices = | {
  initAxios: {
    data: { axios: AxiosInstance }
  }
}

/** @xstate-layout N4IgpgJg5mDOIC5RQIYBcwHcUE8DEAogEpEDyRA2gAwC6ioADgPawCWarTAdvSAB6IAjFUEAmAHQA2ABzSALNNEBmAOxUlq0QBoQORNICsVKQdErRVNYOlKFAXzs7UGbPgAypAIIARAPQBhIgJvAgA5ABUASU83AGVqOiQQZjYObl4BBDFBcVUDAE5pdRUVQXyVJR09BA0JSXy5JRlRfKNBUzkHJ3QsXHFuABtWLjA8b0jY-1JQ0IJ-cITeFPZOHiTMgFoDOXExSQUVSUEVaUkzSQMqxDkFKTl8-LKjQulDzscQZ16cfq4hkfEzCY-yg4jAXBQACMBpAxhNPAAhNwEXwABVIpDckVCAHFFkllmk1qBNgZDuIDNtJGc1DdJCpLrpEEcDLsqDdDg8jqJRF1Pj1XL9-mBAUxgcNQRBWLAoTCIIRQojkWiMVjcfjGCwVul1ogtiodkpFEUWpIlKIDNSrghTEpxIYOfV8tzeR8voLBsMRZgwJDYEwAMYAazAaHEUpl0NhYSVKIA6vFaEstUSMnrLXbWlQLubLQpRNJrbIVOIbo1JNmLmdLHz3X1PQCfX7AyGw+DZbDxrFY74ExrkinVmmEFtqbtBHJSmU5MdDJJra0ctOjUpKUb2UpawL6wAzHfCvBTGZzBZJgmDnUkxBG6Sl-LZh4GV4Mgwaa0FEtKB73jf7ETvboXD6ANuBGAMOC4KA8AgbgRWGAA3JgQ3EOsfhArgwIgqAEAQwN0FWBJ+0JIddRHM1xFEfZDGEQQmlkdQF3UCl6MnQR6Xozc3W3NDQLAcCJTwMAACchKYITAQGdAdzEgBbFDuPEdDMIlHCuEQgN8O4Qiz01VISKvGoSlLAoFBEAw2JEa1hCaCkv2zG9REaDQtyAniML4rDCBIchfAAVVCIJPH8AAJWMiIvYl+GvOQJEch9WmfNdKiZBBzB2aQHhiyi5EpGRJBc75FN4-jIK8sgiF8bEADUYkibwAH1PFRSJ6oAaQIABNcK9MvKKahncQGnXNjH1KA1rRKfJckyx4lBo6cCsFCMlI8gSuyPWZ5mCbrtUizImkkXYvzYw4qFfDQcutG5b32B4nioF4SkWvpluKzygg2k8dtTUiJymrKbDNYphAad8yntb9lHNHLDAcD4uCYCA4F4VDkx6va9UMKbqUpC0jnpMRkuqRzWWXPMzHvFpnp+BswDR3bhw2aRBByHHTEtE7CetWxbwdHLzSODKKmpoUvVFcVIPpn6DI2Q47TZvHOeUK6bNXOlzJaKgHvyrjXNFgEgRBMEISjCApf0vqNlsHJTJy9obFOURaPfZR7W2BQcwLC5XUAwrafFo2Iw7M3z3RxnSlZBWOYJ5WUttN3rs905TBF-2m39YNQ3N3rNgZHYs2pajTFKfIJoeQayyOMo2LOVO-jF9OW1DcNpWD7OMZHNRDoLmRzOLsoi1eUsbiaStLQsFQ6+FcRG8ztsTbldvGdXYwnjMM6VxaUuUuLYfGheMQClsVO92FJfSKBo7CaUdQjCd7mjl2e57zeMwGU432PVPsWg9N8+DPYlfKGt8qD3xStdO4d0syPUnrrP238ATCVEkJf+fUZDGGZq8M0uMCiPGtGaEsygzCKAtFgp2J99xiyQWJcQABXLgQkwAoADAACw7KgzIFRDrZlePmfIRpBATUcuICoFMZykINAYCh09qHiXoUGBGmBIrERzogA0JZDBayPgWZ0ZoixGBMGYCeIgbD2DgV-ShiCRI0IQigIYEAAAETVIgOJDNUXSDNSLmF5tYOWOC7oTSHoUAsjl9i2GLiLFaJUoAcKEBoSBchsy0Q0FQWQchB63ifNmEQTt+HqB9vyPWr13LRNiVkOQh1DgXFODfVQIN0ngNuLdH85ZEm0VgQ4IAA */
export const gatewayMachine = createMachine({
  id: 'gateway',
  initial: 'connecting',

  // https://xstate.js.org/docs/guides/actions.html
  predictableActionArguments: true,

  schema: {
    context: {} as GatewayMachineContext,
    events: {} as GatewayMachineEvents,
    services: {} as GatewayMachineServices,
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
      // Ceci est un service
      // https://xstate.js.org/docs/guides/typescript.html#typegen
      invoke: {
        src: 'initAxios',
        onDone: {
          target: 'online',
          actions: ['log'],
        },
        onError: {
          target: 'offline.error',
          // actions: assign({ errorMessage: (context, event) => event.data }),
        },
      },
      on: {
        'ERROR/UNREACHABLE': 'offline.error.unreachable',
        'ERROR/INVALID_API_KEY': 'offline.error.invalid API key',
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
  services: {

    initAxios: async (context, event) => {
      const scanner = useGatewayScanner()

      if (context.credentials.URIs.api === undefined || context.credentials.URIs.api.length === 0)
        throw new Error('No API url provided.', { cause: 'UNREACHABLE' })

      const address = await scanner.findGatewayAddress(
        context.credentials.id,
        context.credentials.URIs.api,
      )

      if (address.length === 0)
        throw new Error('None of the URL data is responding.', { cause: 'UNREACHABLE' })

      const instance = axios.create({
        baseURL: address[0],
        timeout: 3000,
      })

      return {
        axios: instance,
      }
    },
  },
  actions: {
    log: (context, event) => {
      // eslint-disable-next-line no-console
      console.log(event.type, context, event)
    },

    /*
    initAxios: (context, event) => {
      context.axios = axios.create({
        baseURL: 'https://some-domain.com/api/',
        timeout: 3000,
        headers: { 'X-Custom-Header': 'foobar' },
      })
    },
    */
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
      console.log('MakeMachine', id)
      const machine = gatewayMachine
        .withContext({
          ...gatewayMachine.context,
          credentials: credentials.value[id],
        })
        .withConfig({
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

      const state = shallowRef(machine.initialState)

      const service = interpret(machine, {
        id: `${gatewayMachine.id}/${id}`,
        devTools: true,
      })

      service.onTransition((nextState) => {
        const initialStateChanged
          = nextState.changed === undefined
          && Object.keys(nextState.children).length

        if (nextState.changed || initialStateChanged)
          state.value = nextState
      })
      service.start(/* State.create(machine.initialState) */)

      return {
        id,
        state,
        send: markRaw(service.send),
        service: markRaw(service),
      }
    }

    const gateways = shallowReactive<Record<string, ReturnType<typeof makeMachine>>>({})

    watch(credentials, () => {
      // Loop in credentials
      objectKeys(credentials.value).forEach((id) => {
        if (!gateways[id])
          gateways[id] = makeMachine(id)
        else
          gateways[id].send('LOAD/CREDENTIALS', credentials.value[id])
      })

      // Loop in gateways
      objectKeys(gateways).forEach((id) => {
        if (credentials.value[id] === undefined) {
          gateways[id].service.stop()
          delete gateways[id]
        }
      })
    }, { immediate: true })

    onBeforeUnmount(() => {
      objectKeys(gateways).forEach((id) => {
        console.log('Stop all', id)
        gateways[id].service.stop()
      })
    })

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
