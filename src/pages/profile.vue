<script setup lang="ts">

import request from '~/composables/request'
import { useUserStore } from '~/stores/user'

const router = useRouter()

const user = useUserStore()

const submitForm = async() => {
  const form = document.getElementById('form') || undefined
  const formData = new FormData(form)

  const response = await request.patch('/user/self', formData)

  if (Object.prototype.hasOwnProperty.call(response, 'error'))
    alert(response.error.message)
  else
    alert('log in again to see update')
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
      <input name="name" type="text">
      <input name="email" type="email">
      <input name="password" type="password">
      <textarea name="bio" />
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
  name: Profile
  title: Profile
  layout: default
</route>
