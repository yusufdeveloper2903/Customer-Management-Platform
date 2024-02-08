<script setup lang="ts">
//Imported files

import {newsTemplateTable} from "../constants";
import knowledgeBase from ".././store/index";
import {nextTick, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import NewsTemplateModal from "../components/modals/NewsTemplateModal.vue";
import {NewsTemplate} from "../interfaces";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";


//Declared variables
const {t} = useI18n()
const store = knowledgeBase();
const isLoading = ref(false);
const {locale} = useI18n();
const itemToDelete = ref<number | null>(null);
const dataToEdit = ref<NewsTemplate>({
  title: {
    uz: null,
    ru: null,
  },
  description: {
    uz: null,
    ru: null,
  },
  file: null,
  url: "",
});
const params = reactive({
  page: 1,
  page_size: 10,
  search: ''
})

//Functions

const refresh = async (params: any) => {
  await store.getNewsTemplate(params);
};
refresh(params)
const openModal = (isEdit?: boolean, data?: NewsTemplate) => {
  if (isEdit && data) {
    dataToEdit.value = data;
  } else {
    dataToEdit.value = {
      title: {
        uz: null,
        ru: null,
      },
      description: {
        uz: null,
        ru: null,
      },
      file: null,
      url: "",
    };
  }
  nextTick(() => {
    UIKit.modal("#news_template").show();
  });
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteNewsTemplate(itemToDelete.value)
    UIKit.modal("#global-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.newTemplate.count - 1) % params.page_size == 0) {
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
        error.response.data.msg || error.response.data.error || "Error"
    );
  }
};
const changePagination = (page: number) => {
  params.page = page;
  refresh(params);
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}

watchDebounced(() => params.search, function () {
  params.page = 1
  refresh(params)
}, {deep: true, debounce: 500, maxWait: 500,})
const handleDeleteModal = (id) => {
  itemToDelete.value = id
  UIKit.modal("#global-delete-modal").show()
};


</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input
            v-model="params.search"
            type="text"
            class="form-input"
            placeholder="Search"
        />
      </label>
      <button class="btn-primary" @click="openModal(false)">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :loading="isLoading"
        :headers="newsTemplateTable"
        :items="store.newTemplate.results"
    >
      <template #header="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="{ title }">
        {{ title[locale] }}
      </template>
      <template #item-description="{ description }">
        {{ description[locale] }}
      </template>
      <template #item-url="{ url }">
        <a :href="url" class="">{{ url }}</a>
      </template>
      <template #item-photo="{ file }">
        <div class="py-3 flex justify-center gap-3">
          <img
              v-if="file"
              class="w-[45px] h-[45px] rounded object-cover"
              :src="file"
              alt="Rounded avatar"
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon icon="Camera" color="#356c2d"/>
          </div>
        </div>
      </template>
      <template #item-actions="data">
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" @click="openModal(true, data)">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button
              class="ml-3 btn-danger btn-action"

              @click="handleDeleteModal(data.id)"
          >
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
        :total="store.newTemplate.count"
        class="mt-10 tw-pagination"
        :current="params.page"
        :per-page="params.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />
  </div>
  <DeleteModal @delete-action="deleteAction"/>
  <NewsTemplateModal :edit-data="dataToEdit" @refresh="refresh"/>
</template>
