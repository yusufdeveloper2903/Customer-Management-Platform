<script setup lang="ts">

//Imported files
import UIkit from "uikit";
import {watchDebounced} from '@vueuse/core';
import knowledgeStore from "@/modules/KnowledgeBase/store";
import {nextTick, ref, watch} from "vue";
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
  search: ''
});
const oldData = ref<LocationPlace>();

const openModal = (data?) => {
  console.log(data, 'datra')
  if (data) oldData.value = data;
  else oldData.value = undefined;
  nextTick(() => {
    UIKit.modal("#location-modal").show();
  });
};
const props = defineProps<{
  knowledge: string
}>();

let toRefresh = ref(false)
watch(() => props.knowledge, function () {
  toRefresh.value = !toRefresh.value
})
const changePagination = (page: any) => {
  pagination.value.page = page;
  getListForm(pagination)
};
const onPageSizeChanged = (e: any) => {
  pagination.value.page_size = e
  pagination.value.page = 1
  getListForm(pagination)
}
watchDebounced(() => pagination.value.search, async function () {
  getListForm(pagination)
}, {deep: true, debounce: 500, maxWait: 5000,})
async function getListForm(pagination: any) {
  loading.value = true;
  await store.getAllFormsList(pagination.value);
  loading.value = false;
}

getListForm(pagination)

const deleteAction = async () => {
  loading.value = true
  try {
    await store.deleteLokation(itemForDelete.value)
    UIkit.modal("#location-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.locationList.count - 1) % pagination.page > 0) {
      pagination.value.page = pagination.value.page - 1
      getListForm(pagination)
    } else {
      getListForm(pagination)
    }
    loading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};

</script>

<template>
  <div class="card">
    <div class="flex items-end gap-2 mb-7 justify-between">
      <div class="w-1/4">
        <label for="search" class="dark:text-gray-300">
          {{ t("Search") }}
          <input
              id="search"
              type="text"
              class="form-input"
              :placeholder="t('Search')"
              v-model="pagination.search"
          />
        </label>
      </div>


      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full "
              @click="openModal()">
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
        <template #header-title="item">
          {{ $t(item.text) }}
        </template>
        <template #header-phones="item">
          {{ $t(item.text) }}
        </template>
        <template #header-region="item">
          {{ $t(item.text) }}
        </template>
        <template #header-address="item">
          {{ $t(item.text) }}
        </template>
        <template #header-actions="item">
          {{ $t(item.text) }}
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
                (itemForDelete = item.id), UIKit.modal('#location-delete-modal').show()
              "
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </template>
      </EasyDataTable>
      <TwPagination
          :restart="toRefresh"
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
    <DeleteModal @delete-action="deleteAction" id="location-delete-modal"/>
  </div>
</template>

<style>
.vue3-easy-data-table__loading-mask[data-v-19cc4b1b] {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
