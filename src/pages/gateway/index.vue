<script setup lang="ts">
import { useGatewayScanner } from '~/composables/gateway-scanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const scanner = useGatewayScanner(GatewaysStore.credentials)

const { t } = useI18n()
</script>

<template>
  <v-btn @click="scanner.scan()">
    Scan
  </v-btn>

  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="index in GatewaysStore.credentials.all.length" :key="index"
        :cols="12"
      >
        <gateway-credentials v-model="GatewaysStore.credentials.all[index - 1 ]" />
      </v-col>
    </v-row>
  </v-container>
  <p>{{ scanner.logs }}</p>
  <p>{{ GatewaysStore.credentials.all }}</p>
</template>
