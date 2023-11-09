<script setup lang="ts">
import { newsTemplateTable } from "../constants";
import knowledgeBase from ".././store/index";
import { nextTick, onMounted, ref } from "vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import { useI18n } from "vue-i18n";
import UIKit from "uikit";
import NewsTemplateModal from "../components/modals/NewsTemplateModal.vue";
import { NewsTemplate } from "../interfaces";
import { toast } from "vue3-toastify";
import { watchDebounced } from "@vueuse/core";

const store = knowledgeBase();
const isLoading = ref(false);
const { locale } = useI18n();
const current = ref<number>(1);
const search = ref<string>("");
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

// functions
const refresh = async () => {
  await store.getNewsTemplate({
    page: current.value,
    page_size: 10,
    search: search.value,
  });
};

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

const deleteTemplate = async () => {
  if (!itemToDelete.value) return;
  await store.deleteNewsTemplate(itemToDelete.value);
  UIKit.modal("#delete-template").hide();
  refresh();

  toast.success("Успешно удалено");
};

const changePagination = async (page: number) => {
  current.value = page;
  refresh();
};

// hooks
watchDebounced(() => search.value, refresh, { debounce: 600 });

onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        Search
        <input
          v-model="search"
          type="text"
          class="form-input"
          placeholder="Search"
        />
      </label>
      <button class="btn-primary" @click="openModal(false)">
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
      <template #item-photo="{ file }">
        <div class="py-3 flex items-center gap-3">
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
            <Icon icon="Camera" color="#356c2d" />
          </div>
        </div>
      </template>
      <template #item-actions="data">
        <div class="flex my-4">
          <button class="btn-warning btn-action" @click="openModal(true, data)">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button
            class="ml-3 btn-danger btn-action"
            @click="
              UIKit.modal('#delete-template').show(), (itemToDelete = data.id)
            "
          >
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
      @page-changed="changePagination"
    />
  </div>
  <ConfirmModal
    id="delete-template"
    :title="$t('Подтвердите')"
    :ok="$t('Удалить')"
    :cancel-class="'btn-success'"
    :okClass="'btn-danger'"
    :cancel="$t('Отмена')"
    @ok="deleteTemplate"
  >
    {{ $t("Реально хотите удалить шаблон?") }}
  </ConfirmModal>
  <NewsTemplateModal :edit-data="dataToEdit" @refresh="refresh" />
</template>
