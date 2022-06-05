<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const close = () => {
  modalTransparent.value = true
  setTimeout(() => {
    bgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.confirm.close()
  }, 400)
}
const confirmModal = ref(null)
onClickOutside(confirmModal, () => close())

const bgTransparent = ref(true)
const modalTransparent = ref(true)

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
  <div class="modal-bg" :class=" {'transparent': bgTransparent}">
    <div ref="confirmModal" class="modal" :class=" {'transparent': modalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          Подтверждение
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close()" />
      </div>
      <div>{{ layoutStore.confirm.message }}</div>
      <div class="flex gap-1em">
        <button class="btn" @click="layoutStore.confirm.confirmedCallback; close()">
          Да
        </button>
        <button class="btn secondary" @click="layoutStore.confirm.declinedCallback; close()">
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-bg {
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

  .modal-bg.transparent {
    background-color: #00000000;
  }
  .modal.transparent {
    opacity: 0;
  }

  .modal {
    @apply rounded;
    width: 300px;
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
