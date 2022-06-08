<script setup lang="ts">

import { useUserStore } from '~/stores/user'
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

onBeforeMount(() => {
  if (!useUserStore().loggedIn) {
    useLayoutStore().popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    useRouter().go(-1)
  }
})
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
    <button class="btn" @click="layoutStore.popup.show({message: 'Текст всплывающего оповещения', type: 'info'})">
      Popup
    </button>
  </main>
</template>

<route lang="yaml">
meta:
  name: index
  layout: default
</route>
