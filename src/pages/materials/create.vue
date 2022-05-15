<script lang="ts" setup>
import request from '~/composables/request'

const router = useRouter()

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

const materialInfo = ref({
  type: 'glossary',
  title: '',
  description: '',
  privacy: {
    public: false,
    access: false,
  },
  tags: [],
})

const newContentEntry = ref({
  term: {
    text: '',
  },
  def: {
    text: '',
  },
})

const content = ref({})
let contentLastIdx = 0

const addEntry = () => {
  content.value[contentLastIdx] = {
    term: newContentEntry.value.term,
    def: newContentEntry.value.def,
  }
  contentLastIdx++
  newContentEntry.value.term = {
    text: '',
  }
  newContentEntry.value.def = {
    text: '',
  }
}

const cancel = () => {
  router.go(-1)
}

const submitForms = async() => {
  const formData = {
    ...materialInfo.value,
    content: {
      definitions: content.value,
    },
  }

  const { data, error } = await request.post('/materials', formData)

  if (!error)
    router.push('/my-materials')
}

</script>

<template>
  <main>
    <section class="max-w-45vw">
      <h2>Material information</h2>
      <form class="flex flex-col gap-1em max-w-300px border" @submit.prevent="">
        <input v-model="materialInfo.title" type="text">
        <input v-model="materialInfo.description" type="text">
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
          <option :value="privacySettings.byUser">
            Only selected users
          </option>
        </select>
      </form>
      <div id="actions" class="pt-1em border w-max">
        <button class="btn" :disabled="Object.keys(content).length < 1" @click="submitForms">
          Create
        </button>
        <button class="btn" @click="cancel">
          Cancel
        </button>
      </div>
    </section>
    <section class="max-w-45vw">
      <h2>Material content</h2>
      <form class="flex flex-col gap-1em max-w-300px border" @submit.prevent="addEntry">
        <input v-model="newContentEntry.term.text" type="text">
        <input v-model="newContentEntry.def.text" type="text">
        <button class="btn">
          Add
        </button>
      </form>
      <div id="addedContent" class="border w-max">
        <div v-for="entry in content" :key="entry" class="border grid grid-cols-2 gap-1em">
          <div class="w-max">
            <span>{{ entry.term.text }}</span>
          </div>
          <div class="w-max">
            <span>{{ entry.def.text }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
  margin-right: 1em;
}

</style>

<route lang="yaml">
meta:
  name: create
  template: default
</route>
