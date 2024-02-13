<script setup lang="ts">
//Imported files

import {headerProductCard} from "../constants";
import {reactive, ref,} from "vue";
import CreateProductsDetail from "../components/CreateProductDetailModal.vue";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
import {useI18n} from 'vue-i18n'
import productStore from '../store/index'
import {useRoute} from "vue-router";

//Declared variables
const route = useRoute()
const {t} = useI18n()
const productStorage = productStore()
const isLoading = ref(false);
const itemId = ref<number | null | undefined>(null);
const params = reactive({
  page: 1,
  search: '',
  page_size: 10
})


const editData = ref({
  id: null,
  product: null,
  is_active: false,
  price: null,
  has_discount: false,
  discount_percentage: null,
  category: null
})


//Functions


const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const handleDeleteModal = (id) => {
  itemId.value = id
  UIkit.modal("#product-card-delete-modal").show()
};

const saveProducts = () => {
  refresh();
}


const refresh = async () => {
  isLoading.value = true;
  try {
    await productStorage.getProductCardsId(route.params.id)
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};
refresh()
productStorage.getProductFromKnowledgeBase({page_size: 1000})
productStorage.getProductList({page_size: 1000})
const deleteAction = async () => {
  isLoading.value = true
  try {
    await productStorage.deleteProductCard(itemId.value)
    UIkit.modal("#product-card-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (productStorage.productListCards.count - 1 && params.page > 1) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      await refresh( )
    }, {deep: true, debounce: 500, maxWait: 5000}
);

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" placeholder="Search" v-model="params.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #create_and_edit_product_detail" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="headerProductCard"
                   :items="productStorage.productListCards.results">
      <template #empty-message>
        <span>{{ $t('empty_text') }}</span>
      </template>
      <template #header-title="header">
        {{ $t(header.text) }}
      </template>
      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #item-product="item">
        {{ item.product.title[$i18n.locale] }}
      </template>

      <template #item-is_active="item">
        <label className="relative inline-flex items-center cursor-pointer">
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
      <template #item-has_discount="item">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="item.has_discount"
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
          <button class="btn-warning btn-action" uk-toggle="target: #create_and_edit_product_detail"
                  @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-2 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <DeleteModal @delete-action="deleteAction" :id="'product-card-delete-modal'"/>

    <TwPagination :total="productStorage.productListCards.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
    <CreateProductsDetail :editData="editData" @saveProducts="saveProducts"/>

  </div>
</template>
