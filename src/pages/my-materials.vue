<script lang="ts" setup>
import request from '~/composables/request'
const { t } = useI18n()

const materials = ref({
  created: [],
  saved: [],
  shared: [],
})

onMounted(async() => {
  const { data, error } = await request.get('/materials/personal')

  if (!error)
    materials.value = data
})
</script>

<template>
  <section v-if="[...materials.created, ...materials.saved,...materials.shared].length">
    <h2>{{ t('pages.my-materials.all') }}</h2>
    <materials-container :materials="[...materials.created, ...materials.saved, ...materials.shared]" />
  </section>
  <section v-if="materials.created.length">
    <h2>{{ t('pages.my-materials.created') }}</h2>
    <materials-container :materials="materials.created" />
  </section>
  <section v-if="materials.saved.length">
    <h2>{{ t('pages.my-materials.saved') }}</h2>
    <materials-container :materials="materials.saved" />
  </section>
  <section v-if="materials.shared.length">
    <h2>{{ t('pages.my-materials.shared') }}</h2>
    <materials-container :materials="materials.shared" />
  </section>
  <button id="btnCreateNew" class="btn">
    {{ t('pages.my-materials.create_new') }}
  </button>
</template>

<style>
  #btnCreateNew {
    position: absolute;
    bottom: calc(1em + 60px);
    right: 1em;
  }

  @media only screen and (min-width: 600px) {
    #btnCreateNew {
      bottom: 1em;
    }
  }
</style>

<route lang="yaml">
meta:
  name: my-materials
  layout: default
</route>
