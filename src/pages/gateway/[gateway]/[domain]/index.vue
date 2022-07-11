<script setup lang="ts">
import { useGatewayScanner } from '~/composables/gateway-scanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const props = defineProps<{
  gateway: string
  domain: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Gateway = computed(() => {
  return GatewaysStore.gateway[props.gateway]
})

const { t } = useI18n()
</script>

<template>
  <breadcrumbs />
  <v-divider />
  File : gateway/[gateway]/[domain]/index.vue

  <div v-if="Gateway?.data[domain]">
    <v-btn
      v-for="(resource, index) in Gateway.data[domain]" :key="index"
      :to="`/gateway/${props.gateway}/${props.domain}/${index}`"
    >
      {{ resource.name }}
      >
    </v-btn>
    <json-viewer
      :value="Gateway.data[domain]"
      :expand-depth="0"
    />
  </div>
</template>

<route lang="json">
{
  "name": "Domain index",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
