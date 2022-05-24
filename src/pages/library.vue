<script lang="ts" setup>
import request from '~/composables/request'

const router = useRouter()
const { t } = useI18n()

useHead({
  title: t('pages.library.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

const materials = ref([])

onMounted(async() => {
  const { data, error } = await request.get('/materials/public')

  if (!error)
    materials.value = data
})

</script>

<template>
  <main>
    <materials-container :materials="materials" />
  </main>
</template>

<route lang="yaml">
meta:
  name: library
  layout: default
</route>
