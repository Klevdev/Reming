<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const { t } = useI18n()
const user = useUserStore()
const formData = ref({
  email: '',
  password: '',
})

const inputProps = {
  email: {
    label: 'E-mail',
    type: 'email',
    placeholder: 'examplemail@mail.com',
  },
  password: {
    label: 'Password',
    type: 'password',
  },
}

const submitForm = async() => {
  const { data, error } = await request.post('/user/login', formData.value)

  if (!error)
    user.login(data)
}

</script>

<template>
  <main>
    <form class="w-200px flex flex-col gap-0.5em" @submit.prevent="submitForm">
      <Input v-model="formData.email" :props="inputProps.email" />
      <Input v-model="formData.password" :props="inputProps.password" />

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

<style scoped>
  form {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }

  @media only screen and (min-width: 600px) {
    form {
      width: 300px;
      margin: 0;
      text-align: left;
    }
  }
</style>

<route lang="yaml">
meta:
  name: login
  layout: default
</route>
