<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <Header />
  <div class="layout-wrapper-outer h100%">
    <div class="layout-wrapper-inner">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
  .layout-wrapper-outer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .layout-wrapper-inner {
      padding: 0 0 calc(60px + 60px + 1em) 0;
      width: 100%;
      overflow-y: auto;
  }
  @media only screen and (min-width: 600px) {
    .layout-wrapper-inner {
      padding-left: 0;
      padding-bottom: calc(60px + 1em);
    }
    .page-title {
      text-align: left;
    }
  }

</style>
