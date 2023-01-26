<script setup lang="ts">
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useGatewaysStore } from '~/stores/gateways'
import type { GatewayCredentials } from '~/interfaces/deconz'
import { errorMessages } from '~/utils/misc'

const props = withDefaults(defineProps<{
  credentials: GatewayCredentials
}>(), {})

const GatewaysStore = useGatewaysStore()

const error = ref('')
const { cloned: state } = useCloned(props.credentials, { clone: klonaJson })

const rules = {
  name: {
    required,
  },
  apiKey: {
    required,
  },
}

const v = useVuelidate(rules, state)

const save = () => {
  GatewaysStore.activeCredential = klonaJson(state.value)
}
</script>

<template>
  Current
  <json-viewer :value="state" :expand-depth="4" />
  <v-card>
    <template #title>
      <span>{{ props.credentials.name }}</span>
    </template>
    <template v-if="props.credentials" #subtitle>
      <span>{{ props.credentials.id }}</span>
    </template>
    <v-form @submit.prevent="save">
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
              v-model="state.name"
              label="Name"
              required
              readonly
              :error-messages="errorMessages(v.name.$errors)"
              @input="v.name.$touch()"
              @blur="v.name.$touch()"
            />
          </v-col>

          <v-col :cols="12">
            <v-text-field
              v-model="state.apiKey"
              label="API Key"
              required
              :error-messages="errorMessages(v.apiKey.$errors)"
              @input="v.apiKey.$touch()"
              @blur="v.apiKey.$touch()"
            />
          </v-col>

          <v-col :cols="12">
            <v-list>
              <template v-for="uriType in objectKeys(state.URIs)" :key="uriType">
                <v-list-subheader>{{ uriType }}</v-list-subheader>

                <v-list-item
                  v-for="address, index of state.URIs[uriType]" :key="index"
                  :value="address"
                  :title="address"
                >
                <!--
                  <template #append>
                    <v-icon icon="mdi-close" />
                  </template>
                  -->
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-btn type="submit" color="success">
            Save
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-form>
  </v-card>
</template>
