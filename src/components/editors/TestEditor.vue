<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'

const layoutStore = useLayoutStore()
const { modelValue } = defineProps({
  modelValue: Object,
})

const inputProps = {
  questionText: {
    type: 'textarea',
    label: 'Текст вопроса',
  },
}

const test = ref({
  questions: {},
})

const newEntry = ref({
  type: 'multiple',
  question: {
    text: '',
    asset: {},
  },
  answer: null,
  options: [],
})

const questions = ref([])

const addEntry = () => {
  questions.value.push({
    type: newEntry.value.type,
    question: {
      text: newEntry.value.question.text,
      asset: newEntry.value.question.asset.value,
    },
    answer: newEntry.value.answer,
    options: newEntry.value.options,
  })
  test.value.questions[questions.value.length - 1] = newEntry.value

  newEntry.value = {
    type: 'multiple',
    question: {
      text: '',
      asset: {},
    },
    answer: null,
    options: [],
  }
}
const newAnswerOption = ref({
  text: '',
  asset: {},
})

const addAnswerOption = () => {
  if (newEntry.value.options.length > 3) {
    layoutStore.popup.show({
      message: 'Допускается не более 4 вариантов ответа',
      type: 'error',
    })
  }
  else {
    newEntry.value.options.push({
      text: newAnswerOption.value.text,
      asset: newAnswerOption.value.asset,
    })
    newAnswerOption.value.text = ''
    newAnswerOption.value.asset = {}
  }
}

const deleteAnswerOption = (index) => {
  newEntry.value.options.splice(index, 1)
}

const deleteEntry = (index) => {
  questions.value.splice(index, 1)
  test.value.questions = Object.assign({}, questions.value)
}

</script>

<template>
  <div class="new-question-container">
    <form class="flex flex-col gap-1em max-w-300px" @submit.prevent="() => {addEntry(); $emit('update:modelValue', test)}">
      <!-- <label>
        <div class="mb-8px">Тип вопроса</div>
        <select v-model="newEntry.type" placeholder="Выберите тип">
          <option value="multiple">
            С выбором ответа
          </option>
          <option value="tf">
            Да / нет
          </option>
          <option value="write">
            Открытый вопрос
          </option>
        </select>
      </label> -->
      <Input v-model="newEntry.question.text" :props="inputProps.questionText" />
      <div class="mb-8px">
        <div class="mb-8px">
          Правильный ответ:
        </div>
        <select v-if="newEntry.options.length > 1" v-model="newEntry.answer">
          <option v-for="(option, index) in newEntry.options" :key="index" :value="index">
            {{ option.text }}
          </option>
        </select>
        <div v-else class="text-gray">
          Добавьте от 2 до 4 вариантов ответа
        </div>
      </div>
      <button class="btn" type="submit" :disabled="newEntry.answer === null || !newEntry.question.text">
        Добавить
      </button>
    </form>
    <div id="questionForm">
      <div v-if="newEntry.type === 'multiple'">
        <label>
          <div class="mb-8px">Добавить вариант ответа</div>
          <div class="flex gap-.5em items-center">
            <input v-model="newAnswerOption.text" type="text">
            <button class="btn w-max py-6px" :disabled="!newAnswerOption.text.length || newEntry.options.length > 3" type="button" @click="addAnswerOption">
              <div i="carbon-add" />
            </button>
          </div>
          <!-- <div class="pt-.3em">
            <button v-if="!newAnswerOption.asset.value?._id" type="button" class="text-.8em text-gray flex items-center gap-.5em" @click="layoutStore.assetsMenu.open(newAnswerOption.asset)">
              <div i-carbon-add /> Прикрепить файл
            </button>
            <div v-else class="asset" @click="layoutStore.assetView.open(newAnswerOption.asset.value._id)">
              <div i-carbon-document-attachment />
              {{ newAnswerOption.asset.value.title }}
              <button class="icon-btn" i="carbon-close" @click="newAnswerOption.asset.value = {}" />
            </div>
          </div> -->
        </label>
        <label v-if="newEntry.options?.length">
          <div class="my-8px">Варианты ответа</div>
          <div class="flex flex-row items-center flex-wrap gap-.5em max-w-330px">
            <div v-for="(option, index) in newEntry.options" :key="index" class="entry flex w-100% justify-between gap-.25em pt-.5em">
              <!-- <div class="mr-.5em">{{ index + 1 }}</div> -->
              <div class="w-100% text-left text-ellipsis overflow-hidden" :title="option.text">{{ option.text }}</div>
              <!-- <div v-if="option.asset?._id" class="asset" @click="layoutStore.assetView.open(option.asset._id)">
                <div i-carbon-document-attachment />
                {{ option.asset.title }}
              </div> -->
              <button class="icon-btn" i="carbon-close" type="button" @click="deleteAnswerOption(index)" />
            </div>
          </div>
        </label>
        <div v-if="newEntry.type === 'tf'">
          2
        </div>
        <div v-if="newEntry.type === 'write'">
          3
        </div>
      </div>
    </div>
  </div>
  <h2 class="my-.5em w-max">
    Вопросы:
  </h2>
  <div id="addedContent" class="flex flex-col gap-.5em">
    <div v-for="(entry, index) in questions" :key="index" class="entry flex w-100% justify-between gap-.25em pt-.5em">
      <div class="text-0.8em grid items-center">
        {{ index + 1 }}
      </div>
      <div class="text-0.8em grid items-center">
        {{ entry.question.text }}
      </div>
      <div class="text-0.8em flex items-center gap.5em">
        <div v-for="(option, index) in entry.options">
          {{ index + 1 }}) {{ option.text }};
        </div>
      </div>
      <button i-carbon-close class="icon-btn" type="button" @click="deleteEntry(index)" />
    </div>
  </div>
</template>

<style scoped>

select {
  max-width: 300px;
  @apply rounded;
  /* background-color: var(--bg); */
  border: 2px solid var(--border-input);
  padding: .25em;
  transition: border .2s ease-in-out;
}

select:focus,
select:active {
  border: 2px solid var(--primary-active)
}

input,
textarea {
  @apply rounded;
  outline: none;
  padding: .25em;
  width: 300px;
  background: var(--bg-back);
  border: 2px solid var(--border-input);
  transition: border .2s ease-in-out;
}

input:focus,
input:active {
  border: 2px solid var(--primary-active)
}

input:hover {
  border: 2px solid var(--primary)
}

.entry:not(:first-child) {
  border-top: 1px solid var(--bg-back)
}
.new-question-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

@media only screen and (min-width: 1250px) {
  .new-question-container {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
