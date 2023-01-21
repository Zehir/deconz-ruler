export function useThingState() {
  const errors = ref<{ [key: string]: string }>({})
  const isOK = computed(() => Object.keys(errors.value).length === 0)
  const state = computed< 'Ok' | 'Error'>(() => isOK.value ? 'Ok' : 'Error')

  const color = computed(() => {
    return { Ok: 'green', Error: 'error' }[state.value]
  })

  const setError = (code: string, message: string) => {
    errors.value[code] = message
  }

  const clearError = (code: string) => {
    if (errors.value[code])
      delete errors.value[code]
  }

  const messages = computed(() => {
    return `${Object.values(errors.value).join(', ')}.`
  })

  return { errors, isOK, state, color, setError, clearError, messages }
}
