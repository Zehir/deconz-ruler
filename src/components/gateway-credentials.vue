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
      <div>
        {{ credentials.name }}
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
      </div>
      <div class="float-right">
        <v-spacer />

        <v-btn @click.stop="deleteSelf">
          Delete
        </v-btn>
      </div>
    </v-card-title>
    <v-card-subtitle>{{ credentials.id }}</v-card-subtitle>
    <v-card-text>
      Coucou
    </v-card-text>
  </v-card>
</template>
