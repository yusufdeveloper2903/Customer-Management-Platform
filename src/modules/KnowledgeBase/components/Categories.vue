<script setup lang="ts">

//IMPORTED FILES
import {onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {categoryFields, categoryitems} from "../constants";
import CategoriesDetail from "./modals/CategoriesDetail.vue";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import {ICategory} from "../interfaces/index";
import {useI18n} from "vue-i18n";


//DECLARED VARIABLES
const {t} = useI18n()
const current = ref<number>(1);
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});
const items = ref<ICategory[]>(categoryitems);
const currentRow = ref<ICategory | null>(null);
const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e) => {
  e.preventDefault();
};

const dragDrop = (item: ICategory) => {
  event?.preventDefault();
  items.value = items.value.map((r) => {
    if (r.id == item.id) {
      return {...r, step_id: currentRow.value?.step_id || r.step_id};
    }

    if (r.id == currentRow.value?.id) {
      return {...r, step_id: item.step_id || r.step_id};
    }

    return r;
  });
};

const sortItems = (a, b) => {
  if (a.step_id > b.step_id) {
    return 1;
  } else {
    return -1;
  }
};

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
    toast.error(t('error'))
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
      <button class="btn-primary" uk-toggle="target: #categories">
        {{ $t("Add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th
            v-for="field in categoryFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider"
        >
          {{ field.text }}

        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="item in items.sort(sortItems)"
          :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true"
          @dragstart="dragStart(item)"
          @dragover="dragOver"
          @drop="dragDrop(item)"
      >
        <td class="px-6 whitespace-no-wrap">
          {{ item.id }}
        </td>
        <td class="px-6 whitespace-no-wrap">
          <div class="py-3 flex items-center gap-3">
            <img v-if="item.photo"
                 class="w-[45px] h-[45px] rounded object-cover"
                 :src="item.photo"
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
        </td>
        <td class="px-6 whitespace-no-wrap">{{ item.name }}</td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex">
            <button
                class="btn-warning btn-action"
                uk-toggle="target: #categories"
            >
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

    <CategoriesDetail details=""/>

    <ConfirmModal
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
