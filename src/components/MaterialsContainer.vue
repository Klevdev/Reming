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
    <router-link v-for="material in [...materials]?.sort((m1, m2) => m1.type === 'folder' ? -1 : 1)" :key="material._id" :to="material.type !== 'folder' ? `/materials/${material._id}` : `/folder/${material._id}`" class="material">
      <!-- <div>{{ icons[material.type] }}</div> -->
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-ellipsis overflow-hidden" :title="material.title">
          {{ material.title }}
        </h3>
        <div v-if="material.type === 'glossary'" i="carbon-book" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'cardSet'" i="carbon-collapse-all" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'questionBank'" i="carbon-book" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'test'" i="carbon-text-annotation-toggle" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'article'" i="majesticons-article-line" :title="t(`material.types.${material.type}`)" />
        <div v-if="material.type === 'folder'" i="carbon-folder" :title="t(`material.types.${material.type}`)" />
      </div>
      <span v-if="material.description" class="text-.8em text-ellipsis overflow-hidden">{{ material.description }}</span>
      <!-- <span class="font-italic">{{ material.user?.name }}</span> -->
      <div v-if="material.tags?.length" class="flex flex-row items-center flex-wrap gap-.5em">
        <div v-for="tag in material.tags" :key="tag" class="tag">
          {{ tag }}
        </div>
      </div>
      <div v-if="material.avgRating" class="flex items-center gap-.2em">
        <div v-if="material.avgRating >= 1" i-carbon-star />
        <div v-if="material.avgRating >= 2" i-carbon-star />
        <div v-if="material.avgRating >= 3" i-carbon-star />
        <div v-if="material.avgRating >= 4" i-carbon-star />
        <div v-if="material.avgRating === 5" i-carbon-star />
        ({{ material.avgRating }})
      </div>
      <div class="flex flex-row items-center mt-a">
        <router-link v-if="material.type !== 'folder'" :to="`/materials/study/${material._id}`" class="btn">
          <div i="carbon-play" />
        </router-link>
        <div v-if="material.isSaved" i-carbon-checkmark class="ml-a" title="Материал сохранён" />
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
  width: 200px;
  /* height: max-content; */
  padding: 1em;
  gap: 1em;
  transition: box-shadow .2s;
}

.material:hover,
.material:active {
  @apply drop-shadow;
}
.tag {
  @apply rounded;
  color: white;
  background-color: var(--btn-disabled);
  font-size: .8em;
  padding: .3em .8em;
}

@media only screen and (min-width: 600px) {
  .material {
    width: 300px;
  }
}

</style>
