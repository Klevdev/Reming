<script lang="ts" setup>
import { useLayoutStore } from '~/stores/layout'

const layoutStore = useLayoutStore()

const { content: test } = defineProps({
  content: Object,
})
</script>

<template>
  <div class="flex flex-col gap-.5em">
    <h2 class="my-.5em w-max">
      Вопросы:
    </h2>
    <div id="addedContent" class="flex flex-col gap-.5em">
      <div v-for="(entry, index) in test.questions" :key="index" class="entry flex w-100% justify-between gap-1em pt-.5em">
        <div class="text-1em grid items-center">
          {{ parseInt(index) + 1 }}
        </div>
        <div class="font-bold text-1em grid items-center">
          {{ entry.question.text }}
        </div>
        <div class="text-1em flex items-center gap.5em">
          <div v-for="(option, index) in entry.options">
            {{ index + 1 }}) {{ option.text }};
          </div>
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
