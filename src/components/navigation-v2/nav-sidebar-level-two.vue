<script setup lang="ts">
const route = useRoute()

const drawer = computed(() => route.meta.hideLevelTwoSidebar !== true)
</script>

<template>
  <div>
    <v-navigation-drawer v-model="drawer" width="240" permanent>
      <portal-target name="nav-sidebar-level-two" multiple />
      <v-list id="#nav-level-two-list">
        <portal-target name="nav-sidebar-level-two-list" multiple />
        <!--
        <v-list-item>
          <v-list-item-title># Settings</v-list-item-title>
        </v-list-item>
        -->
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
