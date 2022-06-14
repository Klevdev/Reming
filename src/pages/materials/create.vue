<script lang="ts" setup>
import request from '~/composables/request'
import { useUserStore } from '~/stores/user'
import { useLayoutStore } from '~/stores/layout'

const router = useRouter()
const { t } = useI18n()

useHead({
  title: t('pages.create.title'),
  meta: [
    { name: 'description', content: '' },
  ],
})

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
  newTag: {
    type: 'input',
    required: false,
    label: 'Добавить тег',
    placeholder: '',
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

const newTag = ref('')
const addTag = () => {
  materialInfo.value.tags.push(newTag.value)
  newTag.value = ''
}
const deleteTag = (index) => {
  materialInfo.value.tags.splice(index, 1)
}

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

onMounted(() => {
  if (!useUserStore().loggedIn) {
    useLayoutStore().popup.show({
      message: 'Для доступа к этой странице необходимо авторизоваться',
      type: 'error',
    })
    router.go(-1)
  }
})
</script>

<template>
  <main>
    <div class="flex flex-col gap-1em ">
      <section id="materialInfo" class="container">
        <form class="flex flex-col justify-center gap-1em" @submit.prevent="">
          <Input v-model="materialInfo.title" :props="inputProps.title" />
          <Input v-model="materialInfo.description" :props="inputProps.description" />
          <label>
            <div class="mb-8px">Настройки доступа</div>
            <select v-model="materialInfo.privacy">
              <option :value="privacySettings.private">
                {{ t('material.privacy.private') }}
              </option>
              <option :value="privacySettings.public">
                {{ t('material.privacy.public') }}
              </option>
              <option :value="privacySettings.byLink">
                {{ t('material.privacy.by-link') }}
              </option>
            <!-- <option :value="privacySettings.byUser">
              {{ t('material.privacy.by-user')}}
            </option> -->
            </select>
          </label>

          <label>
            <div class="mb-8px">Добавить тег</div>
            <div class="flex gap-.5em items-center">
              <input v-model="newTag" type="text">
              <button class="btn w-max py-6px" :disabled="!newTag.length" type="button" @click="addTag">
                <div i="carbon-add" />
              </button>
            </div>
          </label>

          <label v-if="materialInfo.tags?.length">
            <div class="mb-8px">Теги</div>
            <div class="flex flex-row items-center flex-wrap gap-.5em max-w-300px">
              <div v-for="(tag, index) in materialInfo.tags" :key="index" class="tag">
                <div>{{ tag }}</div>
                <button type="button" class="icon-btn" i="carbon-close" @click="deleteTag(index)" />
              </div>
            </div>
          </label>
        </form>
      </section>
      <section id="actions" class="container pt-1em w-max flex gap-.5em mb-1em">
        <button class="btn" :disabled="Object.keys(content).length < 1" type="button" @click="submitForms">
          {{ t('pages.create.btn-create') }}
        </button>
        <button class="btn" type="button" @click="cancel">
          {{ t('pages.create.btn-cancel') }}
        </button>
      </section>
    </div>
    <section id="materialContent" class="container">
      <glossary-editor v-if="type === 'glossary'" v-model="content" />
      <card-set-editor v-if="type === 'cardSet'" v-model="content" />
      <test-editor v-if="type === 'test'" v-model="content" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
}

.container {
  @apply rounded;
  width: 100%;
  padding: .7em;
  background: var(--bg);
}

select {
  max-width: 300px;
  @apply rounded;
  /* background-color: var(--bg); */
  border: 2px solid var(--border-input);
  padding: .25em;
  transition: border .2s ease-in-out;
}

select:focus,
select:active {
  border: 2px solid var(--primary-active)
}

.tag {
  @apply rounded flex items-center gap-.2em;
  color: white;
  background-color: var(--btn-disabled);
  font-size: .8em;
  padding: .3em .8em;
}

input,
textarea {
  @apply rounded;
  outline: none;
  padding: .25em;
  width: 300px;
  background: var(--bg-back);
  border: 2px solid var(--border-input);
  transition: border .2s ease-in-out;
}

input:focus,
input:active {
  border: 2px solid var(--primary-active)
}

input:hover {
  border: 2px solid var(--primary)
}
@media only screen and (min-width: 600px) {
  main {
    flex-direction: row;
  }

  form {
    text-align: left;
  }
  main > div {
    margin-right: 2em;
  }

  #materialContent {
    width: max-content;
  }
}

@media only screen and (min-width: 1250px) {
  #materialContent {
    min-width: 762px;
  }
}

</style>

<route lang="yaml">
meta:
  name: create
  layout: default
</route>
