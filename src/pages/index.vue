<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const { t } = useI18n()

// const AppStore = inject('AppStore') as ReturnType<typeof useAppStore>
const AppStore = useAppStore()

const GatewaysStore = useGatewaysStore()
</script>

<template>
  <v-container fluid>
    <v-btn to="/gateway/">
      Gateways
    </v-btn>

    <form-gateway mode="edit" gateway-id="00212EFFFF09701A" />

    {{ GatewaysStore.credentials }}
  </v-container>
</template>
