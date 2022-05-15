<script lang="ts" setup>
const { materials } = defineProps({
  materials: Array,
})
</script>

<template>
  <div class="grid gap-4 auto-cols-max">
    <router-link v-for="material in materials" :key="material._id" class="material" :to="`/materials/${material._id}`">
      <!-- <div>{{ icons[material.type] }}</div> -->
      <span>{{ material.title }}</span>
      <span>{{ material.type }}</span>
    </router-link>
  </div>
</template>

<style>
  .material {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: var(--bg);
    padding: 1em;
  }
</style>
