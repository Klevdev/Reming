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
      <h2>Material information</h2>
      <div class="flex flex-col gap-1em max-w-300px">
        <div>{{ materialInfo.title }}</div>
        <div>{{ materialInfo.description }}</div>
        <div>{{ materialInfo.userId }}</div>
        <div>{{ dateToString(materialInfo.createdAt) }}</div>
        <div>{{ dateToString(materialInfo.updatedAt) }}</div>
        <div>{{ materialInfo.tags }}</div>
      </div>
      <div id="actions" class="pt-1em w-max">
        <button class="btn">
          Save to my materials
        </button>
        <button class="btn">
          Edit
        </button>
        <button class="btn" @click="deleteMaterial">
          Delete
        </button>
      </div>
    </section>
    <section class="max-w-45vw">
      <h2>Material content</h2>
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
