<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

const route = useRoute()

const App = useAppStore()
const GatewayStore = useGatewaysStore()

const baseURL = computed(() => {
  if (GatewayStore.activeGateway?.id === undefined)
    return ''
  return `/gateway/${GatewayStore.activeGateway.id}`
})

const items = computed(() => {
  const list: any[] = []

  if (GatewayStore.activeGateway === undefined)
    return list

  list.push({
    title: 'Home',
    props: {
      prependIcon: 'mdi-home',
      to: `${baseURL.value}/`,
    },
  })

  list.push({ type: 'divider' })
  list.push({
    type: 'subheader',
    title: 'Settings',
    props: {
      to: `${baseURL.value}/settings/connexions`,
      prependIcon: 'mdi-cog',
    },
  })

  list.push({
    title: 'Connexions',
    props: {
      prependIcon: 'mdi-link',
      to: `${baseURL.value}/settings/connexions`,
    },
  })

  return list
})
</script>

<template>
  <v-list :items="items" />

  <!--
  <v-list-item v-for="(item, index) in items" :key="index" v-bind="item">
    <template v-if="item.icon" #prepend>
      <v-icon :icon="item.icon" />
    </template>
  </v-list-item>
-->
</template>
