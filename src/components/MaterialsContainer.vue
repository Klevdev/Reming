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
    <router-link
      v-for="material in materials" :key="material._id"
      class="material"
      :to="`/materials/${material._id}`"
    >
      <!-- <div>{{ icons[material.type] }}</div> -->
      <span class="font-bold">{{ material.title }}</span>
      <span>{{ material.description }}</span>
      <span>{{ material.type }}</span>
      <!-- <button v-if="material.isSaved" class="btn" @click="unsave(material._id)">
        {{ t('material.unsave') }}
      </button>
      <button v-else class="btn">
        {{ t('material.save') }}
      </button> -->
    </router-link>
  </div>
</template>

<style>
  .material {
    @apply rounded;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    min-width: 200px;
    padding: 1em;
  }
</style>
