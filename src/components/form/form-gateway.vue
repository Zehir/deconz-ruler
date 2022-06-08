<script setup lang="ts">
import { storeToRefs } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useGatewaysStore } from '~/stores/gateways'
import { Gateway } from '~/interfaces/deconz'
import { GatewayQuerier } from '~/utils/gateway-querier'

const Gateways = useGatewaysStore()

const { gateways, currentGatewayPath, currentGateway } = storeToRefs(Gateways)

const address = ref('http://localhost:80')
const apiKey = ref('')
const password = ref(GatewayQuerier.DefaultPassword)
const showPassword = ref(false)
const step = ref(1)

const acquireUsingPassword = reactive({
  loading: false,
  errorMessage: '',
})

function getGatewayFromForm() {
  const url = new URL(address.value)
  return new Gateway('Unknown', url.hostname, parseInt(url.port))
}

async function acquireAPIKeyUsingPassword() {
  try {
    acquireUsingPassword.loading = true
    acquireUsingPassword.errorMessage = ''
    const gateway = getGatewayFromForm()
    gateway.state = 'querying'
    const gatewayQuerrier = new GatewayQuerier(gateway.credentials)
    const config = await gatewayQuerrier.getAnonymousConfig()
    if (config === undefined)
      throw new Error('Could not connect to gateway.')

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
      if (axios.isAxiosError(error) && error.response?.status === 403)
        acquireUsingPassword.errorMessage = 'Invalid password'
      else if (typeof error === 'object' && error.message)
        acquireUsingPassword.errorMessage = error.message
      else if (typeof error === 'string')
        acquireUsingPassword.errorMessage = error
      else
        acquireUsingPassword.errorMessage = 'Unknown error'
    }

    // TODO This need to move somewhere else
    const authConfig = await gatewayQuerrier.getConfig()

    if (authConfig) {
      gateway.state = 'ok'
      gateway.isValid = true
      gateway.id = authConfig.bridgeid
      gateway.name = authConfig.name
      gateway.ws_port = authConfig.websocketport
    }

    acquireUsingPassword.loading = false
  }
  catch (e) {
    acquireUsingPassword.loading = false
  }
}

onBeforeMount(() => {
  /*
  if (currentGateway.value instanceof Gateway && currentGateway.value.getPath)
    data.address = currentGateway.value.getPath()
    */
})
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-form>
          <v-card-text>
            <v-text-field
              v-model="address"
              label="Address"
              placeholder="http://localhost:80"
              hint="IP-address and port of your deconz instance. Example: 127.0.0.1 or 192.168.1.100"
            />
            <v-divider />
            <v-text-field
              v-model="apiKey"
              label="API Key"
              hint="The API key used for requests. Check the deconz restapi documentation for details on how to get an API key."
            />

            <v-expansion-panels>
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
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Acquire API key using unlocked gateway
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-form>
      </v-window-item>

      <v-window-item :value="2">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="128"
            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
          />
          <h3 class="text-h6 font-weight-light mb-2">
            Welcome to Vuetify
          </h3>
          <span class="text-caption grey--text">Thanks for signing up!</span>
        </div>
      </v-window-item>
    </v-window>

    <v-divider />

    <v-card-actions>
      <v-btn
        v-if="step > 1"
        text
        @click="step--"
      >
        Back
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="step < 2"
        color="primary"
        depressed
        @click="step++"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-container>
    {{ JSON.stringify({
      address,
      apiKey,
      step,
    }) }}
  </v-container>
</template>
