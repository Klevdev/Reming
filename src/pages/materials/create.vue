<script lang="ts" setup>
import request from '~/composables/request'

const router = useRouter()
const { t } = useI18n()

const type = localStorage.getItem('currentMaterialType') || 'cardSet'

const selectedUsers = ref([])

const privacySettings = {
  private: {
    public: false,
    access: false,
  },
  public: {
    public: true,
    access: true,
  },
  byLink: {
    public: false,
    access: true,
  },
  byUser: {
    public: false,
    access: selectedUsers.value,
  },
}

const inputProps = {
  title: {
    type: 'text',
    required: true,
    label: 'Название',
    placeholder: 'Название',
  },
  description: {
    type: 'textarea',
    required: false,
    label: 'Описание',
    placeholder: 'Описание',
  },
}

const materialInfo = ref({
  type,
  title: '',
  description: '',
  privacy: {
    public: false,
    access: false,
  },
  tags: [],
})

const content = ref({})

const cancel = () => {
  router.go(-1)
}

const submitForms = async() => {
  const formData = {
    ...materialInfo.value,
    content: content.value,
  }

  const { data, error } = await request.post('/materials', formData)

  if (!error)
    router.push('/my-materials')
}

</script>

<template>
  <main>
    <section id="materialInfo" class="container">
      <form class="flex flex-col gap-1em max-w-45vw" @submit.prevent="">
        <Input v-model="materialInfo.title" :props="inputProps.title" />
        <Input v-model="materialInfo.description" :props="inputProps.description" />
        <select v-model="materialInfo.privacy">
          <option :value="privacySettings.private">
            Private
          </option>
          <option :value="privacySettings.public">
            Public
          </option>
          <option :value="privacySettings.byLink">
            Anyone with the link
          </option>
          <!-- <option :value="privacySettings.byUser">
            Only selected users
          </option> -->
        </select>
      </form>
    </section>
    <section id="actions" class="container pt-1em w-max flex gap-.5em">
      <button class="btn" :disabled="Object.keys(content).length < 1" @click="submitForms">
        {{ t('pages.create.btn-create') }}
      </button>
      <button class="btn" @click="cancel">
        {{ t('pages.create.btn-cancel') }}
      </button>
    </section>
    <section id="materialContent" class="container">
      <glossary-editor v-if="type === 'glossary'" v-model="content" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1em;
}

.container {
  @apply rounded;
  width: 100%;
  padding: .7em;
  background: var(--bg);
}

@media only screen and (min-width: 600px) {
  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2em;
    row-gap: 1em;
    margin-right: 3em;
  }

  #actions {
    grid-column: 1;
    grid-row: 2;
  }
}

</style>

<route lang="yaml">
meta:
  name: create
  layout: default
</route>
