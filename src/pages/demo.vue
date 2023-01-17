<script setup lang="ts">
import { useDemoStore } from '~/stores/demo'

const DemoStore = useDemoStore()

const generateData = () => {
  const k = btoa(Math.random().toString()).substring(10, 30)
  const v = btoa(Math.random().toString()).substring(10, 30)
  DemoStore.credentials[k] = v
}

const clearData = () => {
  Object.keys(DemoStore.credentials).forEach((key) => {
    delete DemoStore.credentials[key]
  })
}

// Comment or uncomment this line do not trigger the issue
const testMethod = computed(() => 1)
</script>

<template>
  <v-container fluid>
    <h1>Demo</h1>
    <p>
      Demo page for issue :
      <a target="_blank" href="https://github.com/prazdevs/pinia-plugin-persistedstate/issues/79">#79</a>.
    </p>
    <p>Current state of credentials:</p>
    <json-viewer :value="DemoStore.credentials" :expand-depth="5" />
    <v-btn @click="generateData">
      Generate Data
    </v-btn>
    <v-btn @click="clearData">
      Clear Data
    </v-btn>
  </v-container>
</template>
