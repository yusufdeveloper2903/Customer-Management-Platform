<script setup lang="ts">
//Imported files

import {locationFields} from "../constants";
import knowledgeBase from ".././store/index"
import {reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import CreateSmsTemplate from "./modals/CreateSmsTemplateModal.vue"
import {useI18n} from "vue-i18n";
import {watchDebounced} from "@vueuse/core";

//Declared variables
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
let smsTemplateList = ref<object[]>([]);
const userId = ref<number | null>(null);

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
  description: {
    uz: string,
    ru: string
  },
}


const editData = ref<EditData>({
  id: null,
  title: {
    uz: "",
    ru: ""
  },
  description: {
    uz: "",
    ru: ""
  },
})


const params = reactive({
  page_size: 10,
  search: "",
  page: 1
});

const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteSmsTemplate(userId.value);
    UIkit.modal("#global-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.smsTemplateList.count - 1) % params.page_size == 0) {
      if (params.page > 1) {
        params.page = params.page - 1
        await refresh(params)
      } else {
        params.page = 1
        await refresh(params)
      }

    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
}
const handleDeleteModal = (id) => {
  UIkit.modal("#global-delete-modal").show();
  userId.value = id;

};


watchDebounced(() => params.search, async function () {
  params.page = 1
  await refresh(params)
}, {deep: true, debounce: 500, maxWait: 5000,})


const refresh = async (filter: any) => {
  isLoading.value = true;
  try {
    await store.getSmsTemplate(filter);
    smsTemplateList.value = store.smsTemplateList.results;
  } catch (error: any) {
    toast.error(
        error.response || "Error"
    );
  }

  isLoading.value = false;
};
refresh(params)

const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const saveSmsTemplate = () => {
  refresh(params)
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" placeholder="Search"
               v-model="params.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #sms_template" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="locationFields"
                   :items="smsTemplateList" show-index>

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header-title="header">
        {{ $t(header.text) }}
      </template>

      <template #header-description="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>

      <template #item-description="item">
        {{ item.description[$i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" uk-toggle="target: #sms_template" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>
    <TwPagination :total="store.smsTemplateList.count" class="mt-10 tw-pagination"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
  </div>

  <DeleteModal
      @delete-action="deleteAction"/>

  <CreateSmsTemplate @saveSmsTemplate="saveSmsTemplate" :editData="editData"/>
</template>
