<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const bgTransparent = ref(true)
const modalTransparent = ref(true)

const close = (cancel = false) => {
  if (cancel)
    layoutStore.inputModal.inputValue.value = ''
  modalTransparent.value = true
  setTimeout(() => {
    bgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.inputModal.close()
  }, 400)
}

const inputModal = ref(null)
onClickOutside(inputModal, () => close(true))

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
    <div ref="inputModal" class="modal" :class=" {'transparent': modalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          {{ layoutStore.inputModal.message }}
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close(true)" />
      </div>
      <input v-model="layoutStore.inputModal.inputValue.value" type="text">
      <div class="flex gap-1em">
        <button class="btn" :disabled="layoutStore.inputModal.inputValue.value?.length < 1" @click="close()">
          Подтвердить
        </button>
        <button class="btn secondary" @click="close(true)">
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
  input {
    @apply rounded;
    outline: none;
    padding: .25em;
    width: 300px;
    background: var(--bg-back);
    border: 2px solid var(--border-input);
    transition: border .2s ease-in-out;
  }

  input:focus,
  input:active {
    border: 2px solid var(--primary-active)
  }
  input:hover {
    border: 2px solid var(--primary)
  }

@media only screen and (min-width: 600px) {
  input {
    width: 300px;
  }
}
</style>
