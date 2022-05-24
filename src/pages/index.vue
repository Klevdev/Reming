<script setup lang="ts">

const { t } = useI18n()

useHead({
  title: t('pages.index.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

</script>

<template>
  <main />
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
