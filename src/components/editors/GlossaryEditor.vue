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
})

const definitions = ref([])

const addEntry = () => {
  definitions.value.push({
    term: newEntry.value.term,
    def: newEntry.value.def,
  })
  glossary.value.definitions[definitions.value.length - 1] = newEntry.value

  console.log(newEntry.value, definitions)

  newEntry.value = {
    term: {
      text: '',
    },
    def: {
      text: '',
    },
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
    <button class="btn" :disabled="newEntry.term.text === '' || newEntry.def.text === ''">
      Добавить
    </button>
  </form>
  <h2 class="my-.5em w-max">
    Определения:
  </h2>
  <div id="addedContent" class="flex flex-col gap-.5em">
    <div v-for="(entry, index) in definitions" :key="index" class="entry flex w-100% justify-between gap-.25em pt-.5em">
      <div>
        {{ index }}
      </div>
      <div class="w-30%">
        <div class="w-100% text-left text-ellipsis overflow-hidden" :title="entry.term.text">
          {{ entry.term.text }}
        </div>
      </div>
      <div class="w-30%">
        <div class="w-100% text-left text-ellipsis overflow-hidden" :title="entry.def.text">
          {{ entry.def.text }}
        </div>
      </div>
      <button i-carbon-close class="grid items-center" @click="deleteEntry(index)" />
    </div>
  </div>
</template>

<style scoped>
  .entry:not(:first-child) {
    border-top: 1px solid var(--bg-back)
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
