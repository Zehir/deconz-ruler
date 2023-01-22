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
const GatewayName = computed(() => GatewaysStore.credentials[props.gateway].name)

const { t } = useI18n()

onMounted(() => {
  onUnmounted(syncRef(GatewayName, toRef(App, 'navigationTitle'), { direction: 'ltr' }))
})
</script>

<template>
  File : gateway/[gateway]/index.vue
  <json-viewer
    v-if="Gateway"
    :value="Gateway.data"
    :expand-depth="2"
  />

  {{ Gateway?.pooling?.isActive }}
  <!--
  <json-viewer
    :value="Gateway"
    :expand-depth="0"
  />
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
  -->
</template>

<route lang="json">
{
  "name": "Gateway index",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
