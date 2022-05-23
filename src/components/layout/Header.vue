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
    <div id="logo" class="font-serif">
      <router-link to="/">
        Reming
      </router-link>
    </div>
    <div class="ml-a">
      <UserPanel />
    </div>
  </header>
</template>

<style scoped>
  #logo {
    margin-left: 1rem;
    font-weight: bold;
    font-size: 1.7em;
  }

  header {
    z-index: 10;
    user-select: none;
    display: flex;
    align-items: center;
    height: 60px;
    background-color: var(--bg);
  }

  header > button {
    display: none;
  }

  @media only screen and (min-width: 600px) {
    #logo {
      margin-left: 2.8rem;
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
