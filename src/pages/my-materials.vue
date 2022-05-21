<script lang="ts" setup>
import request from '~/composables/request'
const { t } = useI18n()

const materials = ref({
  created: [],
  saved: [],
  shared: [],
})

const sectionsShown = ref({
  all: true,
  created: false,
  saved: false,
  shared: false,
})

onMounted(async() => {
  const { data, error } = await request.get('/materials/personal')

  if (!error)
    materials.value = data
})

</script>

<template>
  <main class="flex flex-col gap-1em">
    <section v-if="[...materials.created, ...materials.saved,...materials.shared].length">
      <div class="flex gap-5px mb-1em">
        <h2>{{ t('pages.my-materials.all') }}</h2>
        <button :title="t('layout.buttons.collapse')" @click="sectionsShown.all = !sectionsShown.all">
          <div v-if="sectionsShown.all" i="carbon-caret-up" />
          <div v-else i="carbon-caret-down" />
        </button>
      </div>
      <materials-container v-show="sectionsShown.all" :materials="[...materials.created, ...materials.saved, ...materials.shared]" />
    </section>
    <section v-if="materials.created.length">
      <div class="flex gap-5px mb-1em">
        <h2>{{ t('pages.my-materials.created') }}</h2>
        <button :title="t('layout.buttons.collapse')" @click="sectionsShown.created = !sectionsShown.created">
          <div v-if="sectionsShown.created" i="carbon-caret-up" />
          <div v-else i="carbon-caret-down" />
        </button>
      </div>
      <materials-container v-show="sectionsShown.created" :materials="materials.created" />
    </section>
    <section v-if="materials.saved.length">
      <div class="flex gap-5px mb-1em">
        <h2>{{ t('pages.my-materials.saved') }}</h2>
        <button :title="t('layout.buttons.collapse')" @click="sectionsShown.saved = !sectionsShown.saved">
          <div v-if="sectionsShown.saved" i="carbon-caret-up" />
          <div v-else i="carbon-caret-down" />
        </button>
      </div>
      <materials-container v-show="sectionsShown.saved" :materials="materials.saved" />
    </section>
    <section v-if="materials.shared.length">
      <div class="flex gap-5px mb-1em">
        <h2>{{ t('pages.my-materials.shared') }}</h2>
        <button :title="t('layout.buttons.collapse')" @click="sectionsShown.shared = !sectionsShown.shared">
          <div v-if="sectionsShown.shared" i="carbon-caret-up" />
          <div v-else i="carbon-caret-down" />
        </button>
      </div>
      <materials-container v-show="sectionsShown.shared" :materials="materials.shared" />
    </section>
    <router-link id="btnCreateNew" to="/materials/create" class="btn">
      {{ t('pages.my-materials.create_new') }}
    </router-link>
  </main>
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
