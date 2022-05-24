<script lang="ts" setup>

const { content: cardSet } = defineProps({
  content: Object,
})
</script>

<template>
  <div class="flex flex-col gap-.5em">
    <h2 class="font-bold">
      Карточки:
    </h2>
    <div v-for="(entry, index) in cardSet.definitions" :key="index" class="entry flex w-100% justify-between gap-.25em pt-.5em">
      <div>
        {{ index }}
      </div>
      <div class="min-w-100px w-30%">
        <div class="w-100% text-left text-ellipsis overflow-hidden" :title="entry.term.text">
          {{ entry.term.text }}
        </div>
      </div>
      <div class="min-w-100px w-30%">
        <div class="w-100% text-left text-ellipsis overflow-hidden" :title="entry.def.text">
          {{ entry.def.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .entry:not(:nth-child(2)) {
    border-top: 1px solid var(--bg-back)
  }
</style>
