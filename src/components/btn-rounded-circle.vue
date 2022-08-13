<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-btn
      block
      height="48"
      width="48"
      variant="outlined"
      :rounded="isHovering ? 'rounded-xl' : 'circle'"
      v-bind="props"
    >
      <slot />
    </v-btn>
  </v-hover>
</template>

<style scoped>
  .v-btn{
    transition: all 0.1s ease-in-out;
    /* https://github.com/vuetifyjs/vuetify/issues/15626 */
    will-change: transform;
  }
</style>
