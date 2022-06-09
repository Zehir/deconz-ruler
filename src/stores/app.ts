import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  /**
   * UI
   */
  const showSidebar = ref(false)

  const dialogGatewayEditor = ref(false)

  return {
    showSidebar,
    dialogGatewayEditor,
  }
})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
