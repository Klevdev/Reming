<script lang="ts" setup>
import request from '~/composables/request'
const { t } = useI18n()
const { materials } = defineProps({
  materials: Array,
})

// const save = async(id) => {
//   const { data, error } = await request.patch('/user/saved-materials', { materialId: id })

//   if (!error)
//     materials?.find(material => material._id === id)?.isSaved = true
// }
// const unsave = async(id) => {
//   const { data, error } = await request.delete(`/user/saved-materials?materialId=${id}`)

//   if (!error)
//     materials?.find(material => material._id === id)?.isSaved = false
// }

</script>

<template>
  <div class="flex gap-1em flex-wrap">
    <router-link v-for="material in materials" :key="material._id" :to="material.type !== 'folder' ? `/materials/${material._id}` : `/folder/${material._id}`" class="material">
      <!-- <div>{{ icons[material.type] }}</div> -->
      <div class="flex justify-between items-center">
        <span class="font-bold">{{ material.title }}</span>
        <div v-if="material.type === 'glossary'" i="carbon-book" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'cardSet'" i="carbon-collapse-all" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'questionBank'" i="carbon-book" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'test'" i="carbon-text-annotation-toggle" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'article'" i="majesticons-article-line" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'folder'" i="carbon-folder" :title="t(`material.types.${material.type}`)" />
      </div>
      <span v-if="material.description">{{ material.description }}</span>
      <!-- <span class="font-italic">{{ material.user?.name }}</span> -->
      <div class="flex flex-row justify-between items-center">
        <!-- <router-link :to="`/materials/${material._id}`" class="btn w-max">
          <div i="carbon-view" />
        </router-link> -->
        <div v-if="material.isSaved" i-carbon-checkmark />
      </div>
    </router-link>
  </div>
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
