<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const { userPanelCollapsed } = storeToRefs(layoutStore)
const user = useUserStore()
const { loggedIn: userLoggedIn, name: userName, picture: userPicture } = storeToRefs(user)

</script>

<template>
  <div class="pr-2em">
    <div v-if="!userLoggedIn" class="flex gap-5px">
      <router-link to="/login" class="btn" @click.stop.prevent>
        {{ t('layout.login') }}
      </router-link>
    </div>
    <div v-else class="flex flex-row">
      <div id="notifications">
        <div i="carbon-notification" />
      </div>
      <div id="user" @click="layoutStore.toggleUserPanel">
        <img v-if="userPicture" id="userPicture" :src="`http://localhost:3001/${userPicture}`" alt="user picture">
        <div v-else class="text-2em" i="carbon-user-avatar-filled-alt" />
      </div>
    </div>
    <transition name="userDropdown">
      <div v-show="userLoggedIn && userPanelCollapsed" id="userDropdown">
        <nav>
          <router-link class="menu-item" to="/profile">
            <div i-carbon-user />
            <span>{{ t('layout.user.profile') }}</span>
          </router-link>
          <button class="menu-item" @click="user.logout">
            <div i-carbon-logout />
            <span>{{ t('layout.user.logout') }}</span>
          </button>
        </nav>
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .userDropdown-enter-active,
  .userDropdown-leave-active {
    transition: opacity .2s ease-in-out;
  }
  .userDropdown-enter-from,
  .userDropdown-leave-to {
    opacity: 0;
  }
  .userDropdown-enter-to,
  .userDropdown-leave-from {
    opacity: 1;
  }
  #userDropdown {
    z-index: 0;
    top: calc(60px + 1em);
    @apply rounded;
    position: absolute;
    right: 2em;
    background-color: var(--bg);
  }

  #userPicture {
    height: 2.2em;
    width: 2.2em;
    border-radius: 50%;
  }

  #user,
  #notifications {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
  }

  nav {
    width: max-content;
  }
  .menu-item {
    display: block;
    height: 45px;
    padding: .25em 1em;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1em;
    justify-content: start;
  }

  #user:hover,
  #notifications:hover,
  .menu-item:hover,
  .menu-item:active {
    cursor: pointer;
    background-color: var(--primary);
    transition: all .2s ease-in-out;
  }
  .menu-item:first-child {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  .menu-item:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }
</style>
