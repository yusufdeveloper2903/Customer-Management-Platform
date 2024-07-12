<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import { ingredients } from "../constants/index";
import AddEditIngredientModal from "./modals/AddEditIngredientModal.vue";
import RecipeStorage from '@/modules/Recipes/store/index';
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { Ingredient } from '../interfaces/index';
import { watchDebounced } from "@vueuse/core";
import UIkit from "uikit";

// Declared variables
const { t } = useI18n()
const store = RecipeStorage()
const route = useRoute()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null)
const params = reactive({
  page_size: 10,
  page: 1,
  search: ""
});

let recipes = ref<Ingredient>({
  id: null,
  draft_product: null,
  draft_unit_of_measure: null,
  food: null,
  draft_discount: null
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
      await store.getIngredientById(filter, route.params.id)

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


const saveData = (() => {
  refresh(params)
})

const deleteAction = async () => {
    isLoading.value = true
    try {
        await store.deleteIngredient(itemId.value);
        UIkit.modal("#ingredient-delete").hide();
        refresh(params)
        toast.success(t('deleted_successfully'));
        if ((store.ingredients.count - 1) % params.page_size == 0) {
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


const handleDeleteModal = (id: number) => {
    UIkit.modal("#ingredient-delete").show();
    itemId.value = id;
};
</script>

<template>
  <div class="flex justify-between items-end mb-5">
    <label for="search" class="w-1/3">
      {{ t('Search') }}
      <input type="text" class="form-input" :placeholder="t('Search')" v-model="params.search"/>
    </label>
    <button class="btn-primary" uk-toggle="target: #ingredient_modal" @click="recipes = <Ingredient>{}">
      {{ t("Add") }}
    </button>
  </div>



  <EasyDataTable   show-index theme-color="#7367f0" hide-footer :headers="ingredients" :items="store.ingredients.results">
    <template #empty-message>
      <div class="dark:text-white">{{ t("no_available_data") }}</div>
    </template>

    <template #header="header">
      {{ t(header.text) }}
    </template>


    <!-- <template #item-id="item">
      {{ item.length }}
    </template> -->

    
    <template #item-product="item">
      {{ item.draft_product?.title }}
    </template>

    <template #item-quantity="item">
      {{ item.draft_discount }} {{ item.draft_unit_of_measure?.title }}
    </template>

    <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
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

  </EasyDataTable>

  <TwPagination :total="store.ingredients.count" class="mt-10 tw-pagination" :current="1" :per-page="10"
    :text-before-input="t('go_to_page')" :text-after-input="t('forward')" @per-page-changed="onPageSizeChanged"
    @page-changed="changePagionation" />

    <DeleteModal @delete-action="deleteAction" :id="'ingredient-delete'" />
  <AddEditIngredientModal @saveData="saveData" :editData="recipes"/>
</template>