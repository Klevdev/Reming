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
  title: t('pages.material-view.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

const materialInfo = ref({})

const materialContent = ref({})

const getContent = async() => {
  const { data, error } = await request.get(`/materials/${props.id}/content`)

  if (!error)
    materialContent.value = data
}
const deleteMaterial = async() => {
  const { data, error } = await request.delete(`/materials/${props.id}`)

  if (!error)
    router.push('/my-materials')
}

const save = async() => {
  const { data, error } = await request.patch('/user/saved-materials', { materialId: materialInfo.value._id })

  if (!error)
    materialInfo.value.isSaved = true
}

const remove = async() => {
  const { data, error } = await request.delete(`/user/saved-materials?materialId=${materialInfo.value._id}`)

  if (!error)
    materialInfo.value.isSaved = false
}

onMounted(async() => {
  const { data, error } = await request.get(`/materials/${props.id}`)

  if (!error)
    materialInfo.value = data
  await getContent()
})
onBeforeMount(() => {
  if (!useUserStore().loggedIn) {
    useLayoutStore().popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    useRouter().go(-1)
  }
})
</script>

<template>
  <main>
    <div class="flex flex-col gap-1em min-w-40vw">
      <section id="materialInfo" class="container">
        <div class="flex flex-col gap-1em max-w-45vw">
          <h2 class="font-bold text-1.2em">
            {{ materialInfo.title }}
          </h2>
          <div>{{ materialInfo.description }}</div>
          <dl>
            <div class="flex flex-row gap-1em">
              <dt>{{ t('pages.material-view.user') }}:</dt>
              <dd>{{ materialInfo.user?.name }}</dd>
            </div>
            <div class="flex flex-row gap-1em">
              <dt>{{ t('pages.material-view.created-at') }}:</dt>
              <dd>{{ dateToString(materialInfo.createdAt) }}</dd>
            </div>
            <div class="flex flex-row gap-1em">
              <dt>{{ t('pages.material-view.updated-at') }}:</dt>
              <dd>{{ dateToString(materialInfo.updatedAt) }}</dd>
            </div>
          </dl>
          <!-- <div>{{ materialInfo.tags }}</div> -->
        </div>
      </section>
      <section id="actions" class="container pt-1em w-max flex gap-.5em mb-1em">
        <router-link v-if="materialInfo.type === 'cardSet'" class="btn" :to="`/materials/study/${materialInfo._id}`">
          {{ t('pages.material-view.study') }}
        </router-link>
        <button v-if="!materialInfo.isSaved" class="btn" @click="save">
          {{ t('pages.material-view.save') }}
        </button>
        <button v-else class="btn" :disabled="materialInfo.user?._id === userStore._id" @click="remove">
          {{ t('pages.material-view.remove') }}
        </button>
        <!-- <button v-show="materialInfo.user?._id === userStore._id" class="btn">
        {{ t('pages.material-view.edit') }}
      </button> -->
        <button v-show="materialInfo.user?._id === userStore._id" class="btn danger" @click="deleteMaterial">
          {{ t('pages.material-view.delete') }}
        </button>
      </section>
    </div>
    <section id="materialContent" class="container">
      <glossary-content v-if="materialInfo.type === 'glossary'" :content="materialContent" />
      <card-set-content v-if="materialInfo.type === 'cardSet'" :content="materialContent" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  max-width: max-content;
}

.container {
  @apply rounded;
  width: 100%;
  padding: .7em;
  background: var(--bg);
}

@media only screen and (min-width: 600px) {
  main {
    flex-direction: column;
  }

  main > div {
    margin-right: 2em;
  }

  #materialContent {
    width: max-content;
  }

  #actions {
    grid-column: 1;
    grid-row: 2;
  }
}

@media only screen and (min-width: 1200px) {
  main {
    flex-direction: row;
  }

  main > div {
    margin-right: 2em;
  }

  #materialContent {
    width: max-content;
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
