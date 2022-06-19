import { useGatewayURIs } from './gateway-uri'

export interface GatewayCredentials {
  id: string
  name: string
  apiKey: string
  URIs: ReturnType<typeof useGatewayURIs>
}

export function useGatewayCredentials() {
  const all: GatewayCredentials[] = reactive([])

  const add = (id: string, name: string, apiKey = ''): GatewayCredentials => {
    const URIs = useGatewayURIs()
    const gatewayCredentials = reactive({ id, name, apiKey, URIs })
    all.push(gatewayCredentials)
    return gatewayCredentials
  }

  const get = (_id: string) => {
    for (let i = 0; i < all.length; i++) {
      if (all[i].id === _id)
        return all[i]
    }
  }

  const has = (_id: string) => {
    return get(_id) !== undefined
  }

  return { all, add, get, has }
}
