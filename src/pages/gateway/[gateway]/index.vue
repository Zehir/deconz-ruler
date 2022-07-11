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
  File : gateway/[gateway]/index.vue

  <div v-if="Gateway?.data">
    <v-btn
      v-for="(domain, index) in Gateway.data" :key="index"
      :to="`/gateway/${props.gateway}/${index}`"
    >
      {{ index }}
      >
    </v-btn>
    <json-viewer
      :value="Gateway.data"
      :expand-depth="0"
    />
  </div>
</template>

<route lang="json">
{
  "name": "Gateway detail",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
