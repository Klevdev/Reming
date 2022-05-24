<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const { sidebarCollapsed } = storeToRefs(layoutStore)

// const toggleLocales = () => {
//   // change to some real logic
//   const locales = availableLocales
//   locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
// }
</script>
<template>
  <aside :class="sidebarCollapsed && 'collapsed'">
    <nav>
      <router-link class="menu-item" to="">
        <div i-carbon-home /><span v-show="!sidebarCollapsed">{{ t('layout.menu.main') }}</span>
      </router-link>
      <router-link class="menu-item" to="/library">
        <div i-carbon-book /><span v-show="!sidebarCollapsed">{{ t('layout.menu.library') }}</span>
      </router-link>
      <router-link class="menu-item" to="/my-materials">
        <div i-carbon-folder /><span v-show="!sidebarCollapsed">{{ t('layout.menu.my-materials') }}</span>
      </router-link>
      <router-link class="menu-item" to="">
        <div i-carbon-calendar /><span v-show="!sidebarCollapsed">{{ t('layout.menu.calendar') }}</span>
      </router-link>
      <router-link class="menu-item" to="">
        <div i-carbon-dashboard /><span v-show="!sidebarCollapsed">{{ t('layout.menu.stats') }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
  aside {
    user-select: none;
    display: none;
  }

  .menu-item {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1em;
    padding-left: 19px;
  }

  .menu-item:hover,
  .menu-item:active {
    cursor: pointer;
    background-color: var(--primary);
    transition: all .2s ease-in-out;
  }

  @media only screen and (min-width: 600px) {
    aside {
      display: block;
      width: 260px;
      background-color: var(--bg);
      height: 100%;
    }
    aside.collapsed {
      width: 60px;
    }
    .collapsed .menu-item {
      justify-content: center;
      padding-left: 0;
    }
  }

</style>
