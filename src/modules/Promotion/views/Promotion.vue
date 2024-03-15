<script setup lang="ts">
//Imported files
import promotionBase from '../store/index'
import {newsPromotionTable} from "../constants";
import {reactive, ref,} from "vue";
import CreatePromotionModal from "../components/CreatePromotionModal.vue"
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
//Declared variables
const {t} = useI18n()
const itemId = ref<number | null | undefined>(null);
const promotionStorage = promotionBase()
const isLoading = ref(false);
const params = reactive({
  page_size: 10,
  search: "",
  page: 1
});

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
  is_active: boolean | null,
  background_photo: null | string,
  detail_photo: null | string,
  start_date: null | string,
  end_date: null | string

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
  is_active: false,
  background_photo: null,
  detail_photo: null,
  start_date: null,
  end_date: null
})
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);
const refresh = async (val: any) => {
  isLoading.value = true;
  try {
    await promotionStorage.getPromotionList(val)
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};
refresh(params)

function saveProducts() {
  refresh(params)
}

const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const deleteAction = async () => {
  isLoading.value = true
  try {
    await promotionStorage.deletePromotion(itemId.value)
    UIkit.modal("#delete-promotion-item").hide();
    toast.success(t('deleted_successfully'));
    if ((promotionStorage.promotionList.count - 1) % params.page > 0) {
      params.page = params.page - 1
      await refresh(params)
    } else {
      await refresh(params)
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
const handleDeleteModal = (id) => {
  itemId.value = id
  UIkit.modal("#delete-promotion-item").show()
};
const onGetData = async (val) => {
  try {
    await promotionStorage.getPromotionId(val)
    editData.value = promotionStorage.promotionListId

  } catch (error) {
    toast.error(t('error'));
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" placeholder="Search" v-model="params.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #create_edit_promotion" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="newsPromotionTable"
                   :items="promotionStorage.promotionList.results">
      <template #empty-message>
        <span>{{ t("empty_text") }}</span>
      </template>

      <template #header-title="header">
        {{ $t(header.text) }}
      </template>
      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>
      <template #header-start_date="header">
        {{ $t(header.text) }}
      </template>
      <template #header-is_published="header">
        {{ $t(header.text) }}
      </template>
      <template #header-end_date="header">
        {{ $t(header.text) }}
      </template>
      <template #header-is_active="header">
        {{ $t(header.text) }}
      </template>
      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>
      <template #item-is_published="item">
        <label
            className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="item.is_published"
              class="sr-only peer"
              disabled
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </template>
      <template #item-is_active="item">
        <label
            className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="item.is_active"
              class="sr-only peer"
              disabled
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </template>
      <template #item-actions="item">
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" uk-toggle="target: #create_edit_promotion" @click="onGetData(item.id)">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="promotionStorage.promotionList.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
    <CreatePromotionModal :editData="editData" @saveProducts="saveProducts"/>
    <DeleteModal @delete-action="deleteAction" :id="'delete-promotion-item'"/>
  </div>

</template>
