<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

const props = defineProps<{
  gateway: string
}>()

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const { t } = useI18n()
</script>

<template>
  File : gateway/[gateway]/settings/connexions.vue
  <template v-if="GatewaysStore.activeCredential">
    <br>
    Saved
    <json-viewer :value="GatewaysStore.activeCredential" :expand-depth="4" />
    <form-gateway-connexions :credentials="GatewaysStore.activeCredential" />
  </template>
</template>

<route lang="json">
{
  "name": "Settings",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>

