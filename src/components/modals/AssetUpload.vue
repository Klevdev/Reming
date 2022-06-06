<script lang="ts" setup>
import request from '~/composables/request'
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const bgTransparent = ref(true)
const modalTransparent = ref(true)

const close = () => {
  modalTransparent.value = true
  setTimeout(() => {
    bgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.assetUpload.close()
    layoutStore.assetsMenu.open()
  }, 400)
}

const upload = async() => {
  const form = document.getElementById('uploadForm') || undefined
  const formData = new FormData(form)

  const { data, error } = await request.patch('/user/assets', formData)

  if (!error)
    close()
}

const assetUpload = ref(null)
onClickOutside(assetUpload, () => close())

onMounted(() => {
  setTimeout(() => {
    bgTransparent.value = false
  }, 1)
  setTimeout(() => {
    modalTransparent.value = false
  }, 200)
})

</script>

<template>
  <div class="modal-container" :class=" {'transparent': bgTransparent}">
    <div ref="assetUpload" class="modal" :class=" {'transparent': modalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          Новое вложение
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close" />
      </div>
      <form id="uploadForm" class="flex flex-col gap-.5em">
        <label>
          <div>Название вложения</div>
          <input type="text" name="title">
        </label>
        <input type="hidden" name="type" value="image">
        <label>
          <div>Файл</div>
          <input type="file" name="file">
        </label>
      </form>
      <div class="flex gap-1em">
        <button class="btn" @click="upload">
          Добавить
        </button>
        <button class="btn secondary" @click="close">
          Отмена
        </button>
      </div>
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
  input:not([type="file"]) {
    @apply rounded;
    outline: none;
    padding: .25em;
    width: 300px;
    background: var(--bg-back);
    border: 2px solid var(--border-input);
    transition: border .2s ease-in-out;
  }

  input:not([type="file"]):focus,
  input:not([type="file"]):active {
    border: 2px solid var(--primary-active)
  }
  input:not([type="file"]):hover {
    border: 2px solid var(--primary)
  }

@media only screen and (min-width: 600px) {
  input {
    width: 300px;
  }
}
</style>
