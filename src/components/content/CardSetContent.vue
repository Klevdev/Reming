<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'

const layoutStore = useLayoutStore()

const { content: cardSet } = defineProps({
  content: Object,
})
</script>

<template>
  <div class="flex flex-col gap-.5em">
    <h2 class="font-bold">
      Карточки:
    </h2>
    <div v-for="(entry, index) in cardSet.definitions" :key="index" class="entry flex w-100% justify-between pt-.5em">
      <div class="text-0.8em grid items-center">
        {{ index }}
      </div>
      <div class="min-w-100px w-35% grid items-center">
        <div class="w-100% text-left text-ellipsis text-0.8em overflow-hidden" :title="entry.term.text">
          {{ entry.term.text }}
        </div>
        <div v-if="entry.term.asset?.value._id" class="asset" @click="layoutStore.assetView.open(entry.term.asset.value._id)">
          <div i-carbon-document-attachment />
          {{ entry.term.asset.value.title }}
        </div>
      </div>
      <div class="min-w-100px w-35% grid items-center">
        <div class="w-100% text-left text-ellipsis text-0.8em overflow-hidden" :title="entry.def.text">
          {{ entry.def.text }}
        </div>
        <div v-if="entry.def.asset?.value._id" class="asset" @click="layoutStore.assetView.open(entry.def.asset.value._id)">
          <div i-carbon-document-attachment />
          {{ entry.def.asset.value.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .entry:not(:nth-child(2)) {
    border-top: 1px solid var(--bg-back)
  }
  .asset {
    @apply flex items-center gap-.3em text-0.8em;
  }
</style>
