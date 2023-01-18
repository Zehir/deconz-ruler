<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'
import { useGatewayScanner } from '~/composables/gateway-scanner'

const GatewaysStore = useGatewaysStore()

const Scanner = useGatewayScanner()

const dialog = ref(false)

const Add = () => {

}

const { t } = useI18n()

onMounted(Scanner.scan)
</script>

<template>
  <v-btn @click="Scanner.scan">
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

  <p v-if="Scanner.credentials">
    <json-viewer :value="Scanner.credentials" :expand-depth="5" />
  </p>

  <hr>

  <p v-if="Scanner.credentials">
    <json-viewer :value="Scanner.credentials" :expand-depth="5" />
  </p>

  <p v-if="Scanner.logs.value.length > 0">
    {{ Scanner.logs }}
  </p>

  <br>
</template>

<route lang="json">
{
  "name": "Find Gateway",
  "meta": {
    "hideLevelTwoSidebar": true
  }
}
</route>

