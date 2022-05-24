<script lang="ts" setup>
import request from '~/composables/request'

const router = useRouter()
const { t } = useI18n()

useHead({
  title: t('pages.my-materials.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

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

const createMenuOpened = ref(false)
const createMenu = ref(null)
onClickOutside(createMenu, () => createMenuOpened.value = false)

const goToEditor = (type) => {
  localStorage.setItem('currentMaterialType', type)
  router.push('/materials/create')
}

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
    <div>
      <button id="btnCreateNew" ref="createMenu" class="btn" @click="createMenuOpened = !createMenuOpened">
        {{ t('pages.my-materials.create_new') }}
      </button>
      <transition name="createMenu">
        <div v-if="createMenuOpened" id="createMenu">
          <nav>
            <button class="menu-item" @click="goToEditor('glossary')">
              <div i-carbon-book />
              <span>{{ t('material.types.glossary') }}</span>
            </button>
            <button class="menu-item" @click="goToEditor('cardSet')">
              <div i-carbon-collapse-all />
              <span>{{ t('material.types.cardSet') }}</span>
            </button>
            <button class="menu-item" @click="goToEditor('questionBank')">
              <div i-carbon-book />
              <span>{{ t('material.types.questionBank') }}</span>
            </button>
            <button class="menu-item" @click="goToEditor('test')">
              <div i-carbon-text-annotation-toggle />
              <span>{{ t('material.types.test') }}</span>
            </button>
          </nav>
        </div>
      </transition>
    </div>
  </main>
</template>

<style scoped>
  .createMenu-enter-active,
  .createMenu-leave-active {
    transition: opacity .2s ease-in-out;
  }
  .createMenu-enter-from,
  .createMenu-leave-to {
    opacity: 0;
  }
  .createMenu-enter-to,
  .createMenu-leave-from {
    opacity: 1;
  }
  #createMenu {
    z-index: 0;
    @apply rounded drop-shadow-lg;
    position: absolute;
    bottom: calc(60px + 4em);
    right: 3em;
    background-color: var(--bg);
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
  #btnCreateNew {
    position: absolute;
    bottom: calc(1em + 60px);
    right: 3em;
  }

  @media only screen and (min-width: 600px) {
    #btnCreateNew {
      bottom: 1em;
    }

    #createMenu {
      bottom: 60px;
    }
  }
</style>

<route lang="yaml">
meta:
  name: my-materials
  layout: default
</route>
