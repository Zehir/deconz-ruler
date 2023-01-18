import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { Config, GatewayCredentials, GatewayURI } from '~/interfaces/deconz'
import { DiscoveryURL } from '~/interfaces/deconz'

export interface PhosconDiscoveryEntry {
  id: string
  internalipaddress: string
  macaddress: string
  internalport: number
  name: string
  publicipaddress: string
}

export function useGatewayScanner() {
  const credentials = reactive<Record<string, GatewayCredentials>>({})
  const logs = ref('')
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
    logs.value = 'Scanning gateways...'
    const Guesses: { ip: string; port: number }[] = []

    logs.value = `Fetching data from '${DiscoveryURL}'.`
    try {
      const discover = await axiosClient().get<PhosconDiscoveryEntry[]>(DiscoveryURL)
      if (discover.data) {
        discover.data.forEach((element) => {
          Guesses.push({ ip: element.internalipaddress, port: element.internalport })
        })
      }
      else { logs.value = `No data fetched from '${DiscoveryURL}'.` }
    }
    catch (error) {
      logs.value = `Error while fetching data from '${DiscoveryURL}': ${error}`
      console.error(error)
    }

    // Try using localhost with various ports.
    logs.value = 'Add 3 guesses from localhost.';
    [80, 443, 8080].forEach((port) => {
      Guesses.push({ ip: 'localhost', port })
    })

    // Try using homeassistant address.
    logs.value = 'Add 2 guesses from homeassistant.';
    [
      'core-deconz.local.hass.io',
      'homeassistant.local',
    ].forEach((host) => {
      Guesses.push({ ip: host, port: 40850 })
    })

    logs.value = `Processing ${Guesses.length} guesses...`

    console.log('Scanning for gateways, you may see errors below but just ignore them, it\'s just because there was no gateway there.')
    await Promise.all(Guesses.map(FindGatewayAt))
  }

  async function FindGatewayAt(guess: { ip: string; port: number }): Promise<void> {
    try {
      const address = `http://${guess.ip}:${guess.port}`
      logs.value = `Trying to find gateway at '${address}'.`
      const request = await axiosClient().get<Config>(`${address}/api/config`)
      if (request.data) {
        logs.value = `Found gateway ${request.data.name} at '${address}'.`
        updateCredentials(request.data.bridgeid, request.data.name, { type: 'api', address })
      }
    }
    catch (error) {
      // Errors happen a lot here, it's not worth catching them.
    }
  }

  return { credentials, logs, scan }
}
