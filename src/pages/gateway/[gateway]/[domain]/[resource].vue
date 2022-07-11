<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'
import type { GatewayData } from '~/interfaces/deconz'

const props = defineProps<{
  gateway: string
  domain: keyof GatewayData
  resource: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Resource = GatewaysStore.getData(props.gateway, props.domain, props.resource)

const { t } = useI18n()
</script>

<template>
  File : gateway/[gateway]/[domain]/[resource].vue

  <json-viewer
    v-if="Resource"
    :value="Resource"
    :expand-depth="5"
  />
</template>

<route lang="json">
{
  "name": "Resource detail",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
