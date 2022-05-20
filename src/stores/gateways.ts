import axios from 'axios'
import { acceptHMRUpdate, defineStore } from 'pinia'

import type { Gateway } from '~/interfaces/deconz'
import { GatewayQuerier } from '~/utils/gateway-querier'
// import { Scan } from '~/utils/gateway-scanner'

const phosconDiscoveryUrl = 'https://phoscon.de/discover'

export const useGatewaysStore = defineStore('gateways', () => {
  const gateways: Record<string, Gateway> = reactive({})
  const currentGatewayID = ref('')
  const currentGateway = computed<Gateway>(() => gateways[currentGatewayID.value])
  const logs = ref('')

  async function scanGateways() {
    logs.value = 'Scanning gateways...'

    logs.value = `Fetching data from '${phosconDiscoveryUrl}'.`

    const Guesses = new Set<Gateway>()

    // Try to find a gateway using the discovery API.
    try {
      const discover = await axios.request({
        method: 'GET',
        url: phosconDiscoveryUrl,
        responseType: 'json',
        timeout: 2000,
      })
      if (Array.isArray(discover.data) && discover.data.length > 0) {
        logs.value = `Found ${discover.data.length} gateways.`
        discover.data.forEach((element) => {
          Guesses.add({
            id: element.id,
            name: element.name,
            ip: element.internalipaddress,
            port: element.internalport,
            isValid: false,
          })
        })
      }
      else {
        logs.value = `No data fetched from '${phosconDiscoveryUrl}'.`
      }
    }
    catch (error) {
      logs.value = `Error while fetching data from '${phosconDiscoveryUrl}': ${error}`
      console.error(error)
    }

    // Try using localhost with various ports.
    logs.value = 'Add 3 guesses from localhost.';
    [80, 443, 8080].forEach((port) => {
      Guesses.add({ ip: 'localhost', port })
    })

    // Try using homeassistant address.
    logs.value = 'Add 2 guesses from homeassistant.';
    ['core-deconz.local.hass.io', 'homeassistant.local'].forEach((host) => {
      Guesses.add({ ip: host, port: 40850 })
    })

    logs.value = `Processing ${Guesses.size} guesses...`;
    (await Promise.all(Array.from(Guesses).map(FindGatewayAt)))
      .forEach((gateway: Gateway | undefined) => {
        if (gateway && gateway.id)
          gateways[gateway.id] = gateway
      })
    logs.value = `Found ${Object.keys(gateways).length} gateways.`
  }

  async function FindGatewayAt(guess: Gateway): Promise<Gateway | undefined> {
    try {
      logs.value = `Trying to find gateway at '${guess.ip}:${guess.port}'.`
      const querrier = new GatewayQuerier(guess)
      const config = await querrier.get(querrier.urls.config())
      if (config.data) {
        return {
          id: config.data.bridgeid,
          name: config.data.devicename,
          ip: guess.ip,
          port: guess.port,
          secured: guess.secured === true,
          isValid: false,
        }
      }
    }
    catch (error) {

    }

    // console.log(guess.ip, guess.port)

    return undefined
  }

  return {
    gateways,
    logs,
    currentGatewayID,
    currentGateway,
    scanGateways,
  }
})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGatewaysStore, import.meta.hot))
