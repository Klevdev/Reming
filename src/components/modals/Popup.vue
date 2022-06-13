<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

const popupTransparent = ref(true)

const close = () => {
  popupTransparent.value = true
  setTimeout(() => {
    layoutStore.popup.close()
  }, 200)
}

onMounted(() => {
  setTimeout(() => {
    popupTransparent.value = false
  }, 1)
  layoutStore.popup.closeTO = setTimeout(() => {
    close()
  }, 5 * 1000)
})

// const icon = () => {
//   if (layoutStore.popup.type === 'error')
//     return 'carbon-misuse-alt'
//   if (layoutStore.popup.type === 'success')
//     return 'carbon-checkmark-outline'
//   if (layoutStore.popup.type === 'info')
//     return 'carbon-information'
// }

const color = () => {
  if (layoutStore.popup.type === 'error')
    return 'bg-red'
  if (layoutStore.popup.type === 'success')
    return 'bg-green'
  if (layoutStore.popup.type === 'info')
    return 'bg-lightblue'
}

</script>

<template>
  <div class="popup" :class=" {'transparent': popupTransparent}">
    <div class="flex justify-between items-center gap-1em p-1em">
      <div class="text-1.2em" :i="layoutStore.popup.type === 'error' ? 'carbon-misuse-alt' : (layoutStore.popup.type === 'success' ? 'carbon-checkmark-outline' : 'carbon-information')" :class="color()" />
      <div class=" w-100% max-w-100%">
        {{ layoutStore.popup.message }}
      </div>
      <button class="icon-btn text-1.2em" i="carbon-close" @click="close()" />
    </div>
    <div class="popup-timer absolute bottom-0 w-100% h-2px" :class="color()" />
  </div>
</template>

<style scoped>
  .popup {
    z-index: 999;
    @apply rounded drop-shadow-lg;
    position: absolute;
    top: calc(60px + 1em);
    left: 5%;
    width: 90%;
    height: max-content;
    background-color: var(--bg);
    opacity: 1;
    transition: opacity .2s ease-in-out, top .2s ease-in-out;
  }
  .popup.transparent {
    top: -100px;
    opacity: 0;
  }

  @media only screen and (min-width: 600px) {
    .popup {
      width: 350px;
      left: calc(50% - 175px)
    }
  }

  @keyframes shrink {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }

  .popup-timer {
    animation: shrink 5s linear forwards;
  }

</style>
