<script setup lang="ts">
//Imported files
import {reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {productsFields} from "../constants";
import CreateProducts from "./modals/CreateProductsModal.vue";
import knowledgeBase from "../store/index"
import UIkit from "uikit";
import {watchDebounced} from "@vueuse/core";
import {useI18n} from "vue-i18n";

//Declared variables

const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = knowledgeBase()
const params = reactive({
  page_size: 10,
  page: 1,
  search: ''
});

const props = defineProps<{
  knowledge: string
}>();

let toRefresh = ref(false)
watch(() => props.knowledge, function () {
  toRefresh.value = !toRefresh.value
})

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
  price: number | null,
  image: null | string,
  code: string,
  measurement_type: string | null,
  quantity: number | null
}


const editData = ref<EditData>({
  id: 0,
  title: {
    uz: "",
    ru: ""
  },
  description: {
    uz: "",
    ru: ""
  },
  price: null,
  image: null,
  code: "",
  measurement_type: '',
  quantity: 0
})

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
  UIkit.modal("#product-delete-modal").show()
  itemId.value = id
};

const saveProducts = () => {
  refresh(params);
}


const refresh = async (filter: any) => {
  isLoading.value = true;
  try {
    await store.getProducts(filter)
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
  isLoading.value = false;
};
refresh(params)
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteProducts(itemId.value)
    UIkit.modal("#product-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.productsList.count - 1) % params.page_size == 0) {
      if (params.page > 1) {
        params.page = params.page - 1
        refresh(params)
      } else {
        params.page = 1
        refresh(params)
      }

    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);


</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">

      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" :placeholder="$t('Search')"
               v-model="params.search"/>
      </label>

      <button class="btn-primary" uk-toggle="target: #create_products" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="productsFields"
                   :items="store.productsList.results" show-index>

      <template #empty-message>
        <span>{{ $t('empty_text') }}</span>
      </template>

      <template #header-code="header">
        {{ $t(header.text) }}
      </template>

      <template #header-title="header">
        {{ $t(header.text) }}
      </template>

      <template #header-image="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #header-price="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>

      <template #item-image="item">
        <div class="py-3 flex justify-center items-center gap-3">
          <img v-if="item.image"
               class="w-[45px] h-[45px] rounded object-cover"
               :src="item.image"
               alt="Rounded avatar"
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon
                icon="Camera"
                color="#356c2d"
            />
          </div>
        </div>
      </template>

      <template #item-description="item">
        {{ item.description[$i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex justify-center my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #create_products" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)"
          >
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <DeleteModal @delete-action="deleteAction" :id="'product-delete-modal'"/>

    <TwPagination :restart="toRefresh" :total="store.productsList.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>

    <CreateProducts :editData="editData" @saveProducts="saveProducts"/>

  </div>
</template>
