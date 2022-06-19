import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { useGatewayCredentials } from './gateway-credentials'
import { getURI } from './gateway-uri'
import type { Config } from '~/interfaces/deconz'
import { DiscoveryURL } from '~/interfaces/deconz'

export interface PhosconDiscoveryEntry {
  id: string
  internalipaddress: string
  macaddress: string
  internalport: number
  name: string
  publicipaddress: string
}

export function useGatewayScanner(credentials: ReturnType<typeof useGatewayCredentials>) {
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

  function updateCredentials(id: string, name: string, uri: string) {
    let cred = credentials.get(id)
    if (cred === undefined)
      cred = credentials.add(id, name)
    else
      cred.name = name
    if (!cred.URIs.has(uri))
      cred.URIs.add(uri)
  }

  async function scan() {
    logs.value = 'Scanning gateways...'

    logs.value = `Fetching data from '${DiscoveryURL}'.`

    try {
      const discover = await axiosClient().get<PhosconDiscoveryEntry[]>(DiscoveryURL)
      if (discover.data) {
        logs.value = `Found ${discover.data.length} gateways.`
        discover.data.forEach((element) => {
          updateCredentials(element.id, element.name, getURI('http', element.internalipaddress, element.internalport))
          updateCredentials(element.id, element.name, getURI('http', element.publicipaddress, element.internalport))
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

    logs.value = `Found ${Object.keys(credentials.all).length} gateways.`
  }

  async function FindGatewayAt(guess: { ip: string; port: number }): Promise<void> {
    try {
      logs.value = `Trying to find gateway at '${guess.ip}:${guess.port}'.`
      const request = await axiosClient().get<Config>(`http://${guess.ip}:${guess.port}/api/config`)
      if (request.data) {
        logs.value = `Found gateway ${request.data.name} at '${guess.ip}:${guess.port}'.`
        updateCredentials(request.data.bridgeid, request.data.name, getURI('http', guess.ip, guess.port))
      }
    }
    catch (error) {
      // Errors happen a lot here, it's not worth catching them
    }
  }

  return { logs, scan }
}
