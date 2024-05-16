<script setup lang="ts">


//IMPORTED FILES
import administrationStore from '../../store/index'
import {onMounted, ref, watch} from "vue"
import {headerBackUp} from "../../constants/index";
import dayjs from 'dayjs'
import {toast} from "vue3-toastify";
import {useI18n} from 'vue-i18n';
import {watchDebounced} from '@vueuse/core';
import UIkit from "uikit";
import VueDatePicker from "@vuepic/vue-datepicker";


//DECLARED VARIABLES
const {t} = useI18n()
const dateConfig = ref({})
const administrationStorage = administrationStore()
const isLoading = ref(false)
const isError = ref(false)
let params = ref({
  page: 1,
  limit: 10,
  search: null,
  start_date: '',
  end_date: '',
  offset: 0,
})
const deletingID = ref()


//MOUNTED
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.value.page = JSON.parse(page)
  }
  if (page_size) {
    params.value.limit = JSON.parse(page_size)
  }
  await refresh()

});


//FUNCTIONS
const refresh = async () => {
  isLoading.value = true
  try {
    await administrationStorage.FETCH_BACKUP_LIST(params.value)
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}

function download(url: string) {
  const url_parts = url.split('/')
  fetch(url).then(async function (t) {
    return t.blob().then(b => {
      var a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.setAttribute('download', url_parts[url_parts.length - 1])
      a.click()
    })
  })
}

const createBackup = async () => {
  isLoading.value = true
  try {
    await administrationStorage.CREATE_BACKUP()
    await UIkit.modal("#backup-add-modal").hide();
    refresh()
    toast.success(t('created_successfully'));
    isLoading.value = false
  } catch (error) {
    isError.value = true
    toast.error(t('error'));

  }
}

const deleteAction = async () => {
  isLoading.value = true
  try {
    await administrationStorage.DELETE_BACKUP(deletingID.value)
    await UIkit.modal("#backup-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (administrationStorage.back_up_list.count > 1 && ((administrationStorage.back_up_list.count - 1) % params.value.limit == 0)) {
      params.value.page = params.value.page - 1
      await refresh()
    } else {
      await refresh()
    }

    isLoading.value = false
  } catch (error) {
    isError.value = true
    toast.error(t('error'));

  }
}


const openDeleteBackupModal = async (id: any) => {
  UIkit.modal("#backup-delete-modal").show();
  deletingID.value = id
}
const onInput = (event: number) => {
  params.value.page = event
  refresh()
}
const onInputTo = (event: number) => {
  params.value.page = event
  refresh()
}


const datePicked = async () => {
  if (params.value.start_date && params.value.end_date) {
    params.value.offset = 0
    params.value.page = 1
    params.value.start_date = dayjs(params.value.start_date).format("YYYY-MM-DD")
    params.value.end_date = dayjs(params.value.end_date).format("YYYY-MM-DD")
    refresh()
  }
  if (!params.value.start_date && !params.value.end_date) {
    params.value.offset = 0
    refresh()
  }
}


const onPageSizeChanged = (event: number) => {
  params.value.page = 1;
  params.value.limit = event;
  refresh();
};


//WATCHERS
watchDebounced(() => params.value.search, async function () {
  params.value.offset = 0
  params.value.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watchDebounced(() => params.value.start_date, async function () {
  params.value.offset = 0
  params.value.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})


watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        if (!value) {
          params.value.start_date = ""
          params.value.end_date = ""
        } else {
          params.value.start_date = started_date.split('T')[0]
          params.value.end_date = end_date.split('T')[0]
        }
      } else {
        params.value.start_date = ""
        params.value.end_date = ""
      }
    }
)
</script>


<template>
  <div class="flex w-full gap-4">
    <div class="rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm w-full">


      <div class="flex items-start gap-10 w-full">
        <div class="w-full">
          <div class="flex items-end justify-between flex-wrap mb-7 ">
            <div class="flex items-center  md:w-4/12">
              <form>
                <label
                    for="search"
                    class="text-sm dark:text-white"
                >{{ $t('Search') }}:</label>
                <input
                    v-model="params.search"
                    id="search"
                    type="text"
                    class="form-input mb-1"
                >
              </form>


              <div class="ml-4 md:w-7/12 ">
                <label class="dark:text-gray-300">
                  {{ $t("date_from") + ' - ' + $t("date_to") }}
                </label>
                <VueDatePicker :enableTimePicker="false" auto-apply :range="{ partialRange: false }"
                               v-model="dateConfig"/>
              </div>


            </div>
            <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full "
                    uk-toggle="target: #backup-add-modal">
              {{ $t('create_a_backup') }}
            </button>
          </div>
          <EasyDataTable
              theme-color="#7367f0"
              :headers="headerBackUp"
              :loading="isLoading"
              :items="administrationStorage.back_up_list.results"
              hide-footer
              class="mb-3"
          >

            <template #empty-message>
              <div>{{ $t('no_available_data') }}</div>
            </template>
            <template #header="header">
              {{ $t(header.text) }}
            </template>
            <template #item-author="items">
              <div class="flex justify-left" style="overflow-wrap: anywhere;">
                {{ items.author && items.author.name ? items.author.name : "" }}
              </div>
            </template>

            <template #item-title="items">
              <div class="flex justify-left" style="overflow-wrap: anywhere;">
                {{ items.title }}
              </div>
            </template>


            <template #item-created_at="items">
              <div class="flex justify-left" style="overflow-wrap: anywhere;">
                {{ dayjs(items.created_at).format("DD-MM-YYYY") }}
              </div>
            </template>
            <template #header-actions="item">
              <div class="flex justify-end">
                {{ $t(item.text) }}
              </div>
            </template>
            <template #item-actions="items">
              <div class="flex justify-end">
                <button
                    class="btn-warning btn-action ml-2"
                    @click="download(items.file_path)"
                >
                    <span
                        class="block cursor-pointer"
                        uk-icon="icon: cloud-download; ratio: 0.8;"
                    />
                </button>
                <button class="btn-danger btn-action ml-2" @click="openDeleteBackupModal(items.id)">
                  <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
                </button>
              </div>
            </template>
          </EasyDataTable>
          <TwPagination
              class="tw-pagination"
              :current="params.page"
              :total="administrationStorage.back_up_list.count"
              :per-page="params.limit"
              :text-before-input="$t('go_to_page')"
              :text-after-input="$t('forward')"
              @page-changed="onInput"
              @page-to="onInputTo"
              @per-page-changed="onPageSizeChanged"
          />
        </div>
      </div>


    </div>

    <div
        id="backup-add-modal"
        class="uk-flex-top"
        uk-modal
    >
      <div class="uk-modal-dialog uk-margin-auto-vertical overflow-hidden rounded-md dark:bg-darkLayoutStorm">
        <button
            class="uk-modal-close-default"
            type="button"
            uk-close
        />
        <div class="uk-modal-header dark:bg-darkLayoutMain">
          <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b] dark:text-white">
            {{ $t('create_a_backup') }}
          </h2>
        </div>
        <div class="uk-modal-body dark:text-gray-300">
          {{ $t('are_you_sure_you_want_to_back_up_the_database') }}
        </div>
        <div class="uk-modal-footer uk-text-right bg-white px-5 py-3 dark:bg-darkLayoutMain">
          <button
              uk-toggle="target: #backup-add-modal"
              class="mr-4 rounded-md bg-danger px-6 py-2 text-white duration-100 hover:opacity-90"
          >
            {{ $t('no') }}
          </button>
          <button
              class="rounded-md bg-primary px-6 py-2 text-white duration-100 hover:opacity-90"
              @click="createBackup"
              :disabled="isLoading"
          >
            {{ $t('yes') }}
            <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin"
                 v-if="isLoading">
          </button>
        </div>
      </div>
    </div>
    <div
        id="backup-delete-modal"
        class="uk-flex-top"
        uk-modal
    >
      <div class="uk-modal-dialog uk-margin-auto-vertical overflow-hidden rounded-md dark:bg-darkLayoutStorm">
        <button
            class="uk-modal-close-default"
            type="button"
            uk-close
        />
        <div class="uk-modal-header dark:bg-darkLayoutMain">
          <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b] dark:text-white">
            {{ $t('deletion_of_backup') }}
          </h2>
        </div>
        <div class="uk-modal-body dark:text-gray-300">
          {{ $t('are_you_sure_you_want_to_back_up_the_database') }}
        </div>
        <div class="uk-modal-footer uk-text-right bg-white px-5 py-3 dark:bg-darkLayoutMain">
          <button
              uk-toggle="target: #backup-delete-modal"
              class="mr-4 rounded-md bg-danger px-6 py-2 text-white duration-100 hover:opacity-90"
          >
            {{ $t('no') }}
          </button>
          <button
              class="rounded-md bg-primary px-6 py-2 text-white duration-100 hover:opacity-90"
              :disabled="isLoading"
          >
            {{ $t('yes') }}
            <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin"
                 v-if="isLoading">
          </button>
        </div>
      </div>
    </div>

    <DeleteModal @delete-action="deleteAction" id="backup-delete-modal"/>
  </div>
</template>

