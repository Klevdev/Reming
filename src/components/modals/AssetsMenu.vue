<script lang="ts" setup>
import request from '~/composables/request'
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const assetMenuBgTransparent = ref(true)
const assetMenuModalTransparent = ref(true)

const close = () => {
  assetMenuModalTransparent.value = true
  setTimeout(() => {
    assetMenuBgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.assetsMenu.close()
  }, 400)
}
const assetsMenuModal = ref(null)
onClickOutside(assetsMenuModal, () => close())

onMounted(() => {
  setTimeout(() => {
    assetMenuBgTransparent.value = false
  }, 1)
  setTimeout(() => {
    assetMenuModalTransparent.value = false
  }, 200)
})

const upload = () => {
  layoutStore.assetUpload.open()
  close()
}

const assets = ref([])

onMounted(async() => {
  const { data, error } = await request.get('/user/assets')

  if (error)
    layoutStore.assetsMenu.close()
  else
    assets.value = data
})

</script>

<template>
  <div class="modal-container" :class=" {'transparent': assetMenuBgTransparent}">
    <div ref="assetsMenuModal" class="modal" :class=" {'transparent': assetMenuModalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          Мои вложения
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close()" />
      </div>
      <div class="flex gap-1em flex-wrap">
        <div v-for="asset in assets" :key="asset._id" class="asset" @click="layoutStore.assetsMenu.assetRef.value = asset">
          <img :src="`http://localhost:3001/${asset.file}`" alt="Вложение">
          {{ asset.title }}
        </div>
        <div class="asset" @click="upload">
          <div i="carbon-add" class="text-2em" title="Загрузить" />
        <!-- <div class="text-.8em">
          Загрузить
        </div> -->
        </div>
      </div>
      <!-- <div class="flex gap-1em">
        <button class="btn" @click="close(true)">
          Подвердить
        </button>
        <button class="btn secondary" @click="close(false)">
          Отмена
        </button>
      </div> -->
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
    max-width: 690px;
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

  .asset {
    @apply rounded;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border: 2px solid var(--border-input);
    transition: border .2s ease-in-out;
  }

  .asset:hover,
  .asset:active {
    cursor: pointer;
    border: 2px solid var(--primary-active);
  }

  .asset > img {
    object-fit: contain;
    height: 120px;
  }
</style>
