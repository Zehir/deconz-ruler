<script setup lang="ts">
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
      <v-col :cols="12">
        <json-viewer :value="GatewaysStore.credentials" :expand-depth="1" />
      </v-col>
      <v-col
        v-for="index in Object.keys(GatewaysStore.credentials)" :key="index"
        :cols="12"
      >
        <gateway-credentials v-model="GatewaysStore.credentials[index]" />
        <json-viewer
          v-if="GatewaysStore.data[index]?.data"
          :value="GatewaysStore.data[index].data"
          :expand-depth="0"
        />

        <json-viewer
          v-if="GatewaysStore.data[index]"
          :value="GatewaysStore.data[index].getDataRef('sensors', 2)"
          :expand-depth="2"
        />
      </v-col>
    </v-row>
  </v-container>

  <p v-if="scanner.logs.value.length > 0">
    {{ scanner.logs }}
  </p>

  <br>
</template>
