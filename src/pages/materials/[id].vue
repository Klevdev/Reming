<script setup lang="ts">

import request from '~/composables/request'
import { dateToString } from '~/composables/date'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
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
    <section id="materialInfo" class="container">
      <div class="flex flex-col gap-1em max-w-45vw">
        <h2>{{ materialInfo.title }}</h2>
        <div>{{ materialInfo.description }}</div>
        <dl>
          <dt>{{ t('pages.material-view.user') }}</dt>
          <dd>{{ materialInfo.user?.name }}</dd>
          <dt>{{ t('pages.material-view.created-at') }}</dt>
          <dd>{{ dateToString(materialInfo.createdAt) }}</dd>
          <dt>{{ t('pages.material-view.updated-at') }}</dt>
          <dd>{{ dateToString(materialInfo.updatedAt) }}</dd>
        </dl>
        <div>{{ materialInfo.tags }}</div>
      </div>
    </section>
    <section id="actions" class="container pt-1em w-max flex gap-.5em">
      <button class="btn">
        {{ t('pages.material-view.save') }}
      </button>
      <!-- <button v-show="materialInfo.user?._id === userStore._id" class="btn">
        {{ t('pages.material-view.edit') }}
      </button> -->
      <button v-show="materialInfo.user?._id === userStore._id" class="btn danger" @click="deleteMaterial">
        {{ t('pages.material-view.delete') }}
      </button>
    </section>
    <section id="materialContent" class="container">
      <div class="container pt-1em w-max flex gap-.5em">
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
  grid-template-columns: 1fr;
  row-gap: 1em;
}

.container {
  @apply rounded;
  width: 100%;
  padding: .7em;
  background: var(--bg);
}

@media only screen and (min-width: 600px) {
  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2em;
    row-gap: 1em;
    margin-right: 3em;
  }

  #actions {
    grid-column: 1;
    grid-row: 2;
  }
}

</style>

<route lang="yaml">
meta:
  name: material-view
  layout: default
</route>
