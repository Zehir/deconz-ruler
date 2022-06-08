<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGatewaysStore } from '~/stores/gateways'

const Gateways = useGatewaysStore()
const { gateways, logs } = storeToRefs(Gateways)

const { t } = useI18n()
</script>

<template>
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
      <form-gateway />
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
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(gateway, index) in gateways" :key="index">
              <td>{{ gateway.name }}</td>
              <td>{{ gateway.id }}</td>
              <td>
                <v-btn
                  elevation="2"
                  @click="Gateways.setCurrentGateway(gateway.path)"
                >
                  {{ t('button.select') }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-content>
    </v-card>
  </v-container>
</template>
