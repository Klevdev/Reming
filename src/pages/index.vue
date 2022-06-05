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

const message = ref('')

const sayHi = () => {
  message.value = 'Hi'
}

const sayBye = () => {
  message.value = 'Bye'
}

</script>

<template>
  <main>
    <button @click="layoutStore.confirm.open('Test', sayHi, sayBye)">
      show
    </button>
    <div>{{ message }}</div>
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
