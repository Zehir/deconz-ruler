<script setup lang="ts">
const drawer = ref(false)
const items = ref([
  { text: 'Home', icon: 'mdi-home', to: '/' },
  { text: 'Gateways', icon: 'mdi-router-wireless', to: '/gateway' },
])
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
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
      >
        <v-list-item-avatar>
          <v-icon :icon="item.icon" />
        </v-list-item-avatar>

        <v-list-item-title>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar app prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />

    <v-toolbar-title>My files</v-toolbar-title>

    <v-spacer />

    <v-btn variant="text" icon="mdi-magnify" />

    <v-btn variant="text" icon="mdi-filter" />

    <v-btn variant="text" icon="mdi-dots-vertical" />
    <!-- -->
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>
    <!-- Provides the application the proper gutter -->
    <router-view />
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</template>
