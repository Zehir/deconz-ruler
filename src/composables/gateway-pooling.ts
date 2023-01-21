import { createFetch, get } from '@vueuse/core'
import type { Ref } from 'vue'
import type { GatewayData } from '~/interfaces/deconz'

export function useGatewayPooling(gatewayAPIUri: Ref<string>, data: Ref<Partial<GatewayData>>) {
  const state = ref('unknown')
  const error = ref('')
  const target = ref('/config')
  // Pooling
  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 2000,
    },
  })

  const shell = useGatewayFetch(target, {
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
    target.value = '/config'
    if (newURI.length !== 0)
      pooling.resume()
  }, { immediate: true })

  watch(shell.data, (newData) => {
    if (shell.statusCode.value !== 200) {
      error.value = shell.error.value
      console.warn(shell.error)
      return
    }

    switch (target.value) {
      case '/':
        // Todo make a better patch method
        data.value = newData
        break

      case '/config':
        data.value = { config: newData }
        // If linkbutton value is present, the api key is valid
        if (newData.linkbutton === undefined) {
          state.value = 'error'
          error.value = 'Invalid api key'
          pooling.pause()
        }
        else {
          target.value = '/'
        }
        break
    }
  })

  const destroy = () => {
    pooling.pause()
    shell.abort()
  }

  return { state, error, shell, destroy, isActive: pooling.isActive }
}
