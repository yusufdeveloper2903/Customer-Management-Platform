<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {productsFields} from "../constants";
import CreateProducts from "./modals/CreateProductsModal.vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
// import {ICategory} from "../interfaces/index";

const current = ref<number>(1);
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});


const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({...paginationFilter});
};

const deleteCategory = () => {
  console.log(itemId);
};

const refresh = async (filter) => {
  isLoading.value = true;
  try {
    console.log(filter);
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
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" :placeholder="$t('Search')"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #create_products" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="productsFields"
      :items="[]">

      <template #header-number="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-name="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-photo="header">
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

      <template #item-description="item">
        {{ item.description[$i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #create_products" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action" @click="itemId = item.id" uk-toggle="target: #confirm-modal">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
        class="mt-10 tw-pagination"
        :current="current"
        :total="5"
        :per-page="10"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
    />

    <CreateProducts />
    <!-- @saveSmsTemplate="saveSmsTemplate" :editData="editData" -->

    <ConfirmModal
        :title="$t('delete')"
        :cancel="$t('cancel')"
        :ok="$t('delete')"
        @ok="deleteCategory"
        @cancel="itemId = null"
    >
      <p>{{ $t('Are you sure?') }}</p>
    </ConfirmModal>
  </div>
</template>
