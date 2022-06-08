export interface Gateway extends GatewayCredentials {}
export class Gateway {
  isValid: boolean
  state: 'unknown' | 'querying' | 'missingApiKey' | 'checkingApiKey' | 'ok' | 'error'

  constructor(id: string, ip: string, port: number) {
    this.id = id
    this.secured = false
    this.ip = ip
    this.port = port
    this.apiKey = '<nouser>'
    this.state = 'unknown'
    this.isValid = false
  }

  public get uri(): string {
    return Gateway.getURI(this.secured, this.ip, this.port)
  }

  public static getURI(secured: boolean, ip: string, port: number): string {
    return `${secured === true ? 'https' : 'http'}://${ip}${isNaN(port) ? '' : `:${port}`}`
  }

  public static fromCredentials(credentials: GatewayCredentials): Gateway {
    const gateway = new Gateway(credentials.id, credentials.ip, credentials.port)
    gateway.name = credentials.name
    gateway.ws_port = credentials.ws_port
    gateway.apiKey = credentials.apiKey
    gateway.secured = credentials.secured
    return gateway
  }

  public get credentials() {
    return {
      id: this.id,
      secured: this.secured,
      ip: this.ip,
      port: this.port,
      ws_port: this.ws_port,
      apiKey: this.apiKey,
    }
  }
}

export interface GatewayCredentials {
  id: string
  name?: string
  ip: string
  port: number
  ws_port?: number
  apiKey: string
  secured: boolean
}

export interface PhosconDiscoveryEntry {
  id: string
  internalipaddress: string
  macaddress: string
  internalport: number
  name: string
  publicipaddress: string
}

export interface AnonymousConfig {
  apiversion: string
  bridgeid: string
  datastoreversion: string
  devicename: string
  factorynew: boolean
  mac: string
  modelid: string
  name: string
  replacesbridgeid: string
  starterkitid: string
  swversion: string
}

export interface Config extends AnonymousConfig {
  UTC: string
  websocketport: number
}
