<script setup lang="ts">
import type { GatewayCredentials } from '~/composables/gateway-credentials'
import { useGatewayScanner } from '~/composables/gateway-scanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const scanner = useGatewayScanner()

const { t } = useI18n()
</script>

<template>
  <v-btn @click="scanner.scan">
    Scan
  </v-btn>

  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="index in GatewaysStore.credentials.length" :key="index"
        :cols="12"
      >
        <gateway-credentials v-model="GatewaysStore.credentials[index - 1 ]" />
      </v-col>
    </v-row>
  </v-container>
  <p>{{ scanner.logs }}</p>
  <p>{{ GatewaysStore.credentials }}</p>
</template>
