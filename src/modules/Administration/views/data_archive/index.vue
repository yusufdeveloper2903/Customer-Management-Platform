<script setup lang="ts">

//Imported Files
import {headerDataArchive} from '../../constants/index'
import {administrationStore} from '../../store/index'
import UIkit from "uikit";
import {
  ref,
} from "vue"

import dayjs from 'dayjs'
import {toast} from "vue3-toastify";
import {useI18n} from 'vue-i18n';
import {watchDebounced} from '@vueuse/core';

//Declared variables

const {t} = useI18n()
const administrationStorage = administrationStore()
const isLoading = ref(false)
const isError = ref(false)
let params = ref({
  page: 1,
  search: '',
  start_date: '',
  end_date: '',
  offset: 0,
  limit: 10,
})
const deletingID = ref()

//Functions

const refresh = async () => {
  isLoading.value = true
  try {
    await administrationStorage.FETCH_BACKUP_MEDIA_LIST(params.value)
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}
refresh()

function download(url: string) {
  const url_parts = url.split('/')
  fetch(url).then(async function (t) {
    return t.blob().then(b => {
      let a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.setAttribute('download', url_parts[url_parts.length - 1])
      a.click()
    })
  })
}

const createBackup = async () => {
  isLoading.value = true
  try {
    await administrationStorage.CREATE_BACKUP_MEDIA()
    UIkit.modal("#backup-add-modal").hide();
    toast.success(t('created_successfully'));
    refresh()
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}
const deleteAction = async () => {
  isLoading.value = true
  try {
    await administrationStorage.DELETE_BACKUP_MEDIA(deletingID.value)
    UIkit.modal("#global-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    refresh()
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}
const openDeleteBackupModal = async (id) => {
  UIkit.modal("#global-delete-modal").show();
  deletingID.value = id
}
const onInput = async (event: number) => {
  params.value.page = event
  refresh()
}


watchDebounced(() => params.value.search, async function () {
  params.value.offset = 0
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})


const datePicked = async () => {
  if (params.value.start_date && params.value.end_date) {
    params.value.start_date = dayjs(params.value.start_date).format("YYYY-MM-DD")
    params.value.end_date = dayjs(params.value.end_date).format("YYYY-MM-DD")
    await refresh()
  }
  if (!params.value.start_date && !params.value.end_date) {
    await refresh()
  }
}
const onPageSizeChanged = (event: number) => {
  params.value.page = 1;
  params.value.limit = event;
  refresh();
};


</script>


<template>
  <div class="flex w-full gap-4">
    <div class="rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm w-full">


      <div class="flex items-start gap-10 w-full">
        <div class="w-full">
          <div class="flex items-center justify-between flex-wrap mb-4">
            <div class="flex items-center justify-between">
              <form>
                <label
                    for="search"
                    class="text-sm dark:text-white"
                >{{ $t('Search') }}:</label>
                <input
                    v-model="params.search"
                    id="search"
                    type="text"
                    :placeholder="$t('Search')"
                    class="form-input mb-1"
                >
              </form>


              <div class="ml-4">
                <div class="flex justify-between">
                  <label
                      for="phone"
                      class="text-sm text-gray-600 dark:text-gray-200"
                  >{{ $t('date_from') }}:
                  </label>
                </div>
                <div class="relative">
                  <VueDatePicker
                      :locale="'ru'"
                      :autoApply="true"
                      format="dd.MM.yyyy"
                      v-model="params.start_date"
                      :placeholder="$t('date_from')"
                      :enableTimePicker="false"
                      @closed="datePicked()"
                      @cleared="datePicked()"
                  ></VueDatePicker>
                </div>

              </div>


              <div class="ml-4">
                <div class="flex justify-between">
                  <label
                      for="phone"
                      class="text-sm text-gray-600 dark:text-gray-200"
                  >{{ $t('date_to') }}:
                  </label>
                </div>
                <div class="relative">
                  <VueDatePicker
                      :locale="'ru'"
                      :autoApply="true"
                      format="dd.MM.yyyy"
                      v-model="params.end_date"
                      :placeholder="$t('date_to')"
                      :enableTimePicker="false"
                      @closed="datePicked()"
                      @cleared="datePicked()"
                  ></VueDatePicker>
                </div>

              </div>


            </div>
            <button class="btn-primary mt-4" uk-toggle="target: #backup-add-modal">
              {{ $t('create_a_backup') }}
            </button>
          </div>
          <EasyDataTable
              theme-color="#7367f0"
              show-index
              buttons-pagination
              :headers="headerDataArchive"
              :loading="isLoading"
              :items="administrationStorage.back_up_media_list.results"
              hide-footer
              class="mb-3"
          >
            <template #empty-message>
              <div>{{ $t('no_available_data') }}</div>
            </template>


            <template #header-title="header">
              {{ $t(header.text) }}
            </template>

            <template #header-author="header">
              {{ $t(header.text) }}
            </template>

            <template #header-created_at="header">
              {{ $t(header.text) }}
            </template>

            <template #header-actions="header">
              {{ $t(header.text) }}
            </template>


            <template #item-author="items">
              <div class="flex justify-center" style="overflow-wrap: anywhere;">
                {{ items.author && items.author.name ? items.author.name : "" }}
              </div>
            </template>

            <template #item-title="items">
              <div class="flex justify-center" style="overflow-wrap: anywhere;">
                {{ items.title }}
              </div>
            </template>

            <template #item-created_at="items">
              <div class="flex justify-center" style="overflow-wrap: anywhere;">
                {{ dayjs(items.created_at).format("DD-MM-YYYY") }}
              </div>
            </template>

            <template #item-actions="items">
              <div class="flex justify-center">
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
              :total="administrationStorage.back_up_media_list.count"
              :per-page="params.limit"
              :text-before-input="$t('go_to_page')"
              :text-after-input="$t('forward')"
              @page-changed="onInput($event)"
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
            {{ $t('creating_a_backup') }}
          </h2>
        </div>
        <div class="uk-modal-body dark:text-gray-300">
          {{ $t('are_you_sure_you_want_to_back_up_the_media_files') }}
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
              @click="createBackup()"
          >
            {{ $t('yes') }}
            <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin"
                 v-if="isLoading">
          </button>
        </div>
      </div>
    </div>


    <DeleteModal @delete-action="deleteAction"/>
  </div>
</template>


