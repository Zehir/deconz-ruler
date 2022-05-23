export interface Gateway extends GatewayCredentials {}
export class Gateway {
  isValid: boolean
  state: 'unknown' | 'querying' | 'missingApiKey' | 'checkingApiKey' | 'ok' | 'error'

  constructor(id: string, ip: string, port: number) {
    this.id = id
    this.ip = ip
    this.port = port
    this.apiKey = '<nouser>'
    this.secured = false
    this.state = 'unknown'
    this.isValid = false
  }

  public get path(): string {
    return Gateway.getPath(this.ip, this.port)
  }

  public static getPath(ip: string, port: number): string {
    return `${ip}:${port}`
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
      ip: this.ip,
      port: this.port,
      name: this.name,
      ws_port: this.ws_port,
      apiKey: this.apiKey,
      secured: this.secured,
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
