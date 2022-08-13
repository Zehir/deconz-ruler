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
  <v-navigation-drawer width="240" color="grey-darken-1" permanent>
    <v-list>
      <v-list-item title="Home" value="home" />
      <v-list-item title="Contacts" value="contacts" />
      <v-list-item title="Settings" value="settings" />
    </v-list>
  </v-navigation-drawer>
</template>
