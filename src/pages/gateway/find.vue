<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'
import { useGatewayScanner } from '~/composables/gateway-scanner'
import type { GatewayCredentials } from '~/interfaces/deconz'

const GatewaysStore = useGatewaysStore()

const Scanner = useGatewayScanner()

const { t } = useI18n()

onMounted(() => {
  Scanner.scan()
})
</script>

<template>
  <portal to="nav-topbar-details">
    <v-btn @click="Scanner.scan">
      Scan
    </v-btn>
  </portal>

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

  <div class="d-flex flex-wrap">
    <template
      v-for="credential in Scanner.credentials"
      :key="credential.id"
    >
      <card-gateway :credential="credential" />
    </template>
  </div>

  <hr>
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

