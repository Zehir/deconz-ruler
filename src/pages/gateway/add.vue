<script setup lang="ts">
import { useGatewayScanner } from '~/composables/useGatewayScanner'
import { useGatewaysStore } from '~/stores/useGatewaysStore'

const GatewaysStore = useGatewaysStore()
const Scanner = useGatewayScanner()

const dialog = ref(false)

const Add = () => {

}

const { t } = useI18n()
</script>

<template>
  <v-btn @click="Scanner.runDiscovery">
    Scan
  </v-btn>

  <!--
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ props }">
      <v-btn v-bind="props">
        Add
      </v-btn>
    </template>

    <form-gateway />
  </v-dialog>
-->

  <!--
    <form-gateway mode="new" address="http://homeassistant.local:40850" api-key="2305677514" />
  -->
  <br>
  <v-container fluid>
    gateway/index.vue
    <v-row dense>
      <v-col :cols="12">
        <json-viewer :value="GatewaysStore.credentials" :expand-depth="1" />
      </v-col>
      <v-col
        v-for="index in objectKeys(GatewaysStore.credentials)" :key="index"
        :cols="12"
      >
        <gateway-credentials v-model="GatewaysStore.credentials[index]" />
      </v-col>
    </v-row>
  </v-container>

  <p v-if="Scanner.logs.value.length > 0">
    {{ Scanner.logs }}
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
