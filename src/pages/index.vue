<script setup lang="ts">
import request from '~/composables/request'

</script>

<template>
  <main>
    <button class="btn" @click="request.get('/test')">
      Test
    </button>
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
