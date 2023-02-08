import { acceptHMRUpdate, defineStore } from 'pinia'
import { State, assign, createMachine, interpret } from 'xstate'
import { useLocalStorage } from '@vueuse/core'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { GatewayCredentials } from '~/interfaces/deconz'

export interface GatewayMachineContext {
  credentials: GatewayCredentials
  axios?: AxiosInstance
  errorMessage?: string
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

/** @xstate-layout N4IgpgJg5mDOIC5RQIYBcwHcUE8DEAogEpEDyRA2gAwC6ioADgPawCWarTAdvSAB6IAjFUEAmAHQA2ABzSALNNEBmAOxUlq0QBoQORNICsVKQdErRVNYOlKFAXzs7UGbPgAypAIIARAPQBhIgJvAgA5ABUASU83AGVqOiQQZjYObl4BBDFBcVUDAE5pdRUVQXyVJR09BA0JSXy5JRlRfKNBUzkHJ3QsXHFuABtWLjA8b0jY-1JQ0IJ-cITeFPZOHiTMgFoDOXExSQUVSUEVaUkzSQMqxDkFKTl8-LKjQulDzscQZ16cfq4hkfEzCY-yg4jAXBQACMBpAxhNPAAhNwEXwABVIpDckVCAHFFkllmk1qBNgZDuIDNtJGc1DdJCpLrpEEcDLsqDdDg8jqJRF1Pj1XL9-mBAUxgcNQRBWLAoTCIIRQojkWiMVjcfjGCwVul1ogtiodkpFEUWpIlKIDNSrghTEpxIYOfV8tzeR8voLBsMRZgwJDYEwAMYAazAaHEUpl0NhYSVKIA6vFaEstUSMnrLXbWlQLubLQpRNJrbIVOIbo1JNmLmdLHz3X1PQCfX7AyGw+DZbDxrFY74ExrkinVmmEFtqbtBHJSmU5MdDJJra0ctOjUpKUb2UpawL6wAzHfCvBTGZzBZJgmDnUkxBG6Sl-LZh4GV4Mgwaa0FEtKB73jf7ETvboXD6ANuBGAMOC4KA8AgbgRWGAA3JgQ3EYZ2E8PhOFgftCSHXURytJkEBOYxWhuR4lGEQRpy3ICfhArgwIgqCwAAJxYpgWMBAZ0B3DiAFsUK4NCMJYbCL2JfhEFEOQqCLV8aO+cR6MYiVCBIchfAAVVCIJPH8AAJWMxNSXCrxqOQJGkh9WmfNdKkI8wdmkB4LNEfZKRkSQFMFZSwHA1TiDIIhfGxAA1GJIm8AB9TxUUiKKAGkCAATWM7UJMyWwcgaddBCdMljjka0SnyXIXPIyjqLdbcfgjXz-MguFJmmWZ5mCNLUzwppJF2L88sOKhXw0ORGWqG5b32B4nioF4Sm8vo6tAvymLwIIj1a09Ek1EzL0krJ7lLHkbDNYphAad8yntb9lHNEbDAcD4uCYCA4F4Otqm29Lhw2QxSupSkLSOekxHs6ppNZZdmizdppPmn4GzAZMdoyvVpCoqQLlMS1+pB61bFvB1JydF04aFL1RXFSCka+vCNkOO1-qxoHSmUa1y1ybYia5MRXUAxSEYpkEwQhKMIGpzqzI2LLSyKEb2hsU5REEUHEFte1OdOV8CwuXn+VosmASBIWIw7MXz2R77SlZRnAZx1nCLVwnNfNTXdfeg3vV9f1g1DcXTL2untnELNqUMGHSnyYqHmDm4mkrS0LBUUmBabb3W3DaVTb93bNjUHqQ5kAxw7KItXlLWOK3+6sk+q-WU69ltQ2FrPzZpyXV2MJ4zEGlcWkjwji3LxoXjEApbGTvdhWzlGEBO3qQaUdQjCVvGjl2e5HizWaa75j1J-Jk3Ren4d6VvZWF6XqgV8I8a7imrfix3vX+f3gFWPYljj7wmRjDR14zQBgUR41ozQlmUGYBoo9XgjQnvucm78OLiAAK5cBYmAFAAYAAWHYv5mQqD1bM0DFD5CNIIYq0lxAVAgTOC00CDCwOFGCNiiCUFBiepgCSOEc6IANCWQwVBBokILM6M0cljA63MJYEQNh7C1xfnAt+zDOIIRQEMCAAACWKkR1Ehg+gOC2eFzAE2sPTQBU1ipl0KAWaS+xbCmCfu7eqTFcF7WVhIDMRME6jWZE+MqDQeTuUtKcUmi0GLLQlC4zIE4eqHAuKcReqgzpFRvrcSaP5ywyWVjXBwQA */
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
      // Ceci est un service
      // https://xstate.js.org/docs/guides/typescript.html#typegen
      invoke: {
        id: 'initAxios',
        src: async () => {
          const catResponse = await fetch('https://dummyjson.com/products/1')
          const cats = await catResponse.json()
          return cats
        },
        onDone: {
          target: 'online',
          actions: assign({ errorMessage: (context, event) => 'C\'est cassé' }),
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
        console.log('New state')
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
