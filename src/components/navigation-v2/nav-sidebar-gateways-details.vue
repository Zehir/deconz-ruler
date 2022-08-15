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
  <v-navigation-drawer width="240" color="grey-darken-1" permanent>
    <template v-if="GatewaysStore.activeGateway">
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            block
            height="48"
            append-icon="mdi-chevron-down"
            v-bind="props"
          >
            {{ GatewaysStore.activeGateway.credentials.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Hello</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <domain-detail-list
        v-for="(data, name) in GatewaysStore.activeGateway.data"
        :key="name"
        :domain="name as keyof GatewayData"
      />
    </template>
  </v-navigation-drawer>
</template>
