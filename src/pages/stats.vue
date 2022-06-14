<script lang="ts" setup>
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'
import { dateToString } from '~/composables/date'
import { useLayoutStore } from '~/stores/layout'

const router = useRouter()
const { t } = useI18n()
const layoutStore = useLayoutStore()

useHead({
  title: t('pages.stats.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

// const getLastResult = (results) => {
//   const lastEntry = results[Math.max(...Object.keys(results).map(date => parseInt(date)))]

//   let correctCount = 0
//   let incorrectCount = 0
//   lastEntry.foreach((item) => { isCorrect ? correctCount++ : incorrectCount++ })
//   return Math.round(correctCount / results.length * 10000) / 100
// }

const studies = ref([])

onMounted(async() => {
  if (!useUserStore().loggedIn) {
    layoutStore.popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    router.go(-1)
  }
  const { data, error } = await request.get('/studies')

  if (!error)
    studies.value = data
})
</script>

<template>
  <main class="flex gap-1em flex-wrap">
    <div v-for="material in studies" :key="material.materialInfo._id" class="material">
      <div class="flex justify-between items-center">
        <span class="font-bold">{{ material.materialInfo.title }}</span>
        <div v-if="material.materialInfo.type === 'cardSet'" i="carbon-collapse-all" :title="t(`material.materialInfo.types.${material.materialInfo.type}`)" />
        <div v-if="material.materialInfo.type === 'test'" i="carbon-text-annotation-toggle" :title="t(`material.materialInfo.types.${material.materialInfo.type}`)" />
      </div>
      <div>Записей: {{ Object.keys(material.results).length }}</div>
      <!-- <div>Последний результат: {{ getLastResult(material.results) }}</div> -->
      <div class="flex flex-row items-center gap-.5em">
        <button class="btn w-max" @click="layoutStore.materialStats.open(material.materialId, material)">
          <div i="carbon-chart-histogram" />
        </button>
        <router-link :to="`/materials/${material.materialId}`" class="btn w-max">
          <div i="carbon-view" />
        </router-link>
      </div>
    </div>

    <MaterialStats v-if="layoutStore.materialStats.shown" />
  </main>
</template>

<style scoped>
  .material {
    @apply rounded;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    min-width: 200px;
    padding: 1em;
    gap: 1em;
  }
</style>

<route lang="yaml">
meta:
  name: stats
  layout: default
</route>
