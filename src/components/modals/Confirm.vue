<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const confirmBgTransparent = ref(true)
const confirmModalTransparent = ref(true)

const close = (confirmed = false) => {
  if (confirmed)
    layoutStore.confirm.confirmedCallback()
  else
    layoutStore.confirm.declinedCallback()
  confirmModalTransparent.value = true
  setTimeout(() => {
    confirmBgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.confirm.close()
  }, 400)
}
const confirmModal = ref(null)
onClickOutside(confirmModal, () => close())

onMounted(() => {
  setTimeout(() => {
    confirmBgTransparent.value = false
  }, 1)
  setTimeout(() => {
    confirmModalTransparent.value = false
  }, 200)
})

</script>

<template>
  <div class="modal-container" :class=" {'transparent': confirmBgTransparent}">
    <div ref="confirmModal" class="modal" :class=" {'transparent': confirmModalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          Подтверждение
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close()" />
      </div>
      <div>{{ layoutStore.confirm.message }}</div>
      <div class="flex gap-1em">
        <button class="btn danger" @click="close(true)">
          Подтвердить
        </button>
        <button class="btn secondary" @click="close(false)">
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-container {
    z-index: 9000;
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
