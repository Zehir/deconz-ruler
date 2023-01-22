import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { Config, GatewayCredentials } from '~/interfaces/deconz'
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
  const gateways = reactive<Record<string, {
    credentials: GatewayCredentials
    config: Partial<Config>
  }>>({})

  const logs = ref('')
  const scanning = ref(false)
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

  function updateData(address: string, data: Config) {
    if (gateways[data.bridgeid] === undefined) {
      gateways[data.bridgeid] = {
        credentials: {
          id: data.bridgeid,
          name: '',
          apiKey: '',
          URIs: { },
        },
        config: {},
      }
    }

    gateways[data.bridgeid].credentials.name = data.name
    gateways[data.bridgeid].config = data

    if (Array.isArray(gateways[data.bridgeid].credentials.URIs.api))
      gateways[data.bridgeid].credentials.URIs.api!.push(address)
    else
      gateways[data.bridgeid].credentials.URIs.api = [address]
  }

  async function scan() {
    scanning.value = true
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
      'core-deconz.local.hass.io', // For the docker network
      'homeassistant.local', // For the local network
    ].forEach((host) => {
      Guesses.push({ ip: host, port: 40850 })
    })

    logs.value = `Processing ${Guesses.length} guesses...`

    console.log('Scanning for gateways, you may see errors below but just ignore them, it\'s just because there was no gateway there.')
    await Promise.all(Guesses.map(async (guess) => {
      const address = getURI(guess)
      const result = await findGatewayAt(address)
      if (result !== undefined)
        updateData(address, result)
    }))

    scanning.value = false
  }

  async function findGatewayAt(address: string): Promise<Config | undefined> {
    try {
      const request = await axiosClient().get<Config>(`${address}/api/config`)
      if (request.data) {
        logs.value = `Found gateway ${request.data.name} at '${address}'.`
        return request.data
      }
    }
    catch (error) {
      // Errors happen a lot here, it's not worth catching them.
    }
  }

  function getURI(guess: { ip: string; port: number }): string {
    return `http://${guess.ip}:${guess.port}`
  }

  return { gateways, logs, scan, scanning, findGatewayAt }
}
