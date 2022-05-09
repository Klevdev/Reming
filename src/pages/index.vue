<script setup lang="ts">
import request from '~/composables/request'

</script>

<template>
  <button class="btn" @click="request.get('/test')">
    Test
  </button>
</template>

<route lang="yaml">
meta:
  title: Home
  layout: default
</route>
