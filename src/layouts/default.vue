<template>
  <!-- Navigation -->
  <nav-sidebar />
  <nav-topbar />
  <!-- Sizes your content based upon application components -->
  <v-main>
    <breadcrumbs />
    <!-- Provides the application the proper gutter -->
    <router-view />
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</template>
