<script setup lang="ts">
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'
import { useLayoutStore } from '~/stores/layout'

const router = useRouter()
const { t } = useI18n()

useHead({
  title: t('pages.login.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

const user = useUserStore()
const formData = ref({
  email: '',
  password: '',
})

const inputProps = {
  email: {
    label: t('user.email'),
    type: 'email',
    placeholder: 'examplemail@mail.com',
  },
  password: {
    label: t('user.password'),
    type: 'password',
  },
}

const submitForm = async() => {
  const { data, error } = await request.post('/user/login', formData.value)

  if (!error) {
    user.login(data)
    router.push('/')
  }
}

onBeforeMount(() => {
  if (useUserStore().loggedIn) {
    useLayoutStore().popup.show({
      message: 'Вы уже авторизованны',
      type: 'error',
    })
    router.push('/')
  }
})

</script>

<template>
  <main>
    <section class="container">
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
    </section>
  </main>
</template>

<style scoped>
.container {
  @apply rounded;
  width: max-content;
  padding: .7em;
  background: var(--bg);
  margin: 0 auto;
}
form {
  width: max-content;
  text-align: center;
}

@media only screen and (min-width: 600px) {
  .container {
    margin: 0;
  }

  form {
    text-align: left;
  }
}
</style>

<route lang="yaml">
meta:
  name: login
  layout: default
</route>
