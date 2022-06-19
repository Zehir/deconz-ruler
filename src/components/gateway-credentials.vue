<script setup lang="ts">
import type { GatewayCredentials } from '~/composables/gateway-credentials'

const props = defineProps<{
  modelValue: GatewayCredentials
}>()

const credentials = useVModel(props)

const loading = ref(true)
</script>

<template>
  <v-card
    tonal
    :loading="loading"
  >
    <v-progress-linear
      v-if="loading"
      class="position-absolute"
      style="z-index: 1"
      height="5"
      indeterminate
    />
    <v-card-header>
      <v-card-header-text>
        <v-card-title>{{ credentials.name }}</v-card-title>
        <v-card-subtitle>{{ credentials.name }}</v-card-subtitle>
      </v-card-header-text>
    </v-card-header>

    <v-card-text>
      <v-text-field
        v-model="credentials.apiKey"
        label="Regular"
      />
      Lorem
    </v-card-text>
    <v-card-actions>
      <v-btn>Toto</v-btn>
    </v-card-actions>
  </v-card>
</template>
