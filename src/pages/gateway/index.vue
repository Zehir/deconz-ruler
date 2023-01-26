<script setup lang="ts">
import { useGatewayScanner } from '~/composables/useGatewayScanner'

const Scanner = useGatewayScanner()
const { t } = useI18n()

onMounted(() => {
  Scanner.runDiscovery()
})
</script>

<template>
  <portal to="nav-topbar-details">
    <v-btn
      :loading="Scanner.discovering.value"
      :disabled="Scanner.discovering.value"
      variant="tonal"
      @click="Scanner.runDiscovery"
    >
      Scan for gateways
      <template #loader>
        Discovering &nbsp;
        <v-progress-circular
          indeterminate
          size="23"
          width="2"
        />
      </template>
    </v-btn>

    <dialog-find-gateway class="ma-2" variant="tonal">
      Find by address
    </dialog-find-gateway>
  </portal>

  <div class="d-flex flex-wrap">
    <template
      v-for="gateway in Scanner.gateways"
      :key="gateway.credentials.id"
    >
      <card-gateway
        :credentials="gateway.credentials"
        :config="gateway.config"
      />
    </template>
  </div>

  <v-expansion-panels>
    <v-expansion-panel
      title="Debug view"
    >
      <v-expansion-panel-text>
        <json-viewer :value="Scanner.gateways" :expand-depth="3" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<route lang="json">
{
  "name": "Gateways",
  "meta": {
    "hideLevelTwoSidebar": true
  }
}
</route>

