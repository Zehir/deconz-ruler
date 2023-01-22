<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const props = defineProps<{
  gateway: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Gateway = computed(() => {
  return GatewaysStore.gateways[props.gateway]
})

const { t } = useI18n()
</script>

<template>
  File : gateway/[gateway]/settings.vue
</template>

<route lang="json">
{
  "name": "Settings",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>

