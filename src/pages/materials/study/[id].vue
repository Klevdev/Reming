<script setup lang="ts">

import request from '~/composables/request'
import { dateToString } from '~/composables/date'
import { useUserStore } from '~/stores/user'
import { useLayoutStore } from '~/stores/layout'

const userStore = useUserStore()
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()

useHead({
  title: t('pages.study.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

const materialInfo = ref({})

const cards = ref({})

const getContent = async() => {
  const { data, error } = await request.get(`/materials/${props.id}/content`)

  if (!error)
    cards.value = data.definitions
}

const answers = ref([])

const studyComplete = ref(false)

const currentCardIdx = ref(0)
const currentCardIndex = ref(0)
const currentCardText = ref('')
const currentCardSide = ref(0)
const currentCardFlipped = ref(false)
const cardAnimation = ref('')

const flip = () => {
  cardAnimation.value = 'flip'
  setTimeout(() => {
    cardAnimation.value = ''
  }, 500)
  currentCardFlipped.value = true
  if (currentCardSide.value === 0) {
    setTimeout(() => {
      currentCardText.value = cards.value[currentCardIndex.value].def.text
    }, 250)
    currentCardSide.value = 1
  }
  else {
    setTimeout(() => {
      currentCardText.value = cards.value[currentCardIndex.value].term.text
    }, 250)
    currentCardSide.value = 0
  }
}

const nextCard = () => {
  cardAnimation.value = 'appear'
  setTimeout(() => {
    cardAnimation.value = ''
  }, 500)
  currentCardIndex.value++
  if (currentCardIndex.value >= Object.keys(cards.value).length) {
    studyComplete.value = true
  }
  else {
    // currentCardIdx.value = currentCardIndex.value
    currentCardText.value = cards.value[currentCardIndex.value].term.text
    currentCardSide.value = 0
    currentCardFlipped.value = false
  }
}
const answer = (correct) => {
  answers.value.push({
    idx: currentCardIndex.value,
    correct,
  })
  cardAnimation.value = correct ? 'correct' : 'incorrect'
  setTimeout(() => {
    cardAnimation.value = ''
    nextCard()
  }, 500)
}
const getCorrect = () => {
  return answers.value.filter(answer => answer.correct)
}
const getIncorrect = () => {
  return answers.value.filter(answer => !answer.correct)
}
const getPercentage = () => {
  return Math.round(getCorrect().length / answers.value.length * 10000) / 100
}
const save = async() => {

}

onMounted(async() => {
  if (!useUserStore().loggedIn) {
    useLayoutStore().popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    router.go(-1)
  }
  const { data, error } = await request.get(`/materials/${props.id}`)

  if (!error)
    materialInfo.value = data
  await getContent()
  nextCard()
})
</script>

<template>
  <main class="h-100%">
    <section v-if="!studyComplete" class="h-100% flex flex-col justify-between mt-2em">
      <div class="card" :class="cardAnimation" @dblclick="flip">
        <div class="card-idx">
          {{ currentCardIdx + 1 }}
        </div>
        <div class="card-text">
          {{ currentCardText }}
        </div>
      </div>
      <div class="flex flex-row gap-3em mx-a w-max mt-2em">
        <button type="button" class="btn incorrect-btn flex items-center justify-center h-40px gap-.5em" :disabled="!currentCardFlipped || cardAnimation !== ''" @click="answer(false)">
          <div i-carbon-close />
          <div class="weird-text">
            Не знаю
          </div>
        </button>
        <button type="button" class="btn flip-btn" :disabled="cardAnimation !== ''" @click="flip">
          Перевернуть
        </button>
        <button type="button" class="btn correct-btn flex items-center justify-center gap-.5em" :disabled="!currentCardFlipped || cardAnimation !== ''" @click="answer(true)">
          <div class="weird-text">
            Знаю
          </div>
          <div i-carbon-checkmark />
        </button>
      </div>
    </section>
    <section v-else>
      <div class="end-screen">
        <h2 class="font-bold text-1.4em mb-.5em">
          Итог
        </h2>
        <div style="display: flex; flex-direction: column; text-align: left;">
          <span style="color: #3EAF7C; margin-right: 10px"><strong>{{ getCorrect().length }}</strong> Правильно</span>
          <span style="color: #E95252; margin-right: 10px"><strong>{{ getIncorrect().length }}</strong> Неправильно</span>
          <span>Правильно отвечено <strong>{{ getPercentage() }}%</strong> карточек</span>
        </div>
        <strong v-if="getCorrect().length">Отвечены верно:</strong>
        <div v-for="answer in getCorrect()" :key="answer.idx">
          {{ answer.idx }}) {{ cards[answer.idx].term.text }} - {{ cards[answer.idx].def.text }}
        </div>
        <strong v-if="getIncorrect().length">Отвечены неверно:</strong>
        <div v-for="answer in getIncorrect()" :key="answer.idx">
          {{ answer.idx }}) {{ cards[answer.idx].term.text }} - {{ cards[answer.idx].def.text }}
        </div>
        <button type="button" class="btn mt-1em" @click="save">
          {{ 'Завершить' }}
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes appear {
  0% {
    opacity: 0;
    top: -250px;
  }
  100% {
    opacity: 1;
    top: 0;
  }
}

@keyframes flip {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes correct {
  0% {
    opacity: 1;
    left: 0;
  }
  100% {
    opacity: 0;
    left: 250px;
  }
}
@keyframes incorrect {
  0% {
    opacity: 1;
    right: 0;
  }
  100% {
    opacity: 0;
    right: 250px;
  }
}
.appear {
  animation: appear .5s forwards;
}
.flip {
  animation: flip .5s forwards;
}
.correct {
  animation: correct .5s forwards;
}
.incorrect {
  animation: incorrect .5s forwards;
}

.card {
  user-select: none;
  position: relative;
  margin: 0 auto;
  color: black;
  font-size: 1.4em;
  width: 350px;
  height: 210px;
  box-shadow: 0 0 10px #2c3e5033, 0 20px 20px #2c3e5011;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FAFAFA;
  padding: 20px 25px;
  border-radius: 5px;
}
.card > .card-idx {
  color: #DDD;
  font-size: 1rem;
  position: absolute;
  top: 5px;
  left: 5px;
}
.card-idx::before {
  content: '№ ';
}
.card > .card-text {

}
.btn > .weird-text {
  display: none;
}

.btn.incorrect-btn {
  background-color: #E95252;
  background-size: 50% 50%;
}
.btn.flip-btn {
  width: max-content;
  padding: 0 15px;
  background-color: #A1C4FD;
}
.btn.correct-btn {
  background-color: #3EAF7C;
  background-size: 100% 100%;
}
.btn:disabled {
  background-color: var(--btn-disabled);
}
.end-screen {
  @apply rounded;
  margin: 0 auto;
  width: max-width;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  background: var(--bg);
  padding: 20px 25px;
}
.end-screen > ul {
    list-style: none;
    text-align: left;
}

@media only screen and (min-width: 600px) {
  .card {
    width: 400px;
    height: 250px;
    font-size: 1.5em;
  }

  main > section {
    justify-content: center;
    gap: 4em;
  }
  .end-screen {
    max-width: max-content;
  }
  .btn {
    width: 130px;
  }
  .btn > .weird-text {
    display: block;
  }
}
</style>

<route lang="yaml">
meta:
  name: study
  layout: study
</route>
