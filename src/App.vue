<script setup lang="ts">
// https://github.com/vueuse/head
import { isDark } from '~/composables'

useHead({
  title: 'deCONZ Ruler',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
})
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>
