<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const { t } = useI18n()

// const AppStore = inject('AppStore') as ReturnType<typeof useAppStore>
const App = useAppStore()

App.navigationTitle = 'Home'
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

