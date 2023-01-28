selected: '#ffffff',
<script setup lang="ts">
const selected = ref('#ffffff')
</script>

<template>
  <v-container fluid>
    <h1>Sandbox</h1>

    https://xstate.js.org/docs/packages/xstate-vue/#quick-start

    States:
    Discovered
    Configured
    Online/Offline
    Connected
    Errors : Configuration / Address / Api Key / Offline ?

    <!--
    {{ selected }}
    <v-swatches v-model="selected" />
    -->
  </v-container>
</template>
