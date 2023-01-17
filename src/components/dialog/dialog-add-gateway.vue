<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'
import { useGatewayScanner } from '~/composables/gateway-scanner'

/*
const props = defineProps<{
}>()
*/

const emit = defineEmits<{
  (e: 'close'): void
}>()
const GatewaysStore = useGatewaysStore()
const Scanner = useGatewayScanner()

const error = ref('')
const state = reactive({
})

const create = async () => {

}

const isOpen = ref(false)

const close = () => {
  isOpen.value = false
  emit('close')
}
</script>

<template>
  <v-dialog v-model="isOpen">
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
      <v-card-title>
        Add gateway
      </v-card-title>
      <v-form @submit.prevent="create">
        <v-card-text class="overflow-y-auto">
          <v-row dense>
            <!-- Errors display -->
            <v-col v-show="error.length > 0" :cols="12">
              <v-alert type="error">
                {{ error }}
              </v-alert>
            </v-col>

            <v-col :cols="12">
              <p v-if="Scanner.logs.value.length > 0">
                {{ Scanner.logs }}
              </p>
            </v-col>

            <!-- Debug -->
            <v-col :cols="12">
              <json-viewer :value="GatewaysStore.credentials" :expand-depth="1" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="success">
            Créer
          </v-btn>
          <v-btn color="warning" @click="close()">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
