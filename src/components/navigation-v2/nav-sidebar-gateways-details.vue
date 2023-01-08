<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { GatewayData } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

const GatewaysStore = useGatewaysStore()

const items = ref([
  { text: 'Home', icon: 'mdi-home', to: '/' },
  { text: 'Gateways', icon: 'mdi-router-wireless', to: '/gateway' },
])
</script>

<template>
  <v-navigation-drawer width="240" permanent>
    <template v-if="GatewaysStore.activeGateway">
      <v-card :title="GatewaysStore.activeGateway.credentials.name" />

      <v-list>
        <v-list-item>
          <v-list-item-title># Settings</v-list-item-title>
        </v-list-item>
      </v-list>

      <!--
      <domain-detail-list
        v-for="(data, name) in GatewaysStore.activeGateway.data"
        :key="name"
        :domain="name as keyof GatewayData"
      />
      -->
    </template>
  </v-navigation-drawer>
</template>
