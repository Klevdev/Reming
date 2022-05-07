<script setup lang="ts">
let form: HTMLFormElement | undefined
let formData: FormData

onBeforeMount(() => {
  form = document.getElementById('form') || undefined
  formData = new FormData(form)
})

const submitForm = async() => {
  const res = await fetch('http://localhost:3000/user/self', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    credentials: 'include',
    body: formData,
  })
  const response = await res.json()

  if (Object.prototype.hasOwnProperty.call(response, 'error'))
    alert(`${response.error.message}`)
  else
    alert('Profile updated successfully')
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
</template>

<route lang="yaml">
meta:
  name: Profile
  title: Profile
  layout: default
</route>
