import type { MaybeRef } from '@vueuse/core'

export type Protocol = 'https' | 'http' | 'ws' | 'wss'
export const Protocols: string[] = ['https', 'http', 'ws', 'wss']

export interface GatewayURI {
  protocol: Protocol
  hostname: string
  port: number
  uri: string
}
export function getURI(protocol: MaybeRef<Protocol>, ip: MaybeRef<string>, port: MaybeRef<number>): string {
  let URI = `${unref(protocol)}://${unref(ip)}`
  if (!(isNaN(unref(port))))
    URI += `:${unref(port)}`
  return URI
}

export function useGatewayURIs() {
  const all: GatewayURI[] = reactive([])

  const add = (_uri?: string): GatewayURI => {
    const gatewayURI: GatewayURI = reactive({
      protocol: 'http' as Protocol,
      hostname: '',
      port: 80,
      uri: computed({
        get: () => getURI(gatewayURI.protocol, gatewayURI.hostname, gatewayURI.port),
        set: (newURI: string) => {
          const url = new URL(newURI)
          const protocol = url.protocol.replace(':', '')
          gatewayURI.hostname = url.hostname
          gatewayURI.port = parseInt(url.port)
          if (Protocols.includes(protocol)) {
            gatewayURI.protocol = protocol as Protocol
            if (url.port === '') {
              switch (protocol) {
                case 'http':
                case 'ws':
                  gatewayURI.port = 80
                  break
                case 'https':
                case 'wss':
                  gatewayURI.port = 443
                  break
              }
            }
          }
        },
      }),
    })

    if (_uri !== undefined)
      gatewayURI.uri = _uri

    all.push(gatewayURI)
    return gatewayURI
  }

  const has = (uri: string): boolean => {
    for (let i = 0; i < all.length; i++) {
      if (all[i].uri === uri)
        return true
    }
    return false
  }

  return { all, add, has }
}
