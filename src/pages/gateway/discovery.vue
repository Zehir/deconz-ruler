<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGatewaysStore } from '~/stores/gateways'

const Gateways = useGatewaysStore()
const { currentGatewayID, gateways, logs } = storeToRefs(Gateways)

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
      <v-card
        v-for="(gateway, index) in gateways"
        :key="index"
        width="400"
        :title="`${gateway.name} (${gateway.id?.slice(-6)})`"
        :subtitle="`${gateway.ip}:${gateway.port}`"
        text="This is content"
      />
    </div>
  </v-card>
</template>
