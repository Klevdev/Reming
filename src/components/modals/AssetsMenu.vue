<script lang="ts" setup>
import request from '~/composables/request'
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const assetMenuBgTransparent = ref(true)
const assetMenuModalTransparent = ref(true)

const close = (saveAsset = true) => {
  if (!saveAsset)
    layoutStore.assetsMenu.assetRef.value = {}

  assetMenuModalTransparent.value = true
  setTimeout(() => {
    assetMenuBgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.assetsMenu.close()
  }, 400)
}
const assetsMenuModal = ref(null)
// onClickOutside(assetsMenuModal, () => close())

onMounted(() => {
  setTimeout(() => {
    assetMenuBgTransparent.value = false
  }, 1)
  setTimeout(() => {
    assetMenuModalTransparent.value = false
  }, 200)
})

const selectedAsset = ref({})

const selectAsset = (asset) => {
  selectedAsset.value = asset
  layoutStore.assetsMenu.assetRef.value = asset
}

const deselectAsset = () => {
  selectedAsset.value = {}
  layoutStore.assetsMenu.assetRef.value = {}
}

const upload = () => {
  layoutStore.assetUpload.open()
  close(false)
}

const deleteAsset = (assetId, assetTitle) => {
  layoutStore.confirm.open(`Подтвердите что хотите удалить вложение "${assetTitle}"`, async() => {
    const { data, error } = await request.delete(`/user/assets?assetId=${assetId}`)
  })
}

const viewAsset = (assetId) => {
  layoutStore.assetView.open(assetId)
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
        <button class="icon-btn" i="carbon-close" @click="close(false)" />
      </div>
      <div class="flex gap-1em flex-wrap">
        <div v-for="asset in assets" :key="asset._id" class="asset" :class="{'selected' : selectedAsset._id === asset._id}" @click="selectedAsset._id === asset._id ? deselectAsset() : selectAsset(asset)">
          <div class="asset-actions">
            <button class="btn danger" i="carbon-trash-can" title="Удалить" @click="deleteAsset(asset._id, asset.title)" />
            <button class="btn" i="carbon-view" title="Просмотреть" @click="viewAsset(asset._id)" />
          </div>
          <img :src="`http://localhost:3001/${asset.file}`" alt="Вложение">
          {{ asset.title }}
        </div>
        <div class="asset" @click="upload">
          <div i="carbon-add" class="text-2em" title="Загрузить" />
        </div>
      </div>
      <button class="btn w-max" :disabled="!selectedAsset._id" @click="close">
        Прикрепить
      </button>
    </div>
  </div>
</template>

<style scoped>
  .modal-container {
    padding: 60px 0;
    overflow-y: scroll;
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
    max-width: 360px;
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
    position: relative;
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
  .asset:active,
  .asset.selected {
    cursor: pointer;
    border: 2px solid var(--primary-active);
  }

  .asset-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: #00000055;
    width: 100%;
    padding: 10px 0;
    position: absolute;
    top: 0;
  }

  @media only screen and (min-width: 600px) {
    .modal {
      max-width: 520px;
    }
  }
  @media only screen and (min-width: 1200px) {
    .modal {
      max-width: 690px;
    }
    .asset-actions {
      opacity: 0;
    padding: 5px 0;
      display: none;
      transition: opacity 2s ease-in-out;
    }
    .asset:hover > .asset-actions {
      opacity: 1;
      display: flex;
    }
  }

  .asset > img {
    object-fit: contain;
    height: 120px;
  }
</style>
