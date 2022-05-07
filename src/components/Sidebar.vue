<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

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
      <ul>
        <li class="menu-item">
          <router-link to="">
            1
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="">
            2
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="">
            3
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="">
            4
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
  aside {
    display: none;
  }
  @media only screen and (min-width: 600px) {
    aside {
      display: block;
      width: 250px;
      background-color: #FAFAFA;
      height: 100%;
    }
    .collapsed {
      width: 60px;
    }
    .collapsed .menu-item {
      font-style: italic;
    }
  }
  .dark aside {
      background-color: #444;
  }

</style>
