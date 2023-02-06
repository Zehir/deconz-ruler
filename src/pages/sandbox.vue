<script setup lang="ts">

</script>

<template>
  <v-container fluid>
    <h1>Sandbox</h1>

    <pre>
    https://xstate.js.org/docs/packages/xstate-vue/#quick-start

    States:
    Discovered
    Configured
    Online/Offline
    Connected
    Errors : Configuration / Address / Api Key / Offline ?
  </pre>
    <!--
    {{ selected }}
    <v-swatches v-model="selected" />
    -->
  </v-container>
</template>

<route lang="json">
{
  "name": "Sandbox",
  "meta": {
    "hideLevelTwoSidebar": true
  }
}
</route>

