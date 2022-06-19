<script setup lang="ts">
import { storeToRefs } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useAppStore } from '~/stores/app'
import { useGatewaysStore } from '~/stores/gateways'
import { Gateway } from '~/interfaces/deconz'
import { GatewayQuerier } from '~/utils/gateway-querier'

const App = useAppStore()
const Gateways = useGatewaysStore()
const { dialogGatewayEditor } = storeToRefs(App)
const { all, current, currentURI } = storeToRefs(Gateways)

const address = ref('http://localhost:80')
const apiKey = ref('')
const password = ref('')
const showPassword = ref(false)
const openPanel = ref(0)

const acquireUsingPassword = reactive({
  loading: false,
  errorMessage: '',
})

function getGatewayFromForm() {
  const gateway = new Gateway('Unknown', '', NaN)
  gateway.uri = address.value
  return gateway
}

async function acquireAPIKeyUsingPassword() {
  acquireUsingPassword.loading = true
  acquireUsingPassword.errorMessage = ''
  const gateway = getGatewayFromForm()
  const gatewayQuerrier = new GatewayQuerier(gateway.credentials)

  try {
    const newKey = await gatewayQuerrier.getAPIKeyUsingPassword(password.value)
    if (newKey === undefined)
      throw new Error('Could not connect to gateway.')
    if (newKey) {
      apiKey.value = newKey
      gateway.apiKey = newKey
    }
  }
  catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403)
        acquireUsingPassword.errorMessage = 'Invalid password'
      else if (error.code === 'ECONNABORTED')
        acquireUsingPassword.errorMessage = 'No response from the gateway'
    }
    else if (typeof error === 'object' && error.message) { acquireUsingPassword.errorMessage = error.message }
    else if (typeof error === 'string') { acquireUsingPassword.errorMessage = error }
    else { acquireUsingPassword.errorMessage = 'Unknown error' }
  }
  finally {
    acquireUsingPassword.loading = false
  }
}

async function saveAndConnect() {
  const gateway = getGatewayFromForm()
  gateway.apiKey = apiKey.value
  const gatewayQuerrier = new GatewayQuerier(gateway.credentials)

  const authConfig = await gatewayQuerrier.getConfig()

  if (authConfig) {
    current.value.ip = gateway.ip
    current.value.port = gateway.port
    current.value.apiKey = gateway.apiKey
    current.value.state = 'ready'
    current.value.isValid = true
    current.value.id = authConfig.bridgeid
    current.value.name = authConfig.name
    current.value.ws_port = authConfig.websocketport

    if (currentURI.value !== current.value.uri) {
      const oldURI = currentURI.value
      all.value[current.value.uri] = current.value
      currentURI.value = current.value.uri
      delete all.value[oldURI]
    }

    dialogGatewayEditor.value = false
  }
}

onBeforeMount(() => {
  if (current.value instanceof Gateway) {
    address.value = current.value.uri
    apiKey.value = current.value.apiKey
  }
})
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="500"
    min-width="400"
  >
    <v-form>
      <v-card-text>
        <v-text-field
          v-model="address"
          label="Address"
          placeholder="http://localhost:80"
          hint="IP-address and port of your deconz instance. Example: 127.0.0.1 or 192.168.1.100"
        />

        <v-text-field
          v-model="apiKey"
          label="API Key"
          hint="The API key used for requests. Check the deconz restapi documentation for details on how to get an API key."
        />

        <v-expansion-panels v-model="openPanel">
          <v-expansion-panel>
            <v-expansion-panel-title>
              Acquire API key using password
            </v-expansion-panel-title>
            <v-progress-linear :active="acquireUsingPassword.loading" indeterminate />
            <v-expansion-panel-text>
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="acquireUsingPassword.errorMessage"
                hide-details="auto"
                label="Password"
                @click:append="showPassword = !showPassword"
              />
              <v-btn
                class="float-right"
                @click="acquireAPIKeyUsingPassword"
              >
                Get API key
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <!--
          <v-expansion-panel>
            <v-expansion-panel-title>
              Acquire API key using unlocked gateway
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-text>
          </v-expansion-panel>
          -->
        </v-expansion-panels>
      </v-card-text>
    </v-form>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn
        depressed
        @click="dialogGatewayEditor = false"
      >
        Cancel
      </v-btn>
      <v-btn
        depressed
        @click="saveAndConnect()"
      >
        Save and connect
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
