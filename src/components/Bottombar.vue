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
        <li class="menu-item">
          <router-link to="">
            5
          </router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
  footer {
    position: absolute;
    bottom: 0;
    background-color: #FAFAFA;
    height: 60px;
    width: 100%;
  }
  nav {
    height: 100%;
  }
  ul {
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

  .menu-item:hover {
    cursor: pointer;
    background-color: teal;
  }

  .dark footer {
    background-color: #444;
  }

  @media only screen and (min-width: 600px) {
    footer {
      display: none;
    }
  }
</style>
