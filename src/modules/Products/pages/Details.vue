<script setup lang="ts">
//IMPORTED FILES
import {headerProductCard} from "../constants";
import {nextTick, onMounted, reactive, ref,} from "vue";
import CreateProductsDetail from "../components/CreateProductDetailModal.vue";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
import {useI18n} from 'vue-i18n'
import productStore from '../store/index'
import {useRoute} from "vue-router";
import {Link} from "@/modules/KnowledgeBase/interfaces";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";


//DECLARED VARIABLES
const currentRow = ref<Link | null>(null);
const route = useRoute()
const {t} = useI18n()
const productStorage = productStore()
const isLoading = ref(false);
const itemId = ref<number | null | undefined>(null);
const image = ref<string>("");
const imageCard = ref();
const params = reactive({
  page: 1,
  search: '',
  page_size: 10,
  status: ''
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
const listStatus = ref([
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Draft',
    value: 'DRAFT'
  },
  {
    title: 'Finished',
    value: 'FINISHED'
  }
])
const changeColor = (val: string) => {
  if (val == 'ACTIVE') {
    return t('bg-success')
  } else if (val == 'DRAFT') {
    return t('bg-warning')
  } else {
    return t('bg-secondary')
  }
}
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
  await productStorage.getProductList({page_size: 1000})
});


//FUNCTIONS
const changeName = (val) => {
  if (val === 'ACTIVE') {
    return t('Active')
  } else if (val === 'DRAFT') {
    return t('Draft')
  } else {
    return t('Finished')
  }
}
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
const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#file-show-product-image").show();
  });
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
watchDebounced(
    () => params.status,
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
      <div class="flex justify-center gap-3 w-1/3">
        <div class="w-1/3  mt-[0.10rem]">
          <label for="search">
            {{ $t('Search') }}
          </label>

          <input type="text" class="form-input" v-model="params.search"/>
        </div>

        <div class="w-2/3">
          <label class="dark:text-gray-300 ">
            {{ $t("Status") }}
          </label>

          <v-select
              :options="listStatus"
              v-model="params.status"
              :getOptionLabel="(name:any) => t(name.title)"
              :reduce="(item:any) => item.value"
          >
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
        </div>

      </div>
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
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)"
      >
        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left ">
          <div class="py-3 flex justify-left gap-3">
            <img
                v-if="item.product && item.product.image"
                class="w-[45px] h-[45px] rounded"
                :src="item.product.image"
                alt="Rounded avatar"
                @click="onShowFile(item.product.image)"
                style="aspect-ratio: 1/1 "
            />
            <div
                v-else
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

          </div>
        </td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item.product['title_' + $i18n.locale] }}</td>
        <td class="px-6 whitespace-no-wrap text-left">
          {{ (`${item.discount_price}`).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' So`m' }}
        </td>
        <td class="px-6 whitespace-no-wrap text-left">
       <span
           :class="changeColor(item.status)" class="rounded  px-4 p-1 pt-1 inline  text-white"
       >
  {{ changeName(item.status) }}
      </span>
        </td>


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
    <div role="status" v-if="isLoading" class="flex justify-center mt-4">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
           viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"/>
        <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"/>
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
    <div class="empty_table" v-if="!isLoading && !productStorage.productListCards.results.length">
      {{ $t('no_available_data') }}
    </div>

    <DeleteModal @delete-action="deleteAction" :id="'product-card-delete-modal'"/>

    <TwPagination :total="productStorage.productListCards.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>
    <CreateProductsDetail :editData="editData" @saveProducts="saveProducts"/>
    <ShowFileModal :image="image" ref="imageCard" id="file-show-product-image"/>
  </div>
</template>

