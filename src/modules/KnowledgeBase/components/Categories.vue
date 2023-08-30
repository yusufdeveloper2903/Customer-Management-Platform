<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import { fields, items } from "../constants";
import CategoriesDetail from "./modals/CategoriesDetail.vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";

const current = ref<number>(1);
const isLoading = ref(false);

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({ ...paginationFilter });
};

const deleteCategory = () => {
  console.log();
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
    <div class="flex justify-end mb-10">
      <button class="btn-primary" uk-toggle="target: #categories">add</button>
    </div>

    <EasyDataTable
      theme-color="#7367f0"
      hide-footer
      :loading="false"
      :headers="fields"
      :items="items"
    >
      <template #item-photo="item">
        <div class="py-3 flex items-center gap-3">
          <img
            v-if="item.photo"
            class="w-[45px] h-[45px] rounded object-cover"
            :src="item.photo"
            alt="Rounded avatar"
          />
          <div
            v-else
            class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon icon="Camera" color="#3ca14b" />
          </div>
        </div>
      </template>

      <template #item-actions="">
        <div class="flex">
          <button
            class="btn-warning btn-action"
            uk-toggle="target: #categories"
          >
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button
            class="ml-3 btn-danger btn-action"
            uk-toggle="target: #confirm-modal"
          >
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

    <CategoriesDetail details="" />
    <ConfirmModal
      title="Delete"
      cancel="cancel"
      ok="delete"
      @ok="deleteCategory"
    >
      <p>Are you sure?</p>
    </ConfirmModal>
  </div>
</template>
