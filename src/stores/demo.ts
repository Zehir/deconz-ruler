import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDemoStore = defineStore('demo', () => {
  const credentials = reactive<Record<string, string>>({})

  // Comment or uncomment this line to see the effects
  const testMethod = computed(() => 1)

  return { credentials }
}, {
  // https://github.com/prazdevs/pinia-plugin-persistedstate
  // For later : https://github.com/prazdevs/pinia-plugin-persistedstate/issues/60#issuecomment-1120244473

  persist: {
    paths: [
      'credentials',
    ],
  },

})

// https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDemoStore, import.meta.hot))
// Workaround for https://github.com/prazdevs/pinia-plugin-persistedstate/issues/79
// This will force a webpage refrech on edit
// if (import.meta.hot)
//  import.meta.hot.invalidate()
