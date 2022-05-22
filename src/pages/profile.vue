<script setup lang="ts">

import request from '~/composables/request'
import { isDark, toggleDark } from '~/composables'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const { t, availableLocales, locale } = useI18n()

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

const inputProps = {
  name: {
    label: 'Username',
    placeholder: userData.name,
  },
  email: {
    label: 'E-mail',
    type: 'email',
    placeholder: userData.email,
  },
  password: {
    label: 'Password',
    type: 'password',
    placeholder: userData.password,
  },
  bio: {
    label: 'About',
    type: 'textarea',
    placeholder: 'Write something',
  },
}

const editInfo = async() => {
  const { data, error } = await request.patch('/user/self', userData)

  if (!error)
    user.setData(userData)
}

const editPicture = async() => {
  const form = document.getElementById('pictureForm') || undefined
  const formData = new FormData(form)

  const { data, error } = await request.patch('/user/picture', formData)

  if (!error)
    user.setPicture(data.picture)
}

const deleteUser = async() => {
  await request.delete('/user/self')
  user.logout()
  router.push('/')
}

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

</script>

<template>
  <main class="flex flex-col gap-1em">
    <section>
      <h2>{{ t('pages.profile.edit-info') }}</h2>
      <form class="flex flex-col gap-15px" @submit.prevent="editInfo">
        <Input v-model="userData.name" :props="inputProps.name" />
        <Input v-model="userData.email" :props="inputProps.email" />
        <Input v-model="userData.password" :props="inputProps.password" />
        <Input v-model="userData.bio" :props="inputProps.bio" />
        <button class="btn">
          {{ t('pages.profile.btn-submit') }}
        </button>
      </form>
    </section>
    <section>
      <h2>{{ t('pages.profile.edit-picture') }}</h2>
      <form id="pictureForm" class="flex flex-col gap-15px" @submit.prevent="editPicture">
        <input name="picture" type="file">
        <button class="btn">
          {{ t('pages.profile.btn-submit') }}
        </button>
      </form>
    </section>
    <section>
      <h2>{{ t('pages.profile.settings') }}</h2>
      <div class="w-max flex flex-col gap-1em">
        <div class="flex gap-1em items-center">
          <span>{{ t('settings.toggle-color') }}</span>
          <button class="btn h-2em flex justify-center items-center w-max" @click.stop.prevent="toggleDark">
            <div i="carbon-sun dark:carbon-moon" />
          </button>
        </div>
        <div class="flex gap-1em items-center">
          <span>{{ t('settings.change-lang') }}</span>
          <button class="btn flex justify-center items-center w-max" @click.stop.prevent="toggleLocales">
            {{ locale }}
          </button>
        </div>
      </div>
    </section>
    <section>
      <h2>{{ t('pages.profile.actions') }}</h2>
      <div class="w-max flex flex-col gap-1em">
        <button type="button" class="btn" @click="user.logout">
          {{ t('pages.profile.btn-logout') }}
        </button>
        <button type="button" class="btn danger" @click="deleteUser">
          {{ t('pages.profile.btn-delete') }}
        </button>
      </div>
    </section>
  </main>
</template>

<route lang="yaml">
meta:
  name: profile
  layout: default
</route>

<style scoped>
  section {
    width: max-content;
    margin: 0 auto;
  }
h2 {
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
}
form {
  width: 300px;
}

@media only screen and (min-width: 600px) {
  h2 {
    text-align: left;
  }
  form {
    width: 300px;
  }
  section {
    margin: 0;
  }
}
</style>
