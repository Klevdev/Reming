<script lang="ts" setup>

const { modelValue } = defineProps({
  modelValue: Object,
})

const inputProps = {
  termText: {
    type: 'text',
    label: 'Term',
  },
  defText: {
    type: 'text',
    label: 'Definition',
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

let glossaryLastIdx = 0

const addEntry = () => {
  glossary.value.definitions[glossaryLastIdx] = {
    term: newEntry.value.term,
    def: newEntry.value.def,
  }
  glossaryLastIdx++
  newEntry.value.term = {
    text: '',
  }
  newEntry.value.def = {
    text: '',
  }

  // emit('update:modelValue', glossary)
}

</script>

<template>
  <form class="flex flex-col gap-1em max-w-300px" @submit.prevent="() => {addEntry(); $emit('update:modelValue', glossary)}">
    <Input v-model="newEntry.term.text" :props="inputProps.termText" />
    <Input v-model="newEntry.def.text" :props="inputProps.defText" />
    <button class="btn" :disabled="newEntry.term.text === '' || newEntry.def.text === ''">
      Add
    </button>
  </form>
  <div id="addedContent" class="border w-max">
    <div v-for="entry in glossary.definitions" :key="entry" class="border grid grid-cols-2 gap-1em">
      <div class="w-max">
        <span>{{ entry.term.text }}</span>
      </div>
      <div class="w-max">
        <span>{{ entry.def.text }}</span>
      </div>
    </div>
  </div>
</template>
