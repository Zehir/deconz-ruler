<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'
import type { GatewayURI } from '~/interfaces/deconz'
import { GatewayURITypes } from '~/interfaces/deconz'

const props = withDefaults(defineProps<{
  mode: 'new' | 'edit'
  gatewayId?: string
  address?: string
  apiKey?: string
}>(), {
  mode: 'new',
})

const GatewaysStore = useGatewaysStore()

const uris = ref<GatewayURI[]>([])
const apiKey = ref('')
const password = ref('')
const showPassword = ref(false)
const openPanel = ref(0)
const tab = ref(null)

const acquireUsingPassword = reactive({
  loading: false,
  errorMessage: '',
})

async function acquireAPIKeyUsingPassword() {
  /*
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
  */
}

async function cancel() {

}

async function saveAndConnect() {
  /*
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
  */
}

const GatewayURITypesOptions = GatewayURITypes.map(item => ({
  title: item.charAt(0).toUpperCase() + item.slice(1),
  value: item,
}))

onBeforeMount(() => {
  switch (props.mode) {
    case 'new':{
      /*
      uris.value.push({
        type: 'api',
        address: props.address || 'http://localhost:80',
      })
      apiKey.value = props.apiKey || ''
      */
      break
    }
    case 'edit':{
      /*
      if (props.gatewayId === undefined)
        break
      const credentials = GatewaysStore.credentials[props.gatewayId]
      if (credentials === undefined)
        break
      credentials.URIs.forEach((uri) => {
        uris.value.push({ ...uri })
      })
      apiKey.value = credentials.apiKey
      */
      break
    }
  }
})
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="500"
    min-width="400"
  >
    <v-tabs
      v-model="tab"
      grow
    >
      <v-tab value="general">
        General
      </v-tab>
      <v-tab value="address">
        Address
      </v-tab>
      <v-tab value="api_key">
        API Key
      </v-tab>
    </v-tabs>

    <v-form>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="general">
            <p>
              You can set multiple API and Websocket Address for the same gateway.
              <br>
              WIP for now only the first one is used.
            </p>
          </v-window-item>
        </v-window>
        <v-window v-model="tab">
          <v-window-item value="address">
            <p>
              You can set multiple API and Websocket Address for the same gateway.
              <br>
              WIP for now only the first one is used.
            </p>
            <template
              v-for="(uri, index) in uris"
              :key="index"
            >
              <v-container class="d-inline-flex">
                <v-select
                  v-model="uri.type"
                  class="w-0 px-2"
                  :items="GatewayURITypesOptions"
                  label="Type"
                  hide-details="auto"
                />
                <v-text-field
                  v-model="uri.address"
                  class="w-auto px-2"
                  label="Address"
                  hint="The address of the gateway"
                  hide-details="auto"
                />
                <v-btn
                  class="px-2"
                  variant="tonal"
                  icon="mdi-trash-can"
                  @click="uris.splice(index, 1)"
                />
              </v-container>
            </template>
            <v-btn
              color="secondary"
              prepend-icon="mdi-plus"
              @click="uris.push({ type: 'api', address: '' })"
            >
              Add Address
            </v-btn>
          </v-window-item>

          <v-window-item value="api_key">
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
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-form>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="tonal"
        @click="cancel()"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="tonal"
        @click="saveAndConnect()"
      >
        Save and connect
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
