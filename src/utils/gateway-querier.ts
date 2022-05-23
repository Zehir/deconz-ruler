import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type * as Deconz from '~/interfaces/deconz'

export class GatewayQuerier {
  private credentials: Deconz.GatewayCredentials

  public static DiscoveryURL = 'https://phoscon.de/discover'

  public urls = {
    protocol: () => `http${this.credentials.secured ? 's' : ''}://`,
    base: () => `${this.urls.protocol()}${this.credentials.ip}:${this.credentials.port}/api`,
    baseAuth: () => `${this.urls.base()}/${this.credentials.apiKey}`,
    baseNoUser: () => `${this.urls.base()}/<nouser>`,
    config: () => `${this.urls.baseAuth()}/config`,
    anonymousConfig: () => `${this.urls.baseNoUser()}/config`,
  }

  constructor(credentials: Deconz.GatewayCredentials) {
    this.credentials = credentials
    const invalid = [undefined, '', 0]

    if (invalid.includes(this.credentials.ip))
      throw new Error('Gateway ip is undefined.')

    if (invalid.includes(this.credentials.port))
      throw new Error('Gateway port is undefined.')

    if (this.credentials.apiKey === undefined)
      this.credentials.apiKey = '<nouser>'

    if (this.credentials.secured === undefined)
      this.credentials.secured = false
  }

  public async getAnonymousConfig(): Promise<Deconz.AnonymousConfig | undefined> {
    return GatewayQuerier.getData(this.urls.anonymousConfig())
  }

  public static async getDiscovery(): Promise<Deconz.PhosconDiscoveryEntry[] | undefined> {
    return GatewayQuerier.getData(GatewayQuerier.DiscoveryURL, { timeout: 5000 })
  }

  public static async get(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    return axios({
      ...{
        method: 'get',
        url,
        responseType: 'json',
        timeout: 2000,
      },
      ...options,
    })
  }

  public static async getData(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    const req = await GatewayQuerier.get(url, options)
    if (req.status === 200 && req.data)
      return req.data
  }
}
