<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import { preparation } from "../constants/index";
import Icon from '@/components/Icons/Icon.vue';
import AddPreparationModal from "./modals/AddPreparationModal.vue";
import { onMounted, ref, reactive } from 'vue';
import { watchDebounced } from "@vueuse/core";
import UIkit from "uikit";
import RecipeStorage from '@/modules/Recipes/store/index';
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { Preparation } from "../interfaces/index"

// Declared variables
const { t } = useI18n()
const store = RecipeStorage()
const route = useRoute()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null)
const currentRow = ref<Preparation | null>(null);
let accordItem = ref<boolean>(false)
const params = reactive({
  page_size: 10,
  page: 1,
  search: ""
});
const editData = ref<Preparation>({
  id: null,
  index: null,
  description: " ",
  description_uz: " ",
  description_ru: " ",
  description_kr: " ",
  food: null
})

// Mounted
onMounted(async () => {
  await refresh(params)
})

watchDebounced(() => params.search, async function () {
  params.page = 1
  await refresh(params)
}, { deep: true, debounce: 500, maxWait: 5000, })


// Functions
const refresh = async (filter) => {
  isLoading.value = true;
  try {
    if (route.params.id) {
      await store.getPreparationById(filter, route.params.id)

    }
  } catch (error: any) {
    toast.error(
      error.response || "Error"
    );
  }

  isLoading.value = false;
};


const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};


const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}

const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};

const dragDrop = async (item: Preparation) => {
  event?.preventDefault();
  await store.create_drag_and_drop({ id1: currentRow.value?.id, id2: item.id })
  await refresh(params);
  toast.success(t("updated_successfully"));
};

const saveData = (() => {
  refresh(params)
})

const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deletePreparation(itemId.value);
    UIkit.modal("#preparation-delete").hide();
    refresh(params)
    toast.success(t('deleted_successfully'));
    if ((store.preparationList.count - 1) % params.page_size == 0) {
      if (params.page > 1) {
        params.page = params.page - 1
        // await refresh(params)
      } else {
        params.page = 1
        // await refresh(params)
      }

    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
      t('error')
    );
    isLoading.value = false
  }
}


const handleDeleteModal = (id: number | null) => {
  UIkit.modal("#preparation-delete").show();
  itemId.value = id;
};
</script>

<template>
  <div class="flex justify-between items-end mb-5">
    <label for="search" class="w-1/3">
      {{ t('Search') }}
      <input type="text" class="form-input" :placeholder="t('Search')" />
    </label>
    <button class="btn-primary" uk-toggle="target: #preparation_modal" @click="editData = <Preparation>{}">
      {{ t("Add") }}
    </button>
  </div>
  <!-- <EasyDataTable theme-color="#7367f0" hide-footer :headers="preparation" :items="store.preparationList.results">


    <template #empty-message>
      <div class="dark:text-white">{{ t("no_available_data") }}</div>
    </template>

    <template #header="header">
      {{ t(header.text) }}
    </template>


    <template #header-actions="item">
      <div class="flex justify-end">
        {{ t(item.text) }}
      </div>
    </template>

    <template #item-id="item">
      {{ item.index }}
    </template>

    <template #item-description="item">
      <div class="grid divide-y divide-neutral-200">
        <div class="py-5">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none"
              @click="accordItem = !accordItem">
              <span v-if="accordItem == false">{{
                item.description_uz && item.description_uz.length > 40
                ? item.description_uz.slice(0, 40) + "..."
                : item.description_uz
              }}</span>
              <span v-else>
                {{ item.description_uz }}
              </span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="text-neutral-600 mt-3 group-open:animate-fadeIn" v-if="accordItem">
                  {{ item.description }}
                </p>
          </details>
        </div>
      </div>
    </template>

    <template #item-actions="item">
      <div class="py-3 flex justify-end items-center gap-3">
        <button class="btn-warning btn-action" uk-toggle="target: #ingredient_modal" @click="recipes = item">
          <Icon icon="Pen New Square" color="#fff" size="16" />
        </button>
        <button class="btn-danger btn-action" @click="handleDeleteModal(item.id)">
          <Icon icon="Trash Bin Trash" color="#fff" size="16" />
        </button>
      </div>
    </template>
  </EasyDataTable> -->



  <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
    <thead>
      <tr>
        <th v-for="field in preparation"
          class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider firstTable">
          {{ t(field.text) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in store.preparationList?.results" :key="item.id"
        class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
        :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left">
          <div class="grid divide-y divide-neutral-200">
            <div class="py-5">
              <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none"
                  @click="accordItem = !accordItem">
                  <span v-if="accordItem == false">{{
                    item.description_uz && item.description_uz.length > 40
                    ? item.description_uz.slice(0, 40) + "..."
                    : item.description_uz
                  }}</span>
                  <span v-else>
                    {{ item.description_uz }}
                  </span>
                  <span class="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor"
                      stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <!-- <p class="text-neutral-600 mt-3 group-open:animate-fadeIn" v-if="accordItem">
                  {{ item.description }}
                </p> -->
              </details>
            </div>
          </div>
        </td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-end">
            <button class="btn-warning btn-action" uk-toggle="target: #preparation_modal" @click="editData = item">
              <Icon icon="Pen New Square" color="#fff" size="16" />
            </button>
            <button @click="handleDeleteModal(item.id)" class="ml-3 btn-danger btn-action">
              <Icon icon="Trash Bin Trash" color="#fff" size="16" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="empty_table" v-if="!store.preparationList?.results.length">{{ t('no_available_data') }}</div>

  <TwPagination :total="store.preparationList.count" class="mt-10 tw-pagination" :current="params.page"
    :per-page="params.page_size" :text-before-input="t('go_to_page')" :text-after-input="t('forward')"
    @per-page-changed="onPageSizeChanged" @page-changed="changePagionation" />



  <DeleteModal @delete-action="deleteAction" :id="'preparation-delete'" />
  <AddPreparationModal @saveData="saveData" :editData="editData"/>
</template>

<style lang="scss" scoped>
.firstTable:nth-child(3) {
  display: flex;
  justify-content: flex-end;
}
</style>