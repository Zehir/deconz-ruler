<script setup lang="ts">
import type { GatewayCredentials } from '~/interfaces/deconz'

const props = withDefaults(defineProps<{
  credential: GatewayCredentials
}>(), {})

const step = ref(1)
</script>

<template>
  <v-card
    class="ma-4 d-flex flex-column"
    variant="tonal"
    prepend-icon="mdi-sticker-emoji"
    width="400"
    height="400"
    :title="credential.name"
    :subtitle="credential.id"
  >
    <v-window v-model="step" class="mb-auto">
      <v-window-item :value="1">
        <v-card-text>
          <v-list lines="one">
            <v-list-item
              v-for="item, index in credential.URIs"
              :key="index"
              variant="text"
              :title="item.address"
            />
          </v-list>
          <span class="text-caption text-grey-darken-1">
            This is the email you will use to login to your Vuetify account
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
            label="Password"
            type="password"
          />
          <v-text-field
            label="Confirm Password"
            type="password"
          />
          <span class="text-caption text-grey-darken-1">
            Please enter a password for your account
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <v-card-text>
          Coucou
        </v-card-text>
      </v-window-item>
    </v-window>

    <v-divider />

    <v-card-actions class="flex-align-end">
      <v-btn
        v-if="step > 1"
        variant="text"
        @click="step--"
      >
        Back
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="step < 3"
        color="primary"
        variant="flat"
        @click="step++"
      >
        Next
      </v-btn>
    </v-card-actions>
  </v-card>

  <!--
  <v-card
    variant="tonal"
    prepend-icon="mdi-sticker-emoji"
    width="350"
    height="350"
    :title="credential.name"
    :subtitle="credential.id"
    class="ma-4 pa-4"
  >
    <v-window
      show-arrows="hover"
    >
      <v-window-item>
        <v-card-text>
          <v-list lines="one">
            <v-list-item
              v-for="item, index in credential.URIs"
              :key="index"
              variant="text"
              :title="item.address"
            />
          </v-list>
        </v-card-text>
      </v-window-item>
      <v-window-item>
        Coucou
      </v-window-item>
    </v-window>
  </v-card>
  -->
</template>
