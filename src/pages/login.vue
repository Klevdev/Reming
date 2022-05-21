<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const user = useUserStore()
const formData = ref({
  email: '',
  password: '',
})

const submitForm = async() => {
  const { data, error } = await request.post('/user/login', formData.value)

  if (!error)
    user.login(data)
}

</script>

<template>
  <main>
    <form class="w-200px flex flex-col gap-5px" @submit.prevent="submitForm">
      <input v-model="formData.email" type="email">
      <input v-model="formData.password" type="password">

      <button class="btn">
        {{ t('pages.login.btn-submit') }}
      </button>
      <div class="mt-1em">
        <span>{{ t('pages.login.signup-text') }}
          <br>
          <router-link class="link" to="/signup">
            {{ t('pages.login.signup-link') }}
          </router-link>
        </span>
      </div>
    </form>
  </main>
</template>

<route lang="yaml">
meta:
  name: login
  layout: default
</route>

<style>
  form {
    margin: 0 auto;
    text-align: center;
  }

  @media only screen and (min-width: 600px) {
  form {
    margin: 0;
    text-align: left;
  }
  }
</style>
