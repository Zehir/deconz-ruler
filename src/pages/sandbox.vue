<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { createMachine } from 'xstate'

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: {
      on: { TOGGLE: 'active' },
    },
    active: {
      on: { TOGGLE: 'inactive' },
    },
  },
})

const { state, send } = useMachine(toggleMachine)
</script>

<template>
  <v-container fluid>
    <h1>Sandbox</h1>

    {{ state }}

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
