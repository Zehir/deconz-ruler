<script setup lang="ts">
import { useGatewaysStore } from '~/stores/gateways'

const gateway = useGatewaysStore()

const { currentGatewayID, gateways } = gateway

const { t } = useI18n()
</script>

<template>
  <div>
    <p>Gateway Discovery</p>
    <p>
      {{ currentGatewayID }}
      {{ gateways }}
    </p>
  </div>
</template>
