<script setup lang="ts">

import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

useHead({
  title: t('pages.index.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

const asset = reactive({
  title: '',
})

</script>

<template>
  <main>
    <button @click="layoutStore.assetsMenu.open(asset)">
      assetsMenu
    </button>
    <div>{{ asset }}</div>
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
