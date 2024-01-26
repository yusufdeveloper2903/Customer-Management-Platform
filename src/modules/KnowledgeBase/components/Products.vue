<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {productsFields} from "../constants";
import CreateProducts from "./modals/CreateProductsModal.vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import knowledgeBase from "../store/index"
import UIkit from "uikit";

const current = ref<number>(1);
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = knowledgeBase()
const timeout = ref();

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

// filters
const filterProducts = reactive({
  page_size: 10,
  search: "",
});

interface EditData {
  id: number | null,
  title: {
      uz: string,
      ru: string
    },
    price: number | null,
    image: null | string,
    code: string
}


const editData = ref<EditData>({
  id: null,
  title: {
      uz: "",
      ru: ""
    },
    price: null,
    image: null,
    code: ""
})

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({...paginationFilter});
};

const deleteProducts = () => {
  store.deleteProducts(itemId.value).then(() => {
    refresh(paginationFilter);
    UIkit.modal("#poducts-delete").hide();
  })
};

const saveProducts = () => {
  refresh(filterProducts);
}

const searchByName = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    refresh(filterProducts);
  }, 500);
};

const refresh = async (filter) => {

  isLoading.value = true;
  try {
    await store.getProducts(filter)
  } catch (error: any) {
    toast.error(
        error.response.data.msg || error.response.data.error || "Error"
    );
  }

  isLoading.value = false;
};

onMounted(() => {
  refresh(paginationFilter);
});

watch(
  () => filterProducts.search,
  () => {
    if (store.productsList.results.length <= 10) {
      current.value = 1;
    }
  }
);

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4" >
        {{ $t('Search') }}
        <input type="text" class="form-input" :placeholder="$t('Search')" @input="searchByName" v-model="filterProducts.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #create_products" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="productsFields"
      :items="store.productsList.results">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header-code="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-title="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-image="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-price="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>

      <template #item-image="item">
        <div class="py-3 flex items-center gap-3">
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
        <div class="flex my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #create_products" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action" @click="itemId = item.id"   uk-toggle="target: #poducts-delete">         
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="store.productsList && store.productsList.count" class="mt-10 tw-pagination" :current="current" :per-page="10"
      :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')" @page-changed="changePagionation" />

    <CreateProducts :editData="editData" @saveProducts="saveProducts"/>
     

    <ConfirmModal
        :title="$t('delete')"
        :cancel="$t('Cancel')"
        :ok="$t('delete')"
        id="poducts-delete"
        @ok="deleteProducts"
        @cancel="itemId = null"
    >
      <p>{{ $t('Are you sure?') }}</p>
    </ConfirmModal>
  </div>
</template>
