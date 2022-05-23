<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGatewaysStore } from '~/stores/gateways'

const Gateways = useGatewaysStore()
const { gateways, logs } = storeToRefs(Gateways)

const { t } = useI18n()
</script>

<template>
  <v-card class="d-flex pa-2" outlined tile>
    <div>
      <p>Gateway Discovery</p>
      <v-btn @click.prevent="Gateways.scanGateways">
        Scan Gateways
      </v-btn>
      <p>{{ logs }}</p>
    </div>
  </v-card>

  <v-card
    v-for="(gateway, index) in gateways"
    :key="index"
    width="400"
    loading="true"
  >
    <v-card-title>{{ gateway.name }} ({{ gateway.id?.slice(-6) }})</v-card-title>
    <v-card-subtitle>Path : {{ gateway.path }}</v-card-subtitle>
    <v-card-actions>
      <v-btn
        elevation="2"
        @click="Gateways.setCurrentGateway(gateway.path)"
      >
        {{ t('button.select') }}
      </v-btn>

      <p>
        {{ gateways.currentGateway }}
      </p>
    </v-card-actions>
  </v-card>
</template>
