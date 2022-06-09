import { acceptHMRUpdate, defineStore } from 'pinia'

import { Gateway } from '~/interfaces/deconz'
import { GatewayQuerier } from '~/utils/gateway-querier'

export const useGatewaysStore = defineStore('gateways', () => {
  const all: Record<string, Gateway> = reactive({})
  const currentURI = ref('')
  const current = computed<Gateway>(() => all[currentURI.value])
  const editorDialog = ref(false)

  const logs = ref('')

  async function scanGateways() {
    logs.value = 'Scanning gateways...'

    logs.value = `Fetching data from '${GatewayQuerier.DiscoveryURL}'.`

    // Try to find a gateway using the discovery API.
    try {
      const discover = await GatewayQuerier.getDiscovery()
      if (discover) {
        logs.value = `Found ${discover.length} gateways.`
        discover.forEach((element) => {
          const path = Gateway.getURI(false, element.internalipaddress, element.internalport)
          // Check if gateway is already known.
          if (all[path] && all[path].isValid === false) {
            // Update the gateway.
            all[path].ip = element.internalipaddress
            all[path].name = element.name
          }
          else {
            all[path] = new Gateway(element.id, element.internalipaddress, element.internalport)
            all[path].name = element.name
          }
        })
      }
      else {
        logs.value = `No data fetched from '${GatewayQuerier.DiscoveryURL}'.`
      }
    }
    catch (error) {
      logs.value = `Error while fetching data from '${GatewayQuerier.DiscoveryURL}': ${error}`
      console.error(error)
    }

    const Guesses: { ip: string; port: number }[] = []
    // Try using localhost with various ports.
    logs.value = 'Add 3 guesses from localhost.';
    [80, 443, 8080].forEach((port) => {
      Guesses.push({ ip: 'localhost', port })
    })

    // Try using homeassistant address.
    logs.value = 'Add 2 guesses from homeassistant.';
    ['core-deconz.local.hass.io', 'homeassistant.local'].forEach((host) => {
      Guesses.push({ ip: host, port: 40850 })
    })

    logs.value = `Processing ${Guesses.length} guesses...`

    await Promise.all(Guesses.map(FindGatewayAt))

    logs.value = `Found ${Object.keys(all).length} gateways.`
  }

  async function FindGatewayAt(guess: { ip: string; port: number }): Promise<void> {
    try {
      logs.value = `Trying to find gateway at '${guess.ip}:${guess.port}'.`
      const gateway: Gateway = new Gateway('Unknown ID', guess.ip, guess.port)
      const querrier = new GatewayQuerier(gateway)
      const config = await querrier.getAnonymousConfig()

      if (config !== undefined) {
        if (all[gateway.uri] && all[gateway.uri].isValid === false) {
          // Update the gateway.
          all[gateway.uri].name = config.name
        }
        else {
          gateway.id = config.bridgeid
          gateway.name = config.name
          all[gateway.uri] = gateway
        }
      }
    }
    catch (error) {

    }
  }

  function setCurrentGateway(uri: string) {
    currentURI.value = uri
  }

  return {
    all,
    logs,
    currentURI,
    current,
    editorDialog,
    scanGateways,
    setCurrentGateway,
  }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate
  persist: {
    paths: [
      'all',
      'currentURI',
    ],
    afterRestore: ({ store }) => {
      Object.entries(store.all).forEach(([key, gateway]) => {
        store.all[key] = Gateway.fromCredentials(gateway as Gateway)
      })
    },
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
