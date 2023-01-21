<script setup lang="ts">
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useGatewaysStore } from '~/stores/gateways'
import { useGatewayScanner } from '~/composables/gateway-scanner'
import type { Config, GatewayCredentials } from '~/interfaces/deconz'
import { errorMessages } from '~/utils/misc'

const props = withDefaults(defineProps<{
  initialState?: GatewayCredentials
}>(), {
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const GatewaysStore = useGatewaysStore()
const Scanner = useGatewayScanner()

const error = ref('')
const state = reactive<{
  address: string
  config: Config | undefined
  loading: boolean
}>({
  address: '',
  config: undefined,
  loading: false,
})

const rules = {
  address: {
    required,
    mustStartWithHttp: helpers.withMessage('Value must start with http:// or http://',
      (value: string) => value.startsWith('http://') || value.startsWith('https://'),
    ),
  },
}

const v = useVuelidate(rules, state)

const credentials = computed<GatewayCredentials | undefined>(() => {
  if (!state.config)
    return
  return {
    id: state.config.bridgeid,
    name: state.config.name,
    apiKey: '',
    URIs: [
      { type: 'api', address: state.address },
    ],
  }
})

const reset = () => {
  state.config = undefined
}

const find = async () => {
  reset()

  if (!await v.value.$validate())
    return

  const address = state.address
  state.loading = true
  const result = await Scanner.findGatewayAt(address)
  if (result)
    state.config = result
  state.loading = false
}

const isOpen = ref(false)

const close = () => {
  isOpen.value = false
  reset()
  emit('close')
}
</script>

<template>
  <v-dialog v-model="isOpen" width="500">
    <template #activator="{ props: btnProps }">
      <slot name="btn" v-bind="{ props: btnProps }">
        <v-btn v-bind="{ ...btnProps, ...$attrs }">
          <slot>
            Add
          </slot>
        </v-btn>
      </slot>
    </template>

    <v-card>
      <template #title>
        <div class="d-flex flex-row pa-1">
          <span class="me-auto">Find gateway</span>
          <v-btn icon="mdi-close" @click="close()" />
        </div>
      </template>
      <v-form @submit.prevent="find">
        <v-card-text class="overflow-y-auto">
          <v-row dense>
            <!-- Errors display -->
            <v-col v-show="error.length > 0" :cols="12">
              <v-alert type="error">
                {{ error }}
              </v-alert>
            </v-col>

            <v-col :cols="12">
              <v-text-field
                v-model="state.address"
                label="Address"
                append-icon="mdi-magnify"
                required
                :loading="state.loading"
                :error-messages="errorMessages(v.address.$errors)"
                @click:append="find"
                @input="v.address.$touch()"
                @blur="v.address.$touch()"
              />
            </v-col>

            <v-col :cols="12">
              <card-gateway
                v-if="state.config && credentials"
                :credentials="credentials"
                :config="state.config"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
