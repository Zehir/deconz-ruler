<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const Gateway = useGatewaysStore()

const state = computed(() => {
  const gateway = Gateway.activeGateway?.value
  const returnValue = {
    api: { color: 'success', text: 'OK', tooltip: 'Connexion with API OK' },
    websocket: { color: 'success', text: 'OK', tooltip: 'Connexion with Websocket OK' },
  }
  if (gateway === null || gateway === undefined) {
    returnValue.api.color = 'grey'
    returnValue.api.text = 'Unknown'
    returnValue.api.tooltip = 'Unknown state'
    returnValue.websocket.color = 'grey'
    returnValue.websocket.text = 'Unknown'
    returnValue.websocket.tooltip = 'Unknown state'
    return returnValue
  }

  if (gateway.pooling.state === 'error') {
    returnValue.api.color = 'error'
    returnValue.api.text = 'Error'
    returnValue.api.tooltip = gateway.pooling.error
  }

  return returnValue
})
</script>

<template>
  <div v-if="Gateway.activeGateway?.value !== null">
    <v-tooltip
      :text="state.api.tooltip"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-chip
          class="ma-2"
          label
          v-bind="{ ...props, ... state.api }"
        >
          <v-icon start icon="mdi-api" />
          {{ state.api.text }}
        </v-chip>
      </template>
    </v-tooltip>

    <v-tooltip
      :text="state.websocket.tooltip"
      location="bottom"
    >
      <template #activator="{ props }">
        <v-chip
          class="ma-2"
          label
          v-bind="{ ...props, ... state.websocket }"
        >
          <v-icon start icon="mdi-link-variant" />
          {{ state.websocket.text }}
        </v-chip>
      </template>
    </v-tooltip>
  </div>
</template>
