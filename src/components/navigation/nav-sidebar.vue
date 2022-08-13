<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

const { showSidebar } = storeToRefs(useAppStore())

const items = ref([
  { text: 'Home', icon: 'mdi-home', to: '/' },
  { text: 'Gateways', icon: 'mdi-router-wireless', to: '/gateway' },
])
</script>

<template>
  <v-navigation-drawer
    v-model="showSidebar"
    bottom
    temporary
  >
    <v-list
      nav
      dense
    >
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        active-color="primary"
        :to="item.to"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
