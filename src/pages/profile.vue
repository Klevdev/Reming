<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()

const submitForm = async() => {
  const form = document.getElementById('form') || undefined
  const formData = new FormData(form)

  const res = await fetch('http://localhost:3000/user/self', {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  })
  const response = await res.json()

  if (Object.prototype.hasOwnProperty.call(response, 'error'))
    alert(response.error.message)
  else
    alert('👌')
    // alert('Profile updated successfully')
}

</script>

<template>
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

  <hr>

  <button type="button" class="btn" @click="user.logout">
    Log out
  </button>
</template>

<route lang="yaml">
meta:
  name: Profile
  title: Profile
  layout: default
</route>
