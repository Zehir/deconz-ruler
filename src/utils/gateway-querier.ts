import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type * as Deconz from '~/interfaces/deconz'
// import { Gateway } from '~/interfaces/deconz'

export class GatewayQuerier {
  private credentials: Deconz.GatewayCredentials

  public static DiscoveryURL = 'https://phoscon.de/discover'
  public static DefaultUsername = 'delight'
  public static DefaultPassword = 'delight'

  public urls = {
    base: () => '',
    baseAuth: () => `${this.urls.base()}/${this.credentials.apiKey}`,
    baseNoUser: () => `${this.urls.base()}/<nouser>`,
    config: () => `${this.urls.baseAuth()}/config`,
    anonymousConfig: () => `${this.urls.baseNoUser()}/config`,
  }

  constructor(credentials: Deconz.GatewayCredentials) {
    this.credentials = credentials
  }

  public async getAnonymousConfig(): Promise<Deconz.AnonymousConfig | undefined> {
    return GatewayQuerier.getData(this.urls.anonymousConfig())
  }

  public async getConfig(): Promise<Deconz.Config | Deconz.AnonymousConfig | undefined> {
    return GatewayQuerier.getData(this.urls.config())
  }

  public static isAuthenticatedConfig(config: Deconz.Config | Deconz.AnonymousConfig): config is Deconz.Config {
    return 'uuid' in config
  }

  public async getAPIKeyUsingPassword(password: string): Promise<string | undefined> {
    const result = await GatewayQuerier.getData(this.urls.base(), {
      method: 'POST',
      data: {
        devicetype: 'Deconz-Ruler',
        login: GatewayQuerier.DefaultUsername,
      },
      auth: {
        username: GatewayQuerier.DefaultUsername,
        password,
      },
    })

    if (Array.isArray(result) && result.length === 1 && result[0].success && result[0].success.username) {
      this.credentials.apiKey = result[0].success.username
      return this.credentials.apiKey
    }
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
