<script setup lang="ts">
import type { GatewayCredentials } from '~/interfaces/deconz'

const localProps = defineProps<{
  modelValue: GatewayCredentials
}>()

const active = ref(true)
const over = ref(true)
</script>

<template>
  <v-list-item class="ma-1 justify-center">
    <v-hover v-slot="{ isHovering, props }">
      <v-btn
        block
        height="48"
        width="48"
        variant="outlined"
        :rounded="isHovering ? 'rounded-xl' : 'circle'"
        v-bind="props"
      >
        {{ localProps.modelValue.name.substring(0, 1) }}
      </v-btn>
    </v-hover>
  </v-list-item>

  <v-list-item class="ma-1 justify-center">
    <v-hover v-slot="{ isHovering, props }">
      <v-btn
        block
        height="48"
        width="48"
        variant="outlined"
        :rounded="isHovering ? 'rounded-xl' : 'circle'"
        v-bind="props"
      >
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-hover>
  </v-list-item>
</template>

<style scoped>
  .v-btn{
    transition: all 0.1s ease-in-out;
    /* https://github.com/vuetifyjs/vuetify/issues/15626 */
    will-change: transform;
  }
</style>
