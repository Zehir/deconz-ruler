<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/app'

const { showSidebar } = storeToRefs(useAppStore())
</script>

<template>
  <v-app-bar app prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="showSidebar = !showSidebar" />

    <v-toolbar-title>Deconz-Ruler</v-toolbar-title>

    <v-spacer />

    <v-btn variant="text" icon="mdi-magnify" />

    <v-btn variant="text" icon="mdi-filter" />

    <v-btn variant="text" icon="mdi-dots-vertical" />
    <!-- -->
  </v-app-bar>
</template>
