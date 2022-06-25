import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { Config, GatewayURI } from '~/interfaces/deconz'
import { DiscoveryURL } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

export interface PhosconDiscoveryEntry {
  id: string
  internalipaddress: string
  macaddress: string
  internalport: number
  name: string
  publicipaddress: string
}

export function useGatewayScanner() {
  const credentials = useGatewaysStore().credentials
  const logs = ref('')
  const found = ref(0)
  let _axiosClient: AxiosInstance | null = null

  const axiosClient = function () {
    if (_axiosClient)
      return _axiosClient
    _axiosClient = axios.create({
      timeout: 2000,
      method: 'get',
      responseType: 'json',
    })
    return _axiosClient
  }

  function updateCredentials(id: string, name: string, uri: GatewayURI) {
    if (credentials[id] === undefined) {
      credentials[id] = {
        id,
        name,
        apiKey: '',
        URIs: [],
      }
    }

    if (credentials[id].name !== name)
      credentials[id].name = name

    if (credentials[id].URIs.find(_uri => _uri.type === uri.type && _uri.address === uri.address) === undefined)
      credentials[id].URIs.push(uri)
  }

  async function scan() {
    found.value = 0
    logs.value = 'Scanning gateways...'

    logs.value = `Fetching data from '${DiscoveryURL}'.`

    try {
      const discover = await axiosClient().get<PhosconDiscoveryEntry[]>(DiscoveryURL)
      if (discover.data) {
        found.value += discover.data.length
        logs.value = `Found ${found.value} gateways.`
        discover.data.forEach((element) => {
          updateCredentials(element.id, element.name, {
            type: 'api',
            address: `http://${element.internalipaddress}:${element.internalport}`,
          })
          updateCredentials(element.id, element.name, {
            type: 'api',
            address: `http://${element.publicipaddress}:${element.internalport}`,
          })
        })
      }
      else { logs.value = `No data fetched from '${DiscoveryURL}'.` }
    }
    catch (error) {
      logs.value = `Error while fetching data from '${DiscoveryURL}': ${error}`
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

    logs.value = `Found ${found.value} gateways.`
  }

  async function FindGatewayAt(guess: { ip: string; port: number }): Promise<void> {
    try {
      found.value += 1
      const address = `http://${guess.ip}:${guess.port}`
      logs.value = `Trying to find gateway at '${address}'.`
      const request = await axiosClient().get<Config>(`${address}/api/config`)
      if (request.data) {
        logs.value = `Found gateway ${request.data.name} at '${address}'.`
        updateCredentials(request.data.bridgeid, request.data.name, { type: 'api', address })
      }
    }
    catch (error) {
      // Errors happen a lot here, it's not worth catching them
    }
  }

  return { logs, scan }
}
