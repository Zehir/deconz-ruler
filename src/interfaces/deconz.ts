import axios from 'axios'
import { GatewayQuerier } from '~/utils/gateway-querier'

export interface Gateway extends GatewayCredentials {

}

/*
export class Gateway {
  isValid: boolean
  state: 'unknown' | 'unreachable' | 'querying' | 'missingApiKey' | 'invalidApiKey' | 'ready'

  constructor(id: string, ip: string, port: number) {
    this.id = id
    this.secured = false
    this.ip = ip
    this.port = port
    this.apiKey = ''
    this.state = 'unknown'
    this.isValid = false
  }

  public get uri(): string {
    return Gateway.getURI(this.secured, this.ip, this.port)
  }

  public set uri(uri: string) {
    const url = new URL(uri)
    switch (url.protocol) {
      case 'http':
        this.secured = false
        break
      case 'https':
        this.secured = true
        break
    }
    this.ip = url.hostname
    this.port = parseInt(url.port)
  }

  public static getURI(secured: boolean, ip: string, port: number): string {
    return `${secured === true ? 'https' : 'http'}://${ip}${isNaN(port) || port === null ? '' : `:${port}`}`
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

  public async queryState() {
    this.state = 'querying'
    this.isValid = false
    const querier = new GatewayQuerier(this.credentials)
    try {
      const config = await querier.getConfig()
      if (config) {
        this.id = config.bridgeid
        this.name = config.name
        if (GatewayQuerier.isAuthenticatedConfig(config))
          this.state = 'ready'
        else if (this.apiKey.length > 0)
          this.state = 'invalidApiKey'
        else
          this.state = 'missingApiKey'
      }
    }
    catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403)
          this.state = 'invalidApiKey'
        else if (error.code === 'ECONNABORTED')
          this.state = 'unreachable'
      }
      else { this.state = 'unknown' }
    }
    finally {
      this.isValid = this.state === 'ready'
    }
  }
}

*/

export const DiscoveryURL = 'https://phoscon.de/discover'
export const DefaultUsername = 'delight'
export const DefaultPassword = 'delight'

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

