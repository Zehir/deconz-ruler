<script setup lang="ts">
import Color from 'color'
import type { GatewayCredentials } from '~/interfaces/deconz'

import { useGatewaysStore } from '~/stores/gateways'

const props = withDefaults(defineProps<{
  modelValue: GatewayCredentials
}>(), {
})

const GatewaysStore = useGatewaysStore()

const active = computed(() => {
  return props.modelValue.id === GatewaysStore.activeGatewayID
})

const badgeColor = computed(() => {
  return Color(`#${props.modelValue.id.substring(10)}`)
    .lightness(80)
    .hex()
})
</script>

<template>
  <v-list-item class="ma-1 justify-center">
    <btn-rounded-circle
      :active="active"
      :color="badgeColor"
      @click="GatewaysStore.activeGatewayID = props.modelValue.id"
    >
      {{ props.modelValue.name.substring(0, 1) }}
      <v-tooltip location="right" activator="parent">
        {{ props.modelValue.name }}
      </v-tooltip>
    </btn-rounded-circle>
  </v-list-item>
</template>
