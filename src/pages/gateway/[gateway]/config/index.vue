<script setup lang="ts">
import { useGatewayScanner } from '~/composables/useGatewayScanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

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
  gateway/[gateway]/config/index.vue

  <json-viewer
    v-if="Gateway?.data.config"
    :value="Gateway.data.config"
    :expand-depth="1"
  />
</template>

<route lang="json">
{
  "name": "Config detail",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
