<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import { splashFields, splashItems } from "../constants";
import SplashDetail from "./modals/SplashDetail.vue";

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
      <button class="btn-primary" uk-toggle="target: #splash">add</button>
    </div>

    <EasyDataTable
      theme-color="#7367f0"
      hide-footer
      :loading="false"
      :headers="splashFields"
      :items="splashItems"
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

      <template #item-status="items">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="items.status"
            disabled
            class="sr-only peer"
          />
          <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </template>

      <template #item-actions="">
        <div class="flex">
          <button class="btn-warning btn-action" uk-toggle="target: #splash">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action">
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

    <SplashDetail details="" />
  </div>
</template>
