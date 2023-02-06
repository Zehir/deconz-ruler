<script setup lang="ts">
import type { GatewayData } from '~/interfaces/deconz'

const props = withDefaults(defineProps<{
  domain: keyof GatewayData
}>(), {
})

const open = ref(false)

const domainData = computed(() => {
  return {}
  // return GatewaysStore.activeGateway?.getData(props.domain).value
})
</script>

<template>
  WIP
  <!--
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
  -->
</template>
