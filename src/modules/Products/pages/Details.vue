<script setup lang="ts">
//IMPORTED FILES
import {headerProductCard} from "../constants";
import {onMounted, reactive, ref,} from "vue";
import CreateProductsDetail from "../components/CreateProductDetailModal.vue";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
import {useI18n} from 'vue-i18n'
import productStore from '../store/index'
import {useRoute} from "vue-router";
import {Link} from "@/modules/KnowledgeBase/interfaces";


//DECLARED VARIABLES
const currentRow = ref<Link | null>(null);
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
  product: '',
  is_active: false,
  price: '',
  has_discount: '',
  discount_percentage: '',
  category: '',
  title_ru: '',
  title_uz: '',
  title_kr: '',
})


//MOUNTED
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.page = JSON.parse(page)
  }
  if (page_size) {
    params.page_size = JSON.parse(page_size)
  }
  await refresh()
  await productStorage.getProductFromKnowledgeBase({page_size: 1000})
  await productStorage.getProductList({page_size: 1000})
});


//FUNCTIONS
const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const handleDeleteModal = (id: number) => {
  itemId.value = id
  UIkit.modal("#product-card-delete-modal").show()
};
const saveProducts = () => {
  refresh();
}
const refresh = async () => {
  isLoading.value = true;
  try {
    await productStorage.getProductCardsId({...params, category: route.params.id})
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};

const deleteAction = async () => {
  isLoading.value = true
  try {
    await productStorage.deleteProductCard(itemId.value)
    await UIkit.modal("#product-card-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (productStorage.productListCards.count > 1 && ((productStorage.productListCards.count - 1) % params.page_size == 0)) {
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
      localStorage.setItem('page', '1')

      await refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);


const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};

const dragDrop = async (item: Link) => {
  event?.preventDefault();
  await productStorage.DRAG_DROP_PRODUCTS_CARDS({id1: currentRow.value?.id, id2: item.id, category_id: route.params.id})
  await refresh()
  toast.success(t("updated_successfully"));
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <label for="search">
        {{ $t('Search') }}
        <input type="text" class="form-input" v-model="params.search"/>
      </label>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              uk-toggle="target: #create_and_edit_product_detail" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th v-for="field in headerProductCard"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
          {{ t(`${field.text}`) }}

        </th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="item in productStorage.productListCards.results" :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item.product['title_' + $i18n.locale] }}</td>
        <td class="px-6 whitespace-no-wrap text-left">
          {{ (`${item.price}`).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' So`m' }}
        </td>
        <td class="px-6 whitespace-no-wrap text-left">
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
        </td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item.category }}</td>


        <td class="px-6 whitespace-no-wrap text-left">
          <span v-if="item.discount_percentage">
            {{ item.discount_percentage }}
          </span>
          <span v-else>
           {{ $t('noDiscount') }}
         </span>

        </td>


        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-left">
            <div class="flex my-4 justify-center">
              <button class="btn-warning btn-action" uk-toggle="target: #create_and_edit_product_detail"
                      @click="editData = item">
                <Icon icon="Pen New Square" color="#fff" size="16"/>
              </button>
              <button class="ml-2 btn-danger btn-action" @click="handleDeleteModal(item.id)">
                <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
              </button>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="empty_table" v-if="!productStorage.productListCards.results.length">{{ $t('no_available_data') }}</div>

    <DeleteModal @delete-action="deleteAction" :id="'product-card-delete-modal'"/>

    <TwPagination :total="productStorage.productListCards.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>
    <CreateProductsDetail :editData="editData" @saveProducts="saveProducts"/>

  </div>
</template>
