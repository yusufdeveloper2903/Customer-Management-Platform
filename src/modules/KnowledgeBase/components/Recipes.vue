<script setup lang="ts">
//Imported files

import {recipesFields, recipesItems} from "../constants";
import knowledgeBase from ".././store/index"
import {reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import CreateRecipe from "./modals/CreateRecipesModal.vue"
import {useI18n} from "vue-i18n";
import {watchDebounced} from "@vueuse/core";

//Declared variables
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
let smsTemplateList = ref<object[]>([]);
const userId = ref<number | null>(null);
const props = defineProps<{
  knowledge: string
}>();

let toRefresh = ref(false)
watch(() => props.knowledge, function () {
  toRefresh.value = !toRefresh.value
})

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
}


const editData = ref<EditData>({
  id: null,
  title: {
    uz: "",
    ru: ""
  },
})

const params = reactive({
  page_size: 10,
  search: "",
  page: 1
});

const deleteAction = async () => {
  isLoading.value = true
  try {
    await console.log(userId.value);
    UIkit.modal("#recipes-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.smsTemplateList.count - 1) % params.page_size == 0) {
      if (params.page > 1) {
        params.page = params.page - 1
        await refresh(params)
      } else {
        params.page = 1
        await refresh(params)
      }

    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
}
const handleDeleteModal = (id) => {
  UIkit.modal("#recipes-delete-modal").show();
  userId.value = id;

};


watchDebounced(() => params.search, async function () {
  params.page = 1
  await refresh(params)
}, {deep: true, debounce: 500, maxWait: 5000,})


const refresh = async (filter: any) => {
  isLoading.value = true;
  try {
    await store.getSmsTemplate(filter);
    // smsTemplateList.value = store.smsTemplateList.results;
  } catch (error: any) {
    toast.error(
        error.response || "Error"
    );
  }

  isLoading.value = false;
};
refresh(params)

const changePagionation = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const saveRecipes = () => {
  refresh(params)
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" placeholder="Search"
               v-model="params.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #create_recipes" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="recipesFields"
                   :items="recipesItems">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header="header">
        {{ $t(header.text) }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" uk-toggle="target: #create_recipes" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>
    <TwPagination :total="2" class="mt-10 tw-pagination"
                  :restart="toRefresh"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
  </div>

  <DeleteModal
      @delete-action="deleteAction" :id="'recipes-delete-modal'"/>

  <CreateRecipe @saveRecipes="saveRecipes" :editData="editData"/>
</template>
