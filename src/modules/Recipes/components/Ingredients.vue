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


// Declared variables
const { t } = useI18n()
const store = RecipeStorage()
const route = useRoute()
const isLoading = ref<boolean>(false);
const params = reactive({
  page_size: 10,
  page: 1,
  search: ""
});

let recipes = ref<Ingredient>({
  id: null,
  product: null,
  unit_of_measure: null,
  food: null,
  discount: null
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

</script>

<template>
  <div class="flex justify-between items-end mb-5">
    <label for="search" class="w-1/3">
      {{ t('Search') }}
      <input type="text" class="form-input" :placeholder="t('Search')" />
    </label>
    <button class="btn-primary" uk-toggle="target: #ingredient_modal" @click="recipes = <Ingredient>{}">
      {{ t("Add") }}
    </button>
  </div>
  <EasyDataTable theme-color="#7367f0" hide-footer :headers="ingredients" :items="store.ingredients.results">
    <template #empty-message>
      <div class="dark:text-white">{{ t("no_available_data") }}</div>
    </template>

    <template #header="header">
      {{ t(header.text) }}
    </template>

    <template #item-product="item">
      {{ item.product.title }}
    </template>

    <template #item-quantity="item">
      {{ item.discount }} {{ item.unit_of_measure.title }}
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
        <button class="btn-danger btn-action">
          <Icon icon="Trash Bin Trash" color="#fff" size="16" />
        </button>
      </div>
    </template>

  </EasyDataTable>

  <TwPagination :total="store.ingredients.count" class="mt-10 tw-pagination" :current="1" :per-page="10"
    :text-before-input="t('go_to_page')" :text-after-input="t('forward')" @per-page-changed="onPageSizeChanged"
    @page-changed="changePagionation" />

  <AddEditIngredientModal @saveData="saveData" :editData="recipes"/>
</template>