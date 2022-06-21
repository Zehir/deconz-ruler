<script setup lang="ts">
import type { GatewayCredentials } from '~/interfaces/deconz'
import { useGatewaysStore } from '~/stores/gateways'

const props = defineProps<{
  modelValue: GatewayCredentials
}>()

const credentials = useVModel(props)

const GatewaysStore = useGatewaysStore()

const loading = ref(true)
const editMode = ref(false)

const cardClick = () => {
  console.log('cardClick')
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
  <v-card tonal>
    <v-progress-linear
      v-if="loading"
      class="position-absolute"
      style="z-index: 1"
      height="5"
      indeterminate
    />
    <v-card-header>
      <v-card-header-text>
        <v-card-title>
          {{ credentials.name }}
          <v-spacer />
          <v-btn v-if="editMode" @click.stop="deleteSelf">
            Delete
          </v-btn>
          <v-btn @click.stop="editMode = !editMode">
            {{ editMode ? "Done" : "Edit" }}
          </v-btn>
        </v-card-title>
        <v-card-subtitle>{{ credentials.id }}</v-card-subtitle>
      </v-card-header-text>
    </v-card-header>

    <v-card-text>
      <p v-if="editMode">
        <v-text-field v-model="credentials.apiKey" label="API Key" />
      </p>
      <p v-else>
        API Key = "{{ credentials.apiKey }}"
      </p>
      <v-table>
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
              <v-text-field v-model="uri.address" />
              <v-btn @click.stop="credentials.URIs.splice(index, 1)">
                Delete
              </v-btn>
            </td>
            <td v-else>
              {{ uri.address }}
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
