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
    Home
  </v-container>
</template>

<route lang="json">
{
  "meta": {
    "breadcrumbs": "none"
  }
}
</route>

