<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const { t } = useI18n()

// const AppStore = inject('AppStore') as ReturnType<typeof useAppStore>
const AppStore = useAppStore()
</script>

<template>
  <v-container fluid>
    <v-btn to="/gateway/">
      Gateways
    </v-btn>
  </v-container>
</template>
