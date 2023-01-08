<template>
  <v-layout>
    <nav-topbar-global />
    <nav-sidebar-gateways-list />
    <nav-sidebar-gateways-details />
    <nav-topbar-details />
    <nav-sidebar-items-details />
    <perfect-scrollbar>
      <v-main>
        <router-view />
      </v-main>
    </perfect-scrollbar>
  </v-layout>
</template>
