<script lang="ts" setup>

import { nanoid } from 'nanoId'

const { modelValue, props } = defineProps({
  modelValue: String,
  props: Object,
  inline: Boolean,
})

const id = nanoid(5)

</script>

<template>
  <!-- <div class="flex" :class="inline ? 'flex-row items-center' : 'flex-col'"> -->
  <div>
    <label v-show="props?.label" :for="id">{{ props?.label }}</label>
    <input
      :id="id"
      :class="`w-${props?.width || 200}px`"
      :type="props?.type || 'text'"
      :value="modelValue"
      :name="props?.name"
      :placeholder="props?.placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<style scoped>
  label {
    display: block;
    margin-bottom: .5em;
    margin-right: .5em;
  }
  input,
  textarea {
    @apply rounded;
    outline: none;
    padding: .25em;
    background: var(--bg-input);
    border: 2px solid var(--bg);
    transition: border .2s ease-in-out;
  }

  input:focus,
  input:active,
  textarea:focus,
  textarea:active {
    border: 2px solid var(--primary-active)
  }
  input:hover,
  textarea:hover {
    border: 2px solid var(--primary)
  }
</style>
