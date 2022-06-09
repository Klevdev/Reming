<script setup lang="ts">

// const toggleLocales = () => {
//   // change to some real logic
//   const locales = availableLocales
//   locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
// }
</script>
<template>
  <footer>
    <nav>
      <router-link class="menu-item" to="/library">
        <div i-carbon-book />
      </router-link>
      <router-link class="menu-item" to="/my-materials">
        <div i-carbon-folder />
      </router-link>
      <router-link class="menu-item" to="">
        <div i-carbon-home />
      </router-link>
      <router-link class="menu-item" to="">
        <div i-carbon-calendar />
      </router-link>
      <router-link class="menu-item" to="/stats">
        <div i-carbon-dashboard />
      </router-link>
    </nav>
  </footer>
</template>

<style scoped>
  footer {
    position: absolute;
    bottom: 0;
    background-color: var(--bg);
    height: 60px;
    width: 100%;
  }
  nav {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
  .menu-item {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  .menu-item:active {
    background-color: var(--primary-active);
    transition: all .2s ease-in-out;
  }

  @media only screen and (min-width: 600px) {
    footer {
      display: none;
    }
  }
</style>
