<script setup lang="ts">
import type { GatewayData } from '~/interfaces/deconz'

import { useGatewaysStore } from '~/stores/useGatewaysStore'
/*
  TODO Ajouter une liste déroulante et pas seulement le nom de là où je suis
*/

const route = useRoute()

const show = ref(true)

const breadcrumbs = computed(() => {
  const items = []
  items.push({
    text: 'Home',
    disabled: false,
    to: '/',
  })

  switch (route.meta.breadcrumbs) {
    case 'resource-path': {
      show.value = true
      items.push({
        text: 'Gateways',
        disabled: false,
        to: '/gateway',
      })
      const GatewaysStore = useGatewaysStore()
      if (typeof route.params.gateway === 'string') {
        const Config = {} // WIP GatewaysStore.getData(route.params.gateway, 'config')
        items.push({
          text: Config.value?.name ?? route.params.gateway,
          disabled: false,
          to: `/gateway/${route.params.gateway}`,
        })
        if (typeof route.params.domain === 'string') {
          items.push({
            text: route.params.domain,
            disabled: false,
            to: `/gateway/${route.params.gateway}/${route.params.domain}`,
          })
          if (typeof route.params.resource === 'string') {
            // WIP
            /*
            const Resource = GatewaysStore.getData(route.params.gateway, route.params.domain as keyof GatewayData, route.params.resource)
            items.push({
              text: Resource.value?.name ?? `#${route.params.resource}`,
              disabled: false,
              to: `/gateway/${route.params.gateway}/${route.params.domain}/${route.params.resource}`,
            })
            */
          }
        }
      }

      break
    }
    default:{
      show.value = false
      break
    }
  }

  return items
})
</script>

<template>
  <div v-show="show">
    <v-breadcrumbs :items="breadcrumbs" />
    <v-divider />
  </div>
</template>
