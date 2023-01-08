<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const props = defineProps<{
  gateway: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Gateway = computed(() => {
  return GatewaysStore.gateway[props.gateway]
})

const { t } = useI18n()
</script>

<template>
  File : gateway/[gateway]/settings.vue
  Coucou
</template>

<route lang="json">
{
  "name": "Gateway detail",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
