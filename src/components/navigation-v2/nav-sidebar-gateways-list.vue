<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'

const GatewaysStore = useGatewaysStore()
</script>

<template>
  <v-navigation-drawer width="72" permanent>
    <v-list nav class="d-flex flex-column pa-0" height="100%">
      <perfect-scrollbar>
        <template
          v-for="item in GatewaysStore.credentials"
          :key="item.id"
        >
          <gateway-badge
            v-model="GatewaysStore.credentials[item.id]"
          />
        </template>
        <v-divider />
        <v-list-item class="ma-1 justify-center">
          <btn-rounded-circle>
            <v-icon icon="mdi-plus" />
            <v-tooltip location="right" activator="parent">
              Add Gateway
            </v-tooltip>
          </btn-rounded-circle>
        </v-list-item>
      </perfect-scrollbar>
    </v-list>
  </v-navigation-drawer>
</template>
