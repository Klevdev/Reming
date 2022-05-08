<script setup lang="ts">
import { storeToRefs } from 'pinia'
// import { ref } from 'vue'
import { toggleDark } from '~/composables'
import { useLayoutStore } from '~/stores/layout'
import { useUserStore } from '~/stores/user'
const { t, availableLocales, locale } = useI18n()

const layoutStore = useLayoutStore()
const { userPanelCollapsed } = storeToRefs(layoutStore)
const user = useUserStore()
const { userLoggedIn, userName, userPicture } = storeToRefs(user)
// const { toggleUserPanel, toggleSidebar } = mapActions(useLayoutStore, ['toggleUserPanel', 'toggleSidebar'])

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <header>
    <button class="w-60px h-60px icon-btn !outline-none" :title="t('layout.toggle_sidebar')" @click="layoutStore.toggleSidebar">
      <div class="mx-auto" i="carbon-menu" />
    </button>
    <span id="logo">Reming</span>
    <div id="userPanel" @click="layoutStore.toggleUserPanel">
      <div v-if="userPanelCollapsed">
        <div v-if="userLoggedIn" class="flex flex-row items-center gap-5px">
          <router-link to="/profile">
            {{ userName }}
          </router-link>
          <img v-if="userPicture" id="userPicture" :src="`http://localhost:3001/${userPicture}'}`" alt="userPicture">
          <div v-else i="carbon-user-avatar-filled-alt" />
        </div>
        <div v-else class="flex gap-5px">
          <router-link to="/login">
            Log in
          </router-link>
          <router-link to="/signup">
            Sign up
          </router-link>
        </div>
      </div>
      <div v-else class="flex flex-row-reverse">
        <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click.stop.prevent="toggleDark()">
          <div i="carbon-sun dark:carbon-moon" />
        </button>
        <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click.stop.prevent="toggleLocales">
          <div i-carbon-language />
        </a>
      </div>
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
    display: flex;
    align-items: center;
    height: 60px;
    gap: 3vw;
    background-color: #FAFAFA;
  }

  header > button {
    display: none;
  }

  .dark header {
    background-color: #444;
  }

  #userPanel {
    margin-left: auto;
    padding-right: 1em;
    height: 100%;
    width: 100px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-start;
  }

  #userPanel:hover {
    cursor: pointer;
    background-color: teal;
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

  #userPicture {
    height: 2em;
    width: 2em;
    border-radius: 50%;
  }
</style>
