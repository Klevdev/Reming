<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const user = useUserStore()
const formData = ref({
  name: '',
  email: '',
  password: '',
})

const submitForm = async() => {
  const { data, error } = await request.post('/user/signup', formData.value)

  if (!error)
    user.login(data)
}

</script>

<template>
  <main>
    <form class="w-200px flex flex-col gap-15px" @submit.prevent="submitForm">
      <input v-model="formData.name" type="text">
      <input v-model="formData.email" type="email">
      <input v-model="formData.password" type="password">

      <button class="btn">
        {{ t('pages.signup.btn-submit') }}
      </button>
      <div class="mt-1em">
        <span>{{ t('pages.signup.login-text') }}
          <br>
          <router-link class="link" to="/login">
            {{ t('pages.signup.login-link') }}
          </router-link>
        </span>
      </div>
    </form>
  </main>
</template>

<route lang="yaml">
meta:
  name: signup
  layout: default
</route>
