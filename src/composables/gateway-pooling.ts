import { createFetch, get } from '@vueuse/core'
import type { Ref } from 'vue'
import type { GatewayData } from '~/interfaces/deconz'

export function useGatewayPooling(gatewayAPIUri: Ref<string>, data: Ref<GatewayData>) {
  const state = ref('unknown')
  const error = ref('')
  // Pooling
  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 2000,
    },
  })

  const shell = useGatewayFetch('/', {
    immediate: false,
    refetch: true,
    afterFetch(ctx) {
      state.value = 'connected'
      error.value = ''
      return ctx
    },
    onFetchError(ctx) {
      state.value = 'error'
      error.value = ctx.error.message
      return ctx
    },
  }).get().json()

  const pooling = useIntervalFn(() => {
    if (get(shell.isFetching) === true)
      return
    shell.execute()
  }, 30000, { immediate: false })

  watch(gatewayAPIUri, (newURI) => {
    if (newURI.length !== 0)
      pooling.resume()
  }, { immediate: true })

  watch(shell.data, (newData) => {
    if (shell.statusCode.value !== 200) {
      error.value = shell.error.value
      console.warn(shell.error)
      return
    }
    // Todo make a better patch method
    data.value = newData
  })

  const destroy = () => {
    pooling.pause()
    shell.abort()
  }

  return { state, error, shell, destroy }
}
