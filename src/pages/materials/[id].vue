<script setup lang="ts">

import request from '~/composables/request'
import { dateToString } from '~/composables/date'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()

const materialInfo = ref({})

const materialContent = ref({})

const getContent = async() => {
  const { data, error } = await request.get(`/materials/${props.id}/content`)

  if (!error)
    materialContent.value = data.definitions
}
const deleteMaterial = async() => {
  const { data, error } = await request.delete(`/materials/${props.id}`)

  if (!error)
    router.push('/my-materials')
}

onMounted(async() => {
  const { data, error } = await request.get(`/materials/${props.id}`)

  if (!error)
    materialInfo.value = data
  await getContent()
})
</script>

<template>
  <main>
    <section class="max-w-45vw">
      <div class="flex flex-col gap-1em max-w-300px">
        <h2>{{ materialInfo.title }}</h2>
        <div>{{ materialInfo.description }}</div>
        <dl>
          <dt>{{ t('pages.material-view.user') }}</dt>
          <dd>{{ materialInfo.user.name }}</dd>
          <dt>{{ t('pages.material-view.created-at') }}</dt>
          <dd>{{ dateToString(materialInfo.createdAt) }}</dd>
          <dt>{{ t('pages.material-view.updated-at') }}</dt>
          <dd>{{ dateToString(materialInfo.updatedAt) }}</dd>
        </dl>
        <div>{{ materialInfo.tags }}</div>
      </div>
      <div id="actions" class="pt-1em w-max">
        <button class="btn">
          {{ t('pages.material-view.save') }}
        </button>
        <button class="btn">
          {{ t('pages.material-view.edit') }}
        </button>
        <button class="btn" @click="deleteMaterial">
          {{ t('pages.material-view.delete') }}
        </button>
      </div>
    </section>
    <section class="max-w-45vw">
      <div id="materialContent" class="w-max">
        <div v-for="entry in materialContent" :key="entry" class="grid grid-cols-2 gap-1em">
          <div class="w-max">
            <span>{{ entry.term.text }}</span>
          </div>
          <div class="w-max">
            <span>{{ entry.def.text }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
  margin-right: 1em;
}

</style>

<route lang="yaml">
meta:
  name: material-view
  template: default
</route>
