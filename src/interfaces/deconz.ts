export const DiscoveryURL = 'https://phoscon.de/discover'
export const DefaultUsername = 'delight'
export const DefaultPassword = 'delight'

export interface GatewayCredentials {
  id: string
  name: string
  apiKey: string
  URIs: GatewayURI[]
}

export interface GatewayURI {
  type: 'api' | 'websocket'
  address: string
}

export interface Config {
  apiversion: string
  bridgeid: string
  datastoreversion: string
  devicename: string
  factorynew: boolean
  mac: string
  modelid: string
  name: string
  replacesbridgeid: string | null
  starterkitid: string
  swversion: string
}

