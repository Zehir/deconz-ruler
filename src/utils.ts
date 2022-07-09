import type { MaybeRef } from '@vueuse/core'

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
