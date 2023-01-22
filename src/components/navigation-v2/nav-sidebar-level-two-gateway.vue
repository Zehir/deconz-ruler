<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const route = useRoute()

const App = useAppStore()
const GatewayStore = useGatewaysStore()

const baseURL = computed(() => {
  if (GatewayStore.activeGateway.value === null)
    return ''
  return `/gateway/${GatewayStore.activeGateway.value.id}`
})

const items = computed(() => {
  const list = [{
    title: 'Home',
    icon: 'mdi-cog',
    to: `${baseURL.value}/`,
  }]

  if (GatewayStore.activeGateway.value === null)
    return list

  list.push({
    title: 'Settings',
    icon: 'mdi-cog',
    to: `${baseURL.value}/settings`,
  })

  return list
})
</script>

<template>
  <v-list-item v-for="(item, index) in items" :key="index" v-bind="item" />
</template>
