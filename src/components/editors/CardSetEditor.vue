<script lang="ts" setup>

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
  },
  def: {
    text: '',
  },
  reversible: false,
})

const definitions = ref([])

const addEntry = () => {
  definitions.value.push({
    term: newEntry.value.term,
    def: newEntry.value.def,
  })
  glossary.value.definitions[definitions.value.length - 1] = newEntry.value

  newEntry.value = {
    term: {
      text: '',
    },
    def: {
      text: '',
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
    <Input v-model="newEntry.term.text" :props="inputProps.termText" />
    <Input v-model="newEntry.def.text" :props="inputProps.defText" />
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
      </div>
      <div class="card-side">
        <div class="card-side--text" :title="entry.def.text">
          {{ entry.def.text }}
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

  @media only screen and (min-width: 1250px) {
    form {
      flex-direction: row;
      align-items: flex-end;
    }
    form > button {
      height: max-content;
      margin-bottom: 2px;
    }
  }
</style>
