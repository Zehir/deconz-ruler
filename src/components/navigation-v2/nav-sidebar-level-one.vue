<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'

const GatewaysStore = useGatewaysStore()

const list = ref()

/*
onMounted(() => {
  console.log('Mouted', list)
})
*/
</script>

<template>
  <v-navigation-drawer width="72" permanent>
    <VList id="#nav-level-one-list" ref="list" nav class="d-flex flex-column pa-0" height="100%">
      <v-list-item class="ma-1 justify-center">
        <btn-rounded-circle to="/">
          <v-icon icon="mdi-home" size="x-large" />
          <v-tooltip location="right" activator="parent">
            Home
          </v-tooltip>
        </btn-rounded-circle>
      </v-list-item>
      <perfect-scrollbar>
        <template v-for="item in GatewaysStore.credentials" :key="item.id">
          <gateway-badge :credentials="GatewaysStore.credentials[item.id]" />
        </template>
        <v-list-item class="ma-1 justify-center">
          <btn-rounded-circle to="/sandbox">
            <v-icon icon="mdi-shovel" size="x-large" />
            <v-tooltip location="right" activator="parent">
              Sandbox
            </v-tooltip>
          </btn-rounded-circle>
        </v-list-item>
        <v-divider />
        <!--
        <v-list-item class="ma-1 justify-center">
          <dialog-add-gateway>
            <template #btn="{ props: btnProps }">
              <btn-rounded-circle v-bind="{ ...btnProps }">
                <v-icon icon="mdi-plus" size="x-large" />
                <v-tooltip location="right" activator="parent">
                  Add Gateway
                </v-tooltip>
              </btn-rounded-circle>
            </template>
          </dialog-add-gateway>
        </v-list-item>
        -->
        <v-list-item class="ma-1 justify-center">
          <btn-rounded-circle to="/gateway">
            <v-icon icon="mdi-compass" size="x-large" />
            <v-tooltip location="right" activator="parent">
              Gateways
            </v-tooltip>
          </btn-rounded-circle>
        </v-list-item>
      </perfect-scrollbar>
    </VList>
  </v-navigation-drawer>
</template>

