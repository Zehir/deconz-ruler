import { createFetch, get } from '@vueuse/core'
import type { Ref } from 'vue'
import { useThingState } from './useThingState'
import { useGatewayScanner } from './useGatewayScanner'
import type { GatewayData } from '~/interfaces/deconz'

export function useNewGateway(credentials: Ref<GatewayCredentials>) {
  const scanner = useGatewayScanner()

  return { }
}
