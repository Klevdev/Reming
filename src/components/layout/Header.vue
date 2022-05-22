<script setup lang="ts">
import { useLayoutStore } from '~/stores/layout'
const { t } = useI18n()
const layoutStore = useLayoutStore()

</script>

<template>
  <header>
    <button class="w-60px h-60px icon-btn !outline-none" :title="t('layout.toggle_sidebar')" @click="layoutStore.toggleSidebar">
      <div class="mx-auto" i="carbon-menu" />
    </button>
    <span id="logo" class="font-serif"><router-link to="/">Reming</router-link></span>
    <div class="ml-a">
      <UserPanel />
    </div>
  </header>
</template>

<style scoped>
  #logo {
    margin-left: 3vw;
    font-weight: bold;
    font-size: 1.7em;
  }

  header {
    z-index: 10;
    user-select: none;
    display: flex;
    align-items: center;
    height: 60px;
    gap: 3vw;
    background-color: var(--bg);
  }

  header > button {
    display: none;
  }

  @media only screen and (min-width: 600px) {
    #logo {
    margin-left: 0;
    }
    header > button {
      display: block;
    }
    #userPanel {
    padding-right: 2em;
      width: 300px;
    }
  }

</style>
