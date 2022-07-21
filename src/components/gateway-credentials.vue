<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { GatewayCredentials } from '~/interfaces/deconz'
import { GatewayURITypes } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'
import { StateToColor } from '~/utils'

const props = defineProps<{
  modelValue: GatewayCredentials
}>()

const credentials = useVModel(props)
const router = useRouter()

const GatewaysStore = useGatewaysStore()

const loading = ref(false)
const editMode = ref(false)

const Gateway = computed(() => {
  const gateway = GatewaysStore.gateway[credentials.value.id]
  if (!gateway)
    return null

  return gateway
})

const cardClick = () => {
  router.push(`/gateway/${credentials.value.id}`)
}

const addURI = () => {
  credentials.value.URIs.push({
    type: 'api',
    address: '',
  })
}

const deleteSelf = () => {
  delete GatewaysStore.credentials[credentials.value.id]
}
</script>

<template>
  <!--
    <v-card
    v-ripple="false"
    tonal
    @click.stop="cardClick"
  >
  -->
  <v-card
    v-ripple="false"
    tonal
    @click.stop="cardClick"
  >
    <v-progress-linear
      v-if="loading"
      class="position-absolute"
      style="z-index: 1"
      height="5"
      indeterminate
    />
    <v-card-title>
      {{ credentials.name }}
      <v-spacer />
      <v-badge
        :color="StateToColor(Gateway?.pooling.state ?? 'unknown')"
        content="API"
        inline
      />
      <v-badge
        :color="StateToColor(Gateway?.websocket.state ?? 'unknown')"
        content="Websocket"
        inline
      />
      <v-btn v-if="editMode" @click.stop="deleteSelf">
        Delete
      </v-btn>
      <v-btn @click.stop="editMode = !editMode">
        {{ editMode ? "Done" : "Edit" }}
      </v-btn>
    </v-card-title>
    <v-card-subtitle>{{ credentials.id }}</v-card-subtitle>
    <v-card-text>
      <p v-if="editMode">
        <v-text-field v-model="credentials.apiKey" label="API Key" />
      </p>
      <v-table v-if="editMode">
        <thead>
          <tr>
            <th class="text-left w-75">
              Address
            </th>
            <th class="text-left w-25">
              State
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(uri, index) in credentials.URIs" :key="index"
          >
            <td v-if="editMode">
              <v-select v-model="uri.type" :items="GatewayURITypes" />
              <v-text-field v-model="uri.address" />
              <v-btn @click.stop="credentials.URIs.splice(index, 1)">
                Delete
              </v-btn>
            </td>
            <td v-else>
              {{ uri.type }} : {{ uri.address }}
            </td>
            <td>
              <v-badge
                color="info"
                content="12"
                inline
              />
            </td>
          </tr>
          <tr v-if="editMode">
            <td>
              <v-btn @click="addURI">
                Add URI
              </v-btn>
            </td>
            <td />
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
