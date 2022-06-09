<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Gateway } from '~/interfaces/deconz'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'

const App = useAppStore()
const Gateways = useGatewaysStore()
const { dialogGatewayEditor } = storeToRefs(App)
const { all, currentURI, logs } = storeToRefs(Gateways)

const { t } = useI18n()

async function connectToGateway(gateway: Gateway) {
  currentURI.value = gateway.uri
  dialogGatewayEditor.value = true
}
</script>

<template>
  <v-dialog v-model="dialogGatewayEditor">
    <form-gateway />
  </v-dialog>

  <v-container fluid>
    <v-card class="pa-2" outlined tile>
      <div>
        <p>Gateway Discovery</p>
        <v-btn @click.prevent="Gateways.scanGateways">
          Scan Gateways
        </v-btn>
        <p>{{ logs }}</p>
      </div>
    </v-card>

    <br>

    <v-card class="pa-2" outlined tile>
      <v-card-header>
        <v-card-header-text>
          <v-card-title class="text-h5">
            Gateways
          </v-card-title>
        </v-card-header-text>
      </v-card-header>

      <v-card-content class="py-1">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Address
              </th>
              <th class="text-left">
                State
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(gateway, index) in all" :key="index">
              <td>{{ gateway.name }}</td>
              <td>...{{ gateway.id.slice(-6) }}</td>
              <td>{{ gateway.uri }}</td>
              <td>{{ gateway.state }}</td>
              <td>
                <v-btn
                  elevation="2"
                  @click="connectToGateway(gateway)"
                >
                  {{ t('button.connect') }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-content>
    </v-card>
    {{ all }}
    {{ currentURI }}
  </v-container>
</template>
