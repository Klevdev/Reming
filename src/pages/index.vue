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

const asset = ref({})
const value = ref({})

</script>

<template>
  <main>
    <button class="btn" @click="layoutStore.assetsMenu.open(asset)">
      assetsMenu
    </button>
    <div>{{ asset }}</div>
    <button class="btn" @click="layoutStore.inputModal.open('Введите значение', value)">
      inputModal
    </button>
    <div>{{ value.value }}</div>
    <button class="btn" @click="layoutStore.assetUpload.open()">
      AssetUpload
    </button>
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
