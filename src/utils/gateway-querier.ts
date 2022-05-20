import axios from 'axios'
import type { Gateway } from '~/interfaces/deconz'

export class GatewayQuerier {
  private gateway: Gateway

  public urls = {
    protocol: () => `http${this.gateway.secured ? 's' : ''}://`,
    base: () => `${this.urls.protocol()}${this.gateway.ip}:${this.gateway.port}/api`,
    baseAuth: () => `${this.urls.base()}/${this.gateway.apiKey}`,
    baseNoUser: () => `${this.urls.base()}/<nouser>`,
    config: () => `${this.urls.baseAuth()}/config`,
  }

  constructor(gateway: Gateway) {
    this.gateway = gateway
    const invalid = [undefined, '', 0]

    if (invalid.includes(this.gateway.ip))
      throw new Error('Gateway ip is undefined.')

    if (invalid.includes(this.gateway.port))
      throw new Error('Gateway port is undefined.')

    if (this.gateway.apiKey === undefined)
      this.gateway.apiKey = '<nouser>'

    if (this.gateway.secured === undefined)
      this.gateway.secured = false
  }

  public get(url: string): Promise<any> {
    return axios.request({
      method: 'GET',
      url,
      responseType: 'json',
      timeout: 2000,
    })
  }
}
