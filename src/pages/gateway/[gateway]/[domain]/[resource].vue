<script setup lang="ts">
import { useGatewayScanner } from '~/composables/gateway-scanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const props = defineProps<{
  gateway: string
  domain: string
  resource: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Gateway = computed(() => {
  return GatewaysStore.gateway[props.gateway]
})

const { t } = useI18n()
</script>

<template>
  gateway/[gateway]/[domain]/[resource].vue

  <json-viewer
    v-if="Gateway?.data[domain][parseInt(resource)]"
    :value="Gateway.data[domain][parseInt(resource)]"
    :expand-depth="5"
  />
</template>
