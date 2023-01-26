import { createFetch, get } from '@vueuse/core'
import type { Ref } from 'vue'
import { useThingState } from './useThingState'
import type { GatewayData } from '~/interfaces/deconz'

export function useGatewayPooling(gatewayAPIUri: Ref<string>, data: Ref<Partial<GatewayData>>) {
  const state = useThingState()
  const error = ref('')
  const endpoint = ref('/config')
  // Pooling
  const useGatewayFetch = createFetch({
    baseUrl: gatewayAPIUri,
    options: {
      timeout: 5000,
    },
  })

  const shell = useGatewayFetch(endpoint, {
    immediate: false,
    refetch: true,
    afterFetch(ctx) {
      state.clearError('fetch')
      return ctx
    },
    onFetchError(ctx) {
      state.setError('fetch', ctx.error.message)
      return ctx
    },
  }).get().json()

  const pooling = useIntervalFn(() => {
    if (get(shell.isFetching) === true)
      return
    shell.execute()
  }, 30000, { immediate: false })

  watch(gatewayAPIUri, (newURI) => {
    endpoint.value = '/config'
    if (newURI.length === 0) {
      state.setError('api_address', 'Invalid API address')
    }
    else {
      pooling.resume()
      state.clearError('api_address')
    }
  }, { immediate: true })

  watch(shell.data, (newData) => {
    if (shell.statusCode.value !== 200) {
      error.value = shell.error.value
      console.warn(shell.error.value)
      return
    }

    switch (endpoint.value) {
      case '/':
        // Todo make a better patch method
        data.value = newData
        break

      case '/config':
        data.value = { config: newData }
        // If linkbutton value is present, the api key is valid
        if (newData.linkbutton === undefined) {
          state.setError('api_key', 'Invalid API key')
          pooling.pause()
        }
        else {
          // Next time fetch the good data and start pooling
          endpoint.value = '/'
          state.clearError('api_key')
          pooling.resume()
        }
        break
    }
  })

  const destroy = () => {
    pooling.pause()
    shell.abort()
  }

  return { useGatewayFetch, state, error, shell, destroy, isActive: pooling.isActive }
}
