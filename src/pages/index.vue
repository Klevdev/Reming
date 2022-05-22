<script setup lang="ts">
import request from '~/composables/request'

const val = ref('')
const props = {
  type: 'text',
  label: 'test',
  placeholder: 'afsfsfg',
}

</script>

<template>
  <main>
    <Input v-model="val" :props="props" />
    {{ val }}
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
