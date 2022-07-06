import { createFetch, get } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import type { GatewayData } from '~/interfaces/deconz'

export function useGatewayPooling(gatewayAPIUri: ComputedRef<string>, data: Ref<GatewayData>) {
  // Pooling
  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 2000,
    },
  })

  const shell = useGatewayFetch('/', {
    // immediate: false,
    refetch: true,
    initialData: data,
    onFetchError(ctx) {
      // ctx.data can be null when 5xx response
      if (ctx.data === null)
        ctx.data = { title: 'Hunter x Hunter' } // Modifies the response data
      return ctx
    },
  }).get().json()

  const pooling = useIntervalFn(() => {
    if (get(shell.isFetching) === true)
      return
    shell.execute()
  }, 30000)

  const destroy = () => {
    pooling.pause()
    shell.abort()
  }

  return { shell, destroy }
}
