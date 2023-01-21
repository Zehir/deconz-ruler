<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const Gateway = useGatewaysStore()
</script>

<template>
  <div v-if="Gateway.activeGateway?.value !== null && Gateway.activeGateway?.value !== undefined">
    <v-tooltip
      :text="Gateway.activeGateway.value.pooling.state.messages"
      :disabled="Gateway.activeGateway.value.pooling.state.isOK"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-chip
          class="ma-2"
          label
          v-bind="{ ...props }"
          :color="Gateway.activeGateway.value.pooling.state.color"
        >
          <v-icon start icon="mdi-api" />
          {{ Gateway.activeGateway.value.pooling.state.state }}
        </v-chip>
      </template>
    </v-tooltip>

    <v-tooltip
      :text="Gateway.activeGateway.value.websocket.state.messages"
      :disabled="Gateway.activeGateway.value.websocket.state.isOK"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-chip
          class="ma-2"
          label
          v-bind="{ ...props }"
          :color="Gateway.activeGateway.value.websocket.state.color"
        >
          <v-icon start icon="mdi-link-variant" />
          {{ Gateway.activeGateway.value.websocket.state.state }}
        </v-chip>
      </template>
    </v-tooltip>
  </div>
</template>
