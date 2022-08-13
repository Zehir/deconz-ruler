<template>
  <client-only>
    <v-layout>
      <nav-topbar-global />
      <nav-sidebar-gateways-list />
      <nav-sidebar-gateways-details />
      <nav-topbar-details />
      <nav-sidebar-items-details />
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </client-only>
</template>
