<script setup lang="ts">
import Color = require('color')
import type { GatewayCredentials } from '~/interfaces/deconz'

// eslint-disable-next-line vue/define-macros-order
const props = defineProps<{
  modelValue: GatewayCredentials
}>()

const test = computed(() => {
  return Color('rgb(255, 255, 255)')
})
</script>

<template>
  <v-list-item class="ma-1 justify-center">
    <btn-rounded-circle color="blue">
      {{ props.modelValue.name.substring(0, 1) }}
    </btn-rounded-circle>
  </v-list-item>
</template>
