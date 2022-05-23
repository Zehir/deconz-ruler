import { acceptHMRUpdate, defineStore } from 'pinia'

import { Gateway } from '~/interfaces/deconz'
import { GatewayQuerier } from '~/utils/gateway-querier'

export const useGatewaysStore = defineStore('gateways', () => {
  const gateways: Record<string, Gateway> = reactive({})
  const currentGatewayPath = ref('')
  const currentGateway = computed<Gateway>(() => gateways[currentGatewayPath.value])

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
          const path = Gateway.getPath(element.internalipaddress, element.internalport)
          // Check if gateway is already known.
          if (gateways[path] && gateways[path].isValid === false) {
            // Update the gateway.
            gateways[path].ip = element.internalipaddress
            gateways[path].name = element.name
          }
          else {
            gateways[path] = new Gateway(element.id, element.internalipaddress, element.internalport)
            gateways[path].name = element.name
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

    logs.value = `Found ${Object.keys(gateways).length} gateways.`
  }

  async function FindGatewayAt(guess: { ip: string; port: number }): Promise<void> {
    try {
      logs.value = `Trying to find gateway at '${guess.ip}:${guess.port}'.`
      const gateway: Gateway = new Gateway('Unknown ID', guess.ip, guess.port)
      const querrier = new GatewayQuerier(gateway)
      const config = await querrier.getAnonymousConfig()

      if (config !== undefined) {
        if (gateways[gateway.path] && gateways[gateway.path].isValid === false) {
          // Update the gateway.
          gateways[gateway.path].name = config.name
        }
        else {
          gateway.id = config.bridgeid
          gateway.name = config.name
          gateways[gateway.path] = gateway
        }
      }
    }
    catch (error) {

    }
  }

  function setCurrentGateway(path: string) {
    currentGatewayPath.value = path
  }

  return {
    gateways,
    logs,
    currentGatewayPath,
    currentGateway,
    scanGateways,
    setCurrentGateway,
  }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate
  persist: {
    paths: [
      'gateways',
      'currentGatewayPath',
    ],
    afterRestore: ({ store }) => {
      Object.entries(store.gateways).forEach(([key, gateway]) => {
        store.gateways[key] = Gateway.fromCredentials(gateway as Gateway)
      })
    },

    /*
    serializer: {
      serialize: (data) => {
        const savedData = {
          currentGatewayPath: data.currentGatewayPath,
          credentials: Object.values(data.gateways).map((gateway) => {
            return gateway instanceof Gateway ? gateway.credentials : null
          }),
        }
        return JSON.stringify(savedData)
      },
      deserialize: (data) => {
        const loadedData = JSON.parse(data)
        const gateways: Record<string, Gateway> = {}
        loadedData.credentials.forEach((credentials: GatewayCredentials) => {
          const gateway = Gateway.fromCredentials(credentials)
          gateways[gateway.path] = gateway
        })
        loadedData.gateways = gateways
        return loadedData
      },
    },
    */
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
