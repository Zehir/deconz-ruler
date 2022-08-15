<script setup lang="ts">
import type { GatewayData } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

const props = withDefaults(defineProps<{
  domain: keyof GatewayData
}>(), {
})

const GatewaysStore = useGatewaysStore()

const open = ref(false)

const domainData = computed(() => {
  return GatewaysStore.activeGateway?.getData(props.domain).value
})
</script>

<template v-if="GatewaysStore.activeGatewayID">
  <v-btn
    block
    :prepend-icon="open ? 'mdi-chevron-down' : 'mdi-chevron-right'"
    @click="open = !open"
  >
    {{ props.domain }}
  </v-btn>
  <v-list v-if="open">
    <v-list-item
      v-for="(item, id) in domainData"
      :key="id"
      density="compact"
      :to="`/gateway/${GatewaysStore.activeGatewayID}/${props.domain}/${id}`"
    >
      {{ item.name }}
    </v-list-item>
  </v-list>
</template>
