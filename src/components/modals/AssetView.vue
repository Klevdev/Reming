<script lang="ts" setup>
import request from '~/composables/request'
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const assetViewBgTransparent = ref(true)
const assetViewModalTransparent = ref(true)

const close = () => {
  assetViewModalTransparent.value = true
  setTimeout(() => {
    assetViewBgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.assetView.close()
  }, 400)
}
const assetViewModal = ref(null)
onClickOutside(assetViewModal, () => close())

onMounted(() => {
  setTimeout(() => {
    assetViewBgTransparent.value = false
  }, 1)
  setTimeout(() => {
    assetViewModalTransparent.value = false
  }, 200)
})

const asset = ref({})

onMounted(async() => {
  const { data, error } = await request.get(`/user/assets/${layoutStore.assetView.assetId}`)

  if (error)
    close()
  else
    asset.value = data
})

</script>

<template>
  <div class="modal-container" :class=" {'transparent': assetViewBgTransparent}">
    <div ref="assetViewModal" class="modal" :class=" {'transparent': assetViewModalTransparent}">
      <div class="flex flex-row-reverse justify-between items-center">
        <!-- <h3 class="font-bold">
          {{ asset.title }}
        </h3> -->
        <button class="icon-btn" i="carbon-close" @click="close()" />
      </div>
      <img :src="`http://localhost:3001/${asset.file}`" alt="Вложение">
    </div>
  </div>
</template>

<style scoped>
  .modal-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    background-color: #00000055;
    display: grid;
    place-items: center;
    transition: background-color .2s ease-in-out;
  }

  .modal-container.transparent {
    background-color: #00000000;
  }
  .modal.transparent {
    opacity: 0;
  }

  .modal {
    @apply rounded;
    width: max-content;
    max-width: 90vw;
    height: max-content;
    padding: 1em;
    background-color: var(--bg);
    display: flex;
    gap: 1em;
    flex-direction: column;
    justify-content: space-between;
    opacity: 1;
    transition: opacity .2s ease-in-out;
  }

</style>
