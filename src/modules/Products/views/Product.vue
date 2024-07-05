<script setup lang="ts">


//IMPORTED FILES
import {headerProduct} from "../constants";
import {onMounted, reactive, ref,} from "vue";
import CreateProducts from "../components/CreateProductModal.vue";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
import {useI18n} from 'vue-i18n'
import productStore from '../store/index'
import DoubleRight from "@/modules/Users/img/double-right-chevron-svgrepo-com.svg";
import {useRouter} from "vue-router";
import {Link} from "@/modules/KnowledgeBase/interfaces";
import {formatDate} from "@/mixins/features";


//DECLARED VARIABLES
const router = useRouter()
const {t} = useI18n()
const productStorage = productStore()
const isLoading = ref(false);
const itemId = ref<number | null | undefined>(null);
const params = reactive({
  page: 1,
  search: '',
  page_size: 10,
  status: null
})
const currentRow = ref<Link | null>(null);
const editData = ref({
  id: null,
  title_ru: '',
  title_uz: '',
  title_kr: '',
  is_active: false
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
//WATCHERS
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      localStorage.setItem('page', '1')

      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);
watchDebounced(
    () => params.status,
    async () => {
      params.page = 1;
      localStorage.setItem('page', '1')
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);

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
  await refresh(params)
});

//FUNCTIONS
const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const handleDeleteModal = (id: any) => {
  itemId.value = id
  UIkit.modal("#product-main-delete-modal").show()
};

const saveProducts = () => {
  refresh(params);
}
const refresh = async (params: any) => {
  isLoading.value = true;
  try {
    await productStorage.getProductList(params)
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await productStorage.deleteProductItem(itemId.value)
    await UIkit.modal("#product-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (productStorage.productListCategory.count > 1 && ((productStorage.productListCategory.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      refresh(params)
    } else {
      refresh(params)
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};

const showDetailPage = (item: any) => {
  router.push({name: 'product-details', params: {id: item.id}})
};

const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};
const changeName = (val: any) => {
  if (val === 'ACTIVE') {
    return t('Active')
  } else if (val === 'DRAFT') {
    return t('Draft')
  } else {
    return t('Finished')
  }
}
const dragDrop = async (item: Link) => {
  event?.preventDefault();
  await productStorage.DRAG_DROP_PRODUCTS({id1: currentRow.value?.id, id2: item.id})
  await refresh(params)
  toast.success(t("updated_successfully"));
};
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
              uk-toggle="target: #create_and_edit_category" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th v-for="field in headerProduct"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
          {{ t(`${field.text}`) }}

        </th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="item in productStorage.productListCategory.results" :key="item.id" :loading="isLoading"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">

        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item['title_' + $i18n.locale] }}</td>
        <td class="pr-9 whitespace-no-wrap  text-center">
          {{ item.active_products_count }}
        </td>
        <td class="pr-9  whitespace-no-wrap text-center">{{ item.inactive_products_count }}</td>
        <td class="px-6 whitespace-no-wrap text-left"> <span
            :class="changeColor(item.status)" class="rounded  px-4 p-1 pt-1 inline  text-white"
        >
       {{ changeName(item.status) }}
       </span>
        </td>
        <td class="px-6 whitespace-no-wrap text-left">{{ formatDate(item.created_at) }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ formatDate(item.updated_at) }}</td>


        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-left">
            <button @click="showDetailPage(item)" class="btn-success btn-action mr-2">
              <img :src="DoubleRight"
                   alt="Icon">
            </button>

            <button class="btn-warning btn-action" uk-toggle="target: #create_and_edit_category"
                    @click="editData = item">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button class="ml-2 btn-danger btn-action" @click="handleDeleteModal(item.id)">
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>

      </tbody>

    </table>
    <div class="empty_table" v-if="!productStorage.productListCategory.results.length">{{
        $t('no_available_data')
      }}
    </div>


    <DeleteModal @delete-action="deleteAction" :id="'product-main-delete-modal'"/>

    <TwPagination :total="productStorage.productListCategory.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
    <CreateProducts :editData="editData" @saveProducts="saveProducts"/>

  </div>
</template>
