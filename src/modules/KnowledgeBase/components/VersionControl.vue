<script setup lang="ts">

//Imported files

import {versionControlFields} from "../constants";
import knowledgeBase from ".././store/index"
import {reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import AddVersionControl from "./modals/VersionControlModal.vue"


//Declared files
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
const userId = ref<number | null>(null);

interface EditData {
  id: number | null
  number: string,
  description: string
}

const editData = ref<EditData>({
  id: null,
  number: "",
  description: ""
})

const params = reactive({
  page_size: 10,
  start_date: "",
  end_date: "",
  page: 1
});

const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteVersion(userId.value)
    UIkit.modal("#version-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (((store.versionControlList.count - 1) % params.page_size) == 0) {
      if (params.page > 1) {
        params.page = params.page - 1
        await refresh(params)
      }
    } else {
      await refresh(params)
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
const handleDeleteModal = (id: number) => {
  userId.value = id;
  UIkit.modal("#version-delete-modal").show();
};

const refresh = async (params: any) => {
  isLoading.value = true;
  try {
    await store.getVersionControl(params);
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};
refresh(params)

const changePagination = (e: number) => {
  params.page = e;
  refresh(params);
};
const saveVersionControl = () => {
  refresh(params)
}

watch(
    () => params.end_date,
    () => {
      params.page = 1
      refresh(params);

    },
);
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
</script>

<template>
  <div class="card">

    <div class="md:flex items-center justify-between mb-5">
      <form class="mb-4 md:flex items-center gap-5 md:w-9/12">

        <div class="md:w-1/2 md:m-0 mt-2">
          <label for="from" class="dark:text-gray-300">
            {{ $t("from") }}
          </label>
          <VueDatePicker v-model="params.start_date"></VueDatePicker>
        </div>

        <div class="md:w-1/2 md:m-0 mt-2">
          <label for="to" class="dark:text-gray-300">
            {{ $t("to") }}
          </label>
          <VueDatePicker v-model="params.end_date"></VueDatePicker>
        </div>
      </form>
      <button
          class="btn-primary" uk-toggle="target: #version_control" @click="editData = {}"
      >
        {{ $t("Add") }}
      </button>
    </div>


    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="versionControlFields"
                   :items="store.versionControlList.results">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header-datetime="header">
        {{ $t(header.text) }}
      </template>

      <template #header-modified_date="header">
        {{ $t(header.text) }}
      </template>

      <template #header-version_number="header">
        {{ $t(header.text) }}
      </template>

      <template #header-is_active="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #item-datetime="items">
        {{ items.created_date }}
      </template>

      <template #item-version_number="items">
        {{ items.number }}
      </template>

      <template #item-is_active="items">
        <label class="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              :checked="items.is_active"
              disabled
              class="sr-only peer"
          />
          <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"/>
        </label>
      </template>

      <template #item-actions="item">
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" uk-toggle="target: #version_control" @click="editData = item">

            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>

    </EasyDataTable>

    <TwPagination :total="store.versionControlList.count" class="mt-10 tw-pagination"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>

  </div>

  <DeleteModal @delete-action="deleteAction" :id="'version-delete-modal'"/>





  <AddVersionControl @saveVersionControl="saveVersionControl" :editData="editData"/>

</template>
