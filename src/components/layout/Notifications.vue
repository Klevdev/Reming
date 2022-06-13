<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const { notificationsShow } = storeToRefs(layoutStore)
const user = useUserStore()
const { loggedIn: userLoggedIn } = storeToRefs(user)

</script>

<template>
  <transition name="notificationsPanel">
    <div v-show="userLoggedIn && notificationsShow" id="notificationsPanel">
      <div>Уведомления</div>
      <nav>
        <div class="notification">
          <div i-carbon-user />
          <span>Notification</span>
        </div>
      </nav>
    </div>
  </transition>
</template>

<style scoped>
  .notificationsPanel-enter-active,
  .notificationsPanel-leave-active {
    transition: opacity .2s ease-in-out;
  }
  .notificationsPanel-enter-from,
  .notificationsPanel-leave-to {
    opacity: 0;
  }
  .notificationsPanel-enter-to,
  .notificationsPanel-leave-from {
    opacity: 1;
  }
  #notificationsPanel {
    z-index: 0;
    top: calc(60px + 1em);
    @apply rounded;
    @apply drop-shadow-lg;
    position: absolute;
    right: 1em;
    background-color: var(--bg);
  }

  nav {
    width: max-content;
  }
  .notification {
    display: block;
    height: 45px;
    padding: .25em 1em;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1em;
    justify-content: start;
  }

  .notification:hover,
  .notification:active {
    cursor: pointer;
    background-color: var(--primary);
    transition: all .2s ease-in-out;
  }
  .notification:first-child {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  .notification:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }

  @media only screen and (min-width: 600px) {
    #notificationsPanel {
      right: 3em;
    }
  }
</style>
