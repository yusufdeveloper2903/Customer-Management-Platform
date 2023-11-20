<script setup lang="ts">
import type { Header } from "vue3-easy-data-table";
import knowledgeStore from "@/modules/KnowledgeBase/store";
import { nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AddEditNearbyPlaces from "./components/AddEditNearbyPlaces.vue";
import { formatPhoneNumber } from "@/mixins/features";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import UIKit from "uikit";
import { LocationPlace } from "../../interfaces";

const { t, locale } = useI18n();

const store = knowledgeStore();

const loading = ref(false);
const itemForDelete = ref<number>();
const pagination = ref({
  page: 1,
  page_size: 10,
});
const oldData = ref<LocationPlace>();

const headers: Header[] = [
  { text: "id", value: "id" },
  { text: "title", value: "title" },
  { text: "phones", value: "phones" },
  { text: "region", value: "region" },
  { text: "address", value: "address" },
  { text: "actions", value: "actions" },
];

const openModal = (data?) => {
  if (data) oldData.value = data;
  else oldData.value = undefined;
  nextTick(() => {
    UIKit.modal("#location-modal").show();
  });
};

const changePagination = (page) => {
  pagination.value.page = page;
  getListForm();
};

const deleteForm = () => {};

async function getListForm() {
  loading.value = true;
  await store.getAllFormsList({
    page: pagination.value.page,
    limit: pagination.value.page_size,
  });
  loading.value = false;
}

onMounted(() => {
  getListForm();
});
</script>

<template>
  <div class="card">
    <div class="flex items-end gap-2 mb-6">
      <div class="w-1/4">
        <label for="search" class="dark:text-gray-300">
          {{ t("Search") }}
          <input
            id="search"
            type="text"
            class="form-input"
            :placeholder="t('Search')"
          />
        </label>
      </div>

      <!-- <div class="w-1/4">
        <label for="status" class="dark:text-gray-300">
          {{ t("Status") }}
          <v-select
            id="status"
            :options="books"
            label="title"
            class="!rounded-md mt-1"
            :placeholder="t('Status')"
          >
            <template v-slot:no-options="{ search, searching }">
              <em class="dark:text-neutral-400 text-neutral-500" style="">{{
                $t("empty_text")
              }}</em>
            </template>
          </v-select>
        </label>
      </div> -->

      <button class="btn-success ml-auto" @click="openModal()">
        {{ t("Add") }}
      </button>
    </div>

    <div>
      <EasyDataTable
        hide-footer
        theme-color="#7367f0"
        :loading="loading"
        :headers="headers"
        :items="store.locationList.results"
      >
        <template #empty-message>
          <span class="dark:text-neutral-400">{{ t("empty_text") }}</span>
        </template>

        <template #header="data">
          {{ t(data.text).toUpperCase() }}
        </template>

        <template #item-title="item">
          {{ item.title[locale] }}
        </template>

        <template #item-region="item">
          {{ item.region.name[locale] }}
        </template>

        <template #item-address="item">
          {{ item.address[locale] }}
        </template>

        <template #item-phones="item">
          <div v-for="phone in item.phones">
            {{ formatPhoneNumber(phone) }}
          </div>
        </template>

        <template #item-actions="item">
          <div class="flex my-4">
            <button class="btn-warning btn-action" @click="openModal(item)">
              <Icon icon="Pen New Square" color="#fff" size="16" />
            </button>
            <button
              class="ml-3 btn-danger btn-action"
              @click="
                (itemForDelete = item.id), UIKit.modal('#delete-form').show()
              "
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16" />
            </button>
          </div>
        </template>
      </EasyDataTable>
      <TwPagination
        :total="store.locationList.count"
        class="mt-10 tw-pagination"
        :current="pagination.page"
        :per-page="10"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagination"
      />
    </div>

    <AddEditNearbyPlaces :oldData="oldData" @refresh="getListForm" />
    <ConfirmModal
      id="delete-form"
      :title="$t('Подтвердите')"
      :ok="$t('Удалить')"
      :cancel-class="'btn-success'"
      :okClass="'btn-danger'"
      :cancel="$t('Отмена')"
      @ok="deleteForm"
    >
      {{ $t("Реально хотите удалить?") }}
    </ConfirmModal>
  </div>
</template>

<style>
.vue3-easy-data-table__loading-mask[data-v-19cc4b1b] {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
