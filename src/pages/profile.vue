<script setup lang="ts">

import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const router = useRouter()

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
  <div class="flex flex-col gap-1em">
    <h2>Edit profile information</h2>
    <form id="form" class="w-200px flex flex-col gap-15px" @submit.prevent="submitForm">
      <input v-model="userData.name" name="name" type="text">
      <input v-model="userData.email" name="email" type="email">
      <input name="password" type="password">
      <textarea v-model="userData.bio" name="bio" />
      <input name="picture" type="file">
      <button class="btn">
        Submit
      </button>
    </form>

    <h2>Actions</h2>
    <div class="w-max flex flex-col gap-1em">
      <button type="button" class="btn" @click="user.logout">
        Log out
      </button>
      <button type="button" class="btn bg-red" @click="deleteUser">
        Delete profile
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: profile
  layout: default
</route>
