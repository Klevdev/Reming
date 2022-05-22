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

const inputProps = {
  name: {
    label: 'Username',
    placeholder: 'MyUniqueName',
  },
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
  const { data, error } = await request.post('/user/signup', formData.value)

  if (!error)
    user.login(data)
}

</script>

<template>
  <main>
    <form class="w-200px flex flex-col gap-0.5em" @submit.prevent="submitForm">
      <Input v-model="formData.name" :props="inputProps.name" />
      <Input v-model="formData.email" :props="inputProps.email" />
      <Input v-model="formData.password" :props="inputProps.password" />

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
