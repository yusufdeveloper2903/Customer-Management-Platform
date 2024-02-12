<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {splashFields, splashItems} from "../constants";
import SplashDetail from "./modals/SplashDetail.vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";

const current = ref<number>(1);
const itemId = ref<number | null>(null);
const isLoading = ref<boolean>(false);

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
        t('error')
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
        Search
        <input type="text" class="form-input" placeholder="Search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #splash">
        {{ $t("global.add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th
            v-for="field in splashFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider"
        >
          {{ field.text }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="item in splashItems"
          :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200"
      >
        <td class="px-6 whitespace-no-wrap">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap">
          <div class="py-3 flex items-center gap-3">
            <img
                v-if="item.photo"
                class="w-[45px] h-[45px] rounded object-cover"
                :src="item.photo"
                alt="Rounded avatar"
            />
            <div v-else
                 class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded">
              <Icon icon="Camera" color="#356c2d"/>
            </div>
          </div>
        </td>
        <td class="px-6 whitespace-no-wrap">{{ item.version }}</td>
        <td class="px-6 whitespace-no-wrap">{{ item.time }}</td>
        <td class="px-6 whitespace-no-wrap">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :checked="item.is_active" disabled class="sr-only peer"/>
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none
              rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
              after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5
              after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            >
            </div>
          </label>
        </td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex">
            <button class="btn-warning btn-action" uk-toggle="target: #categories">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                @click="itemId = item.id"
                class="ml-3 btn-danger btn-action"
                uk-toggle="target: #confirm-modal"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <TwPagination
        class="mt-10 tw-pagination"
        :current="current"
        :total="5"
        :per-page="10"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
    />

    <SplashDetail details=""/>

    <ConfirmModal
        id="confirmSplash"
        title="Delete"
        cancel="cancel"
        ok="delete"
        @ok="deleteCategory"
        @cancel="itemId = null"
    >
      <p>Are you sure?</p>
    </ConfirmModal>
  </div>
</template>
