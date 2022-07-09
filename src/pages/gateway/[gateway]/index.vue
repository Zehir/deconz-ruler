<script setup lang="ts">
import { useGatewayScanner } from '~/composables/gateway-scanner'
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
  gateway/[gateway]/index.vue

  <v-btn
    v-for="(domain, index) in Gateway.data" :key="index"
    :to="`/gateway/${props.gateway}/${index}`"
  >
    {{ index }}
    >
  </v-btn>
  <json-viewer
    v-if="Gateway?.data"
    :value="Gateway.data"
    :expand-depth="0"
  />
</template>
