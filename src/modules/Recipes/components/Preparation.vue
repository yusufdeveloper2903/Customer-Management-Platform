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
import { Preparation, EditPreparation } from "../interfaces/index"


// Declared variables
const { t, locale } = useI18n()
const store = RecipeStorage()
const route = useRoute()

const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null)
const currentRow = ref<Preparation | null>(null);
let accordItem = ref<boolean>(false)
const params = reactive({
  search: ""
});
const editData = ref<EditPreparation>({
  id: null,
  draft_description: " ",
  draft_description_uz: " ",
  draft_description_ru: " ",
  draft_description_kr: " ",
  food: null
})

// Mounted
onMounted(async () => {
  await refresh(params)
})

watchDebounced(() => params.search, async function () {
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


const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};

const dragDrop = async (item: Preparation) => {
  event?.preventDefault();
  await store.createPreparationDrag_and_drop({ new_index: currentRow.value?.index, last_index: item.index, id: item.id })
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
      <input type="text" class="form-input" :placeholder="t('Search')" v-model="params.search" />
    </label>
    <button class="btn-primary" uk-toggle="target: #preparation_modal" @click="editData = <Preparation>{}">
      {{ t("Add") }}
    </button>
  </div>

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
      <tr v-for="item in store.preparationList?.results"
        class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
        :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left">
            {{ item['draft_description_' + locale] }}
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



  <DeleteModal @delete-action="deleteAction" :id="'preparation-delete'" />
  <AddPreparationModal @saveData="saveData" :editData="editData" />
</template>

<style lang="scss" scoped>
.firstTable:nth-child(3) {
  display: flex;
  justify-content: flex-end;
}
</style>