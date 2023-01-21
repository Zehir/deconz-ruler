<script setup lang="ts">
import type { Config, GatewayCredentials } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

const props = withDefaults(defineProps<{
  credentials: GatewayCredentials
  config: Partial<Config>
}>(), {})

const GatewaysStore = useGatewaysStore()

const updateGateway = () => {
  console.log('updateGateway', props.credentials)
  GatewaysStore.updateCredentials(props.credentials)
}
const deleteGateway = () => {
  console.log('deleteGateway', props.credentials)
  GatewaysStore.removeCredentials(props.credentials.id)
}

const inStore = computed(() => GatewaysStore.credentials[props.credentials.id] !== undefined)
</script>

<template>
  <v-card
    class="ma-4 d-flex flex-column"
    variant="tonal"
    width="400"
    height="400"
  >
    <template #prepend>
      <v-avatar color="surface-variant">
        <v-icon icon="mdi-sticker-emoji" />
      </v-avatar>
    </template>

    <template #title>
      <span>{{ credentials.name }} ({{ config.devicename }})</span>
    </template>

    <template #subtitle>
      <div class="d-flex flex-row">
        <span class="me-auto">{{ credentials.id }}</span>
        <span>Version : {{ config.swversion }}</span>
      </div>
    </template>

    <v-card-text class="mb-auto">
      <v-list lines="one">
        <v-list-item
          v-for="item, index in credentials.URIs"
          :key="index"
          variant="text"
          :title="item.address"
        />
      </v-list>
      <span class="text-caption text-grey-darken-1">
        This is the address of the gateway
      </span>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        @click="updateGateway"
      >
        {{ inStore ? 'Update' : "Add" }}
      </v-btn>
      <v-btn
        v-show="inStore"
        color="primary"
        variant="flat"
        @click="deleteGateway"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
