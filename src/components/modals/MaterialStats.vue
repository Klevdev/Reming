<script lang="ts" setup>
import request from '~/composables/request'
import { datetimeToString } from '~/composables/date'
import { useLayoutStore } from '~/stores/layout'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const router = useRouter()

const bgTransparent = ref(true)
const modalTransparent = ref(true)

const close = () => {
  modalTransparent.value = true
  setTimeout(() => {
    bgTransparent.value = true
  }, 200)
  setTimeout(() => {
    layoutStore.materialStats.close()
  }, 400)
}
const statsModal = ref(null)
onClickOutside(statsModal, () => close())

const deleteStats = async() => {
  const { data, error } = await request.delete(`/studies/${layoutStore.materialStats.materialId}`)
  if (!error) {
    layoutStore.popup.show({
      message: 'Статистика материала удалена',
      type: 'info',
    })
  }
}

const materialContent = ref({})

onMounted(async() => {
  setTimeout(() => {
    bgTransparent.value = false
  }, 1)
  setTimeout(() => {
    modalTransparent.value = false
  }, 200)

  const { data, error } = await request.get(`/materials/${layoutStore.materialStats.materialId}/content`)
  if (!error)
    materialContent.value = data.definitions
})

const entries = ref([])

// onMounted(async() => {
//   const { data, error } = await request.get(`/studies/${layoutStore.materialStats.materialId}`)

//   if (!error)
//     entries = data
// })
</script>

<template>
  <div class="modal-container" :class=" {'transparent': bgTransparent}">
    <div ref="statsModal" class="modal" :class=" {'transparent': modalTransparent}">
      <div class="flex justify-between items-center">
        <h3 class="font-bold">
          {{ layoutStore.materialStats.study.materialInfo.title }} - cтатистика
        </h3>
        <button class="icon-btn" i="carbon-close" @click="close()" />
      </div>
      <div class="flex flex-col gap-1em max-h-500px overflow-y-auto ">
        <div v-for="(entry, date) in layoutStore.materialStats.study.results" :key="date">
          <div class="font-bold">
            {{ datetimeToString(parseInt(date)) }}
          </div>
          <div class="flex gap-1em overflow-x-auto w-100%">
            <div v-for="(item, index) in entry" :key="index" class="entry flex flex-col">
              <div class="text-center w-1em">
                {{ index + 1 }}
              </div>
              <div class="text-center w-1em">
                <div v-if="item.isCorrect" i-carbon-checkbox-checked class="color-green" />
                <div v-else i-carbon-checkbox-indeterminate class="color-red" />
              </div>
              <!-- <div class="min-w-100px w-35% grid items-center">
                <div class="w-100% text-left text-ellipsis text-0.8em overflow-hidden">
                  {{ materialContent[index].term.text }}
                </div>
              </div>
              <div class="min-w-100px w-35% grid items-center">
                <div class="w-100% text-left text-ellipsis text-0.8em overflow-hidden">
                  {{ materialContent[index].def.text }}
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-1em">
        <button class="btn" @click="close">
          Закрыть
        </button>
        <button class="btn danger" @click="layoutStore.confirm.open(`Вы уверены что хотете удалить записи о ${layoutStore.materialStats.study.materialInfo.title}?`, deleteStats)">
          Очистить статистику
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-container {
    padding: 60px 0;
    overflow-y: scroll;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    background-color: #00000055;
    display: grid;
    place-items: center;
    transition: background-color .2s ease-in-out;
  }

  .modal-container.transparent {
    background-color: #00000000;
  }
  .modal.transparent {
    opacity: 0;
  }

  .modal {
    @apply rounded;
    width: max-content;
    max-width: 360px;
    height: max-content;
    padding: 1em;
    background-color: var(--bg);
    display: flex;
    gap: 1em;
    flex-direction: column;
    justify-content: space-between;
    opacity: 1;
    transition: opacity .2s ease-in-out;
  }

  .materials {
    display: flex;
    flex-direction: column;
    gap: .5em;
    width: 100%;
    max-height: 250px;
    overflow-y: scroll;
  }

  .material {
    @apply rounded flex gap-1em items-center px-.5em;
    position: relative;
    min-height: 50px;
    border: 2px solid var(--border-input);
    transition: border .2s ease-in-out;
  }

  .material:hover,
  .material:active,
  .material.selected {
    cursor: pointer;
    border: 2px solid var(--primary-active);
  }

  @media only screen and (min-width: 600px) {
    .modal {
      max-width: 520px;
    }
  }
  @media only screen and (min-width: 1200px) {
    .modal {
      max-width: 690px;
    }
  }

</style>
