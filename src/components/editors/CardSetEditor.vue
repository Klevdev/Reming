<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'

const layoutStore = useLayoutStore()
const { modelValue } = defineProps({
  modelValue: Object,
})

const inputProps = {
  termText: {
    type: 'text',
    label: 'Термин',
  },
  defText: {
    type: 'text',
    label: 'Определение',
  },
}

const glossary = ref({
  definitions: {},
})

const newEntry = ref({
  term: {
    text: '',
    asset: {},
  },
  def: {
    text: '',
    asset: {},
  },
  reversible: false,
})

const definitions = ref([])

const addEntry = () => {
  definitions.value.push({
    term: {
      text: newEntry.value.term.text,
      asset: newEntry.value.term.asset.value,
    },
    def: {
      text: newEntry.value.def.text,
      asset: newEntry.value.def.asset.value,
    },
  })
  glossary.value.definitions[definitions.value.length - 1] = newEntry.value

  newEntry.value = {
    term: {
      text: '',
      asset: {},
    },
    def: {
      text: '',
      asset: {},
    },
    reversable: false,
  }
}

const deleteEntry = (index) => {
  definitions.value.splice(index, 1)
  glossary.value.definitions = Object.assign({}, definitions.value)
}

</script>

<template>
  <form class="flex flex-col gap-1em max-w-300px" @submit.prevent="() => {addEntry(); $emit('update:modelValue', glossary)}">
    <div>
      <Input v-model="newEntry.term.text" :props="inputProps.termText" />
      <div class="pt-.3em">
        <button v-if="!newEntry.term.asset.value?._id" type="button" class="text-.8em text-gray flex items-center gap-.5em" @click="layoutStore.assetsMenu.open(newEntry.term.asset)">
          <div i-carbon-add /> Прикрепить файл
        </button>
        <div v-else class="asset" @click="layoutStore.assetView.open(newEntry.term.asset.value._id)">
          <div i-carbon-document-attachment />
          {{ newEntry.term.asset.value.title }}
          <button class="icon-btn" i="carbon-close" @click.stop="newEntry.term.asset.value = {}" />
        </div>
      </div>
    </div>
    <div>
      <Input v-model="newEntry.def.text" :props="inputProps.defText" />
      <div class="pt-.3em">
        <button v-if="!newEntry.def.asset.value?._id" type="button" class="text-.8em text-gray flex items-center gap-.5em" @click="layoutStore.assetsMenu.open(newEntry.def.asset)">
          <div i-carbon-add /> Прикрепить файл
        </button>
        <div v-else class="asset" @click="layoutStore.assetView.open(newEntry.def.asset.value._id)">
          <div i-carbon-document-attachment />
          {{ newEntry.def.asset.value.title }}
          <button class="icon-btn" i="carbon-close" @click="newEntry.def.asset.value = {}" />
        </div>
      </div>
    </div>
    <!-- <input v-model="newEntry.reversible" type="checkbox"> -->
    <button class="btn" :disabled="newEntry.term.text === '' || newEntry.def.text === ''">
      Добавить
    </button>
  </form>
  <h2 class="my-.5em w-max">
    Карточки:
  </h2>
  <div id="addedContent" class="flex flex-col gap-.5em">
    <div v-for="(entry, index) in definitions" :key="index" class="entry flex w-100% justify-between gap-.25em pt-.5em">
      <div class="text-0.8em grid items-center">
        {{ index }}
      </div>
      <div class="card-side">
        <div class="card-side--text" :title="entry.term.text">
          {{ entry.term.text }}
        </div>
        <div v-if="entry.term.asset?._id" class="asset" @click="layoutStore.assetView.open(entry.term.asset._id)">
          <div i-carbon-document-attachment />
          {{ entry.term.asset.title }}
        </div>
      </div>
      <div class="card-side">
        <div class="card-side--text" :title="entry.def.text">
          {{ entry.def.text }}
        </div>
        <div v-if="entry.def.asset?._id" class="asset" @click="layoutStore.assetView.open(entry.def.asset._id)">
          <div i-carbon-document-attachment />
          {{ entry.def.asset.title }}
        </div>
      </div>
      <button i-carbon-close class="icon-btn" @click="deleteEntry(index)" />
    </div>
  </div>
</template>

<style scoped>
  .entry:not(:first-child) {
    border-top: 1px solid var(--bg-back)
  }

  .card-side {
    @apply min-w-100px w-35% grid items-center;
  }

  .card-side--text {
    @apply w-100% text-left text-ellipsis text-0.8em overflow-hidden;
  }

  .asset {
    @apply flex items-center gap-.3em text-0.8em;
  }

  @media only screen and (min-width: 1250px) {
    form {
      flex-direction: row;
      align-items: center;
    }
    form > button {
      height: max-content;
      margin-top: 7px;
    }
  }
</style>
