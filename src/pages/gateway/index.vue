<script setup lang="ts">
import { useGatewayScanner } from '~/composables/gateway-scanner'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const GatewaysStore = useGatewaysStore()

const scanner = useGatewayScanner()

const sensorID = ref(1)

const { t } = useI18n()
</script>

<template>
  <v-btn @click="scanner.scan">
    Scan
  </v-btn>

  <v-container fluid>
    gateway/index.vue
    <v-row dense>
      <!--
      <v-col :cols="12">
        <json-viewer :value="GatewaysStore.credentials" :expand-depth="1" />
      </v-col>
      -->
      <v-col
        v-for="index in Object.keys(GatewaysStore.credentials)" :key="index"
        :cols="12"
      >
        <gateway-credentials v-model="GatewaysStore.credentials[index]" />
        <!--
        <json-viewer
          v-if="GatewaysStore.gateway[index]?.data"
          :value="GatewaysStore.gateway[index].data"
          :expand-depth="0"
        />
        <v-text-field v-model="sensorID" label="Sensor ID" type="number" />
        <json-viewer
          v-if="GatewaysStore.gateway[index]?.getData('sensors', sensorID)"
          :value="GatewaysStore.gateway[index].getData('sensors', sensorID)"
          :expand-depth="2"
        />
        -->
      </v-col>
    </v-row>
  </v-container>

  <p v-if="scanner.logs.value.length > 0">
    {{ scanner.logs }}
  </p>

  <br>
</template>

<route lang="json">
{
  "name": "Gateway index",
  "meta": {
    "breadcrumbs": "resource-path"
  }
}
</route>
