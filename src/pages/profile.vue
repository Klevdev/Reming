<script setup lang="ts">

import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const { t } = useI18n()

const user = useUserStore()

const userData = reactive({})

onMounted(async() => {
  const { data, error } = await request.get('/user/self')
  if (!error) {
    userData.name = data.name
    userData.email = data.email
    userData.bio = data.bio
  }
})

const submitForm = async() => {
  const form = document.getElementById('form') || undefined
  const formData = new FormData(form)

  const { data, error } = await request.patch('/user/self', formData)

  if (!error) {
    if (data.picture)
      userData.picture = data.picture
    user.setData(userData)
  }
}

const deleteUser = async() => {
  await request.delete('/user/self')
  user.logout()
  router.push('/')
}

</script>

<template>
  <main class="flex flex-col gap-1em">
    <h2>{{ t('pages.profile.edit-info') }}</h2>
    <form id="form" class="w-200px flex flex-col gap-15px" @submit.prevent="submitForm">
      <input v-model="userData.name" name="name" type="text">
      <input v-model="userData.email" name="email" type="email">
      <input name="password" type="password">
      <textarea v-model="userData.bio" name="bio" />
      <input name="picture" type="file">
      <button class="btn">
        {{ t('pages.profile.btn-submit') }}
      </button>
    </form>

    <h2>{{ t('pages.profile.actions') }}</h2>
    <div class="w-max flex flex-col gap-1em">
      <button type="button" class="btn" @click="user.logout">
        {{ t('pages.profile.btn-logout') }}
      </button>
      <button type="button" class="btn bg-red" @click="deleteUser">
        {{ t('pages.profile.btn-delete') }}
      </button>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  name: profile
  layout: default
</route>
