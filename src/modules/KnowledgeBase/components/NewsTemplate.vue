<script setup lang="ts">
import { newsTemplateTable } from "../constants";
import knowledgeBase from ".././store/index";
import { nextTick, onMounted, ref } from "vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import { useI18n } from "vue-i18n";
import UIKit from "uikit";
import NewsTemplateModal from "../components/modals/NewsTemplateModal.vue";
import { NewsTemplate } from "../interfaces";

const store = knowledgeBase();
const isLoading = ref(false);
const { locale } = useI18n();
const current = ref<number>(1);
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

// functions
const refresh = async () => {
  await store.getNewsTemplate({ page: current.value, page_size: 10 });
};

const openModal = () => {
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
  nextTick(() => {
    UIKit.modal("#news_template").show();
  });
};

// hooks
onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        Search
        <input type="text" class="form-input" placeholder="Search" />
      </label>
      <button class="btn-primary" @click="openModal">
        {{ $t("Добавить") }}
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
        {{ $t(header.text).toUpperCase() }}
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
      <template #item-photo="{ photo }">
        <div class="py-3 flex items-center gap-3">
          <img
            v-if="photo"
            class="w-[45px] h-[45px] rounded object-cover"
            :src="photo"
            alt="Rounded avatar"
          />
          <div
            v-else
            class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon icon="Camera" color="#356c2d" />
          </div>
        </div>
      </template>
      <template #item-actions>
        <div class="flex my-4">
          <button
            class="btn-warning btn-action"
            uk-toggle="target: #sms_template"
          >
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
      :total="store.newTemplate.count"
      class="mt-10 tw-pagination"
      :current="current"
      :per-page="10"
      :text-before-input="$t('go_to_page')"
      :text-after-input="$t('forward')"
      @page-changed="refresh"
    />
  </div>
  <ConfirmModal
    id="delete-template"
    :title="$t('confirmation')"
    :ok="$t('confirm')"
    :cancel="$t('cancel2')"
  >
    {{ $t("Реально хотите закрыть спринт?") }}
  </ConfirmModal>
  <NewsTemplateModal :edit-data="dataToEdit" />
  <!-- <DeleteSmsTemplate :userId="userId" @deleteSmsTemplate="deleteSmsTemplate" />

  <CreateSmsTemplate @saveSmsTemplate="saveSmsTemplate" :editData="editData" /> -->
</template>
