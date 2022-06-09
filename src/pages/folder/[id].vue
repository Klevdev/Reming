<script lang="ts" setup>
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'
import { useLayoutStore } from '~/stores/layout'

const router = useRouter()
const { t } = useI18n()
const layoutStore = useLayoutStore()

const props = defineProps<{ id: string }>()

const folderTitle = ref('Папка')

useHead({
  title: folderTitle,
  meta: [
    { name: 'description', content: '' },
  ],
})

const materials = ref([])

const getMaterials = async() => {
  const { data, error } = await request.get(`/materials/${props.id}/content`)

  if (!error)
    materials.value = data
}

onMounted(async() => {
  const { data, error } = await request.get(`/materials/${props.id}`)

  if (!error) {
    folderTitle.value = data.title
    await getMaterials()
  }
  document.getElementById('pageTitle').innerText = folderTitle.value
})
</script>

<template>
  <main class="flex flex-col gap-1em">
    <materials-container :materials="materials" />
  </main>
</template>

<route lang="yaml">
meta:
  name: folder
  layout: default
</route>
