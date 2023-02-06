<script setup lang="ts">
import { useGatewayScanner } from '~/composables/useGatewayScanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

const props = defineProps<{
  gateway: string
  domain: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Gateway = computed(() => {
  return GatewaysStore.gateways[props.gateway]
})

const { t } = useI18n()
</script>

<template>
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
