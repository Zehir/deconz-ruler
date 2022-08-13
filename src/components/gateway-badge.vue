<script setup lang="ts">
import type { GatewayCredentials } from '~/interfaces/deconz'

const props = defineProps<{
  modelValue: GatewayCredentials
}>()

const active = ref(true)
const over = ref(true)
</script>

<template>
  <v-list-item class="ma-1 justify-center">
    <btn-rounded-circle>
      {{ props.modelValue.name.substring(0, 1) }}
    </btn-rounded-circle>
  </v-list-item>
</template>
