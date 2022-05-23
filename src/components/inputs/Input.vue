<script lang="ts" setup>

import { nanoid } from 'nanoId'

const { modelValue, props } = defineProps({
  modelValue: String,
  props: Object,
})

const id = nanoid(5)

</script>

<template>
  <!-- <div class="flex" :class="inline ? 'flex-row items-center' : 'flex-col'"> -->
  <div>
    <label v-show="props?.label" :for="id">{{ props?.label }}</label>
    <textarea
      v-if="props?.type === 'textarea'"
      :id="id"
      :value="modelValue"
      :name="props?.name"
      :placeholder="props?.placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-else
      :id="id"
      :type="props?.type || 'text'"
      :value="modelValue"
      :name="props?.name"
      :required="props?.required"
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
    width: 300px;
    background: var(--bg-back);
    border: 2px solid var(--border-input);
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

@media only screen and (min-width: 600px) {
  input {
    width: 300px;
  }
}
</style>
