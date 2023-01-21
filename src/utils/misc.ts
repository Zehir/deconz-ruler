import type { ErrorObject } from '@vuelidate/core'
import type { MaybeRef } from '@vueuse/core'

/*
export function asArray<T>(value:<T> | []<T>) {
  return Array.isArray(value) ? value : [value]
}
*/
import type { MaybeRef } from '@vueuse/core'

export function displayPromiseResult<T>(promise: Promise<T>, successMessage = 'OK'): Promise<T> {
  promise.then(() => {
    console.log(successMessage)
  }).catch((error) => {
    console.warn(`${error.code} ${error.message}`)
  })
  return promise
}

export function errorMessages(errors: ErrorObject[]) {
  return errors.map(error => unref(error.$message))
}

export function concatenatePath(...paths: MaybeRef<string | undefined>[]) {
  return computed(() => {
    if (useArraySome(paths, path => path === undefined).value)
      return undefined
    return useArrayReduce(paths, (fullPath = '', path) => fullPath += `/${resolveUnref(path)}`)
      .value?.replaceAll(/[\/]{2,}/g, '/')
  })
}

export function StateToColor(state: MaybeRef<string>) {
  switch (unref(state)) {
    case 'connected':
      return 'success'
    case 'error':
      return 'error'
    case 'unknown':
    default:
      return 'grey'
  }
}
