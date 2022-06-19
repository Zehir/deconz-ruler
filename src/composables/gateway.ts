import type { GatewayCredentials } from '~/interfaces/deconz'

export function useGateway(credentials: GatewayCredentials) {
  return { credentials }
}
