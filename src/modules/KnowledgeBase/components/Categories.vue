<script setup lang="ts">

//IMPORTED FILES
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { recipeCategoryFields } from "../constants";
import CategoriesDetail from "./modals/CategoriesDetail.vue";
import { useI18n } from "vue-i18n";
import KnowledgeBase from "../store/index";
import UIkit from "uikit";
import { watchDebounced } from "@vueuse/core";
import {RetseptCategory} from "../interfaces/index"


//DECLARED VARIABLES
const { t, locale } = useI18n()
const store = KnowledgeBase()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const params = reactive({
  page_size: 10,
  page: 1,
  search: ""
});
const props = defineProps<{
  knowledge: string
  params: {
    page: number,
    page_size: number
  }
}>();
let toRefresh = ref(false)

const editData = ref<RetseptCategory>({
  id: null, 
  name: "",
  name_uz: "",
  name_ru: "",
  name_kr: ""
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.page = JSON.parse(page)
  }
  if (page_size) {
    params.page_size = JSON.parse(page_size)
  }
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'recipe category') {
    await refresh(params)
  }
})



//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'recipe category') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh(params)
  }
})

watchDebounced(
  () => params.search,
  async () => {
    params.page = 1;
    localStorage.setItem('page', '1')
    await refresh(params)
  }, { deep: true, debounce: 500, maxWait: 5000 }
);



// Functions
const changePagination = (e: number) => {
  params.page = e;
  refresh(params);
};

const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}

const deleteCategory = async () => {
  isLoading.value = true
  try {
    await store.deleteRecipeCategory(itemId.value)
    await UIkit.modal("#category-delete").hide();
    toast.success(t('deleted_successfully'));
    if (store.retseptCategoryList.count > 1 && ((store.retseptCategoryList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh(params)
    } else {
      await refresh(params)
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
}


const refresh = async (filter) => {
  isLoading.value = true;
  try {
    store.getRetseptCategory(filter);
  } catch (error: any) {
    toast.error(t('error'))
  }

  isLoading.value = false;
};


const saveCategory = () => {
  refresh(params);
}

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ t('Search') }}
        <input type="text" class="form-input" :placeholder="t('Search')" v-model="params.search" />
      </label>

      <button class="btn-primary" uk-toggle="target: #categories" @click="editData = <RetseptCategory>{}">
        {{ t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="recipeCategoryFields"
      :items="store.retseptCategoryList.results">

      <template #empty-message>
        <div>{{ t('no_available_data') }}</div>
      </template>

      <template #header="header">
        {{ t(header.text) }}
      </template>

      <template #item-name="item">
        {{ item['name_'+ locale] }}
      </template>

      <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>

      <template #item-actions="item">
        <div class="flex justify-end my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #categories" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button @click="itemId = item.id" class="ml-3 btn-danger btn-action" uk-toggle="target: #category-delete">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>


    <TwPagination class="mt-10 tw-pagination" :current="params.page" :total="store.retseptCategoryList.count"
      :per-page="params.page_size" :text-before-input="t('go_to_page')" :text-after-input="t('forward')"
      @page-changed="changePagination" @per-page-changed="onPageSizeChanged" />

    <CategoriesDetail :edit-data="editData" @saveCategory="saveCategory"/>

    <DeleteModal @delete-action="deleteCategory" id="category-delete" />
  </div>
</template>
