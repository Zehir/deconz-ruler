<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGatewaysStore } from '~/stores/gateways'

const GatewaysStore = useGatewaysStore()

const items = ref([
  { id: '75', image: 'https://randomuser.me/api/portraits/women/75.jpg', to: '/' },
  { id: '10', image: 'https://randomuser.me/api/portraits/women/10.jpg', to: '/' },
  { id: '43', image: 'https://randomuser.me/api/portraits/women/43.jpg', to: '/' },
])
</script>

<template>
  <v-navigation-drawer width="72" permanent>
    <v-list nav class="d-flex flex-column pa-0" height="100%">
      <template
        v-for="item in GatewaysStore.credentials"
        :key="item.id"
      >
        <gateway-badge v-model="GatewaysStore.credentials[item.id]" />
      </template>
      <v-divider />
      <v-list-item class="ma-1 justify-center">
        <btn-rounded-circle>
          <v-icon icon="mdi-plus" />
        </btn-rounded-circle>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
