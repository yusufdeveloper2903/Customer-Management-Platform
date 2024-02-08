<script setup lang="ts">

//Imported files

import knowledgeStore from "@/modules/KnowledgeBase/store";
import {nextTick, ref} from "vue";
import {useI18n} from "vue-i18n";
import AddEditNearbyPlaces from "./components/AddEditNearbyPlaces.vue";
import {formatPhoneNumber} from "@/mixins/features";
import UIKit from "uikit";
import {LocationPlace} from "../../interfaces";
import {toast} from "vue3-toastify";
import {headerPlaces} from '../../constants/index'

//Declared variable

const {t, locale} = useI18n();
const store = knowledgeStore();
const loading = ref(false);
const itemForDelete = ref<number>();
const pagination = ref({
  page: 1,
  page_size: 10,
});
const oldData = ref<LocationPlace>();

const openModal = (data?) => {
  if (data) oldData.value = data;
  else oldData.value = undefined;
  nextTick(() => {
    UIKit.modal("#location-modal").show();
  });
};

const changePagination = (page: any) => {
  pagination.value.page = page;
  getListForm(pagination)
};
const onPageSizeChanged = (e: any) => {
  pagination.value.page_size = e
  pagination.value.page = 1
  getListForm(pagination)
}

async function getListForm(pagination: any) {
  loading.value = true;
  await store.getAllFormsList(pagination);
  loading.value = false;
}

const deleteAction = async () => {
  loading.value = true
  try {
    await store.deleteVersion(userId.value)
    UIkit.modal("#global-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.locationList.count - 1) % pagination.value.page_size == 0) {
      if (pagination.value.page > 1) {
        pagination.value.page = pagination.value.page - 1
        await getListForm(pagination)
      } else {
        pagination.page = 1
        await getListForm(pagination)
      }

    }
    loading.value = false
  } catch (error: any) {
    toast.error(
        error.response.data.msg || error.response.data.error || "Error"
    );
  }
};

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


      <button class="btn-success ml-auto" @click="openModal()">
        {{ t("Add") }}
      </button>
    </div>

    <div>
      <EasyDataTable
          hide-footer
          theme-color="#7367f0"
          :loading="loading"
          :headers="headerPlaces"
          :items="store.locationList.results"
      >
        <template #empty-message>
          <span>{{ t("empty_text") }}</span>
        </template>

        <template #header="data">
          {{ t(data.text) }}
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
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                class="ml-3 btn-danger btn-action"
                @click="
                (itemForDelete = item.id), UIKit.modal('#delete-form').show()
              "
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </template>
      </EasyDataTable>
      <TwPagination
          :total="store.locationList.count"
          class="mt-10 tw-pagination"
          :current="pagination.page"
          :per-page="pagination.page_size"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagination"
          @per-page-changed="onPageSizeChanged"
      />
    </div>

    <AddEditNearbyPlaces :oldData="oldData" @refresh="getListForm"/>
    <DeleteModal @delete-action="deleteAction"/>
  </div>
</template>

<style>
.vue3-easy-data-table__loading-mask[data-v-19cc4b1b] {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
