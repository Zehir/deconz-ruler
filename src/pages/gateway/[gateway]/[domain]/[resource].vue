<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import type { GatewayData } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

const props = defineProps<{
  gateway: string
  domain: keyof GatewayData
  resource: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const Resource = computed(() => {
  return {}
  // WIP return GatewaysStore.getData(props.gateway, props.domain, props.resource).value
})

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
