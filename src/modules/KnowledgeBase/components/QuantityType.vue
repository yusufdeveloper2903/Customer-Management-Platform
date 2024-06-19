<script setup lang="ts">

//IMPORTED FILES
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { recipeCategoryFields } from "../constants";
import QuantityTypeModal from "./modals/TypeQuantityModal.vue";
import { useI18n } from "vue-i18n";
import KnowledgeBase from "../store/index";
import UIkit from "uikit";
import { watchDebounced } from "@vueuse/core";
import {QuantityType} from "../interfaces/index"


//DECLARED VARIABLES
const { t } = useI18n()
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
}>();
let toRefresh = ref(false)

const editData = ref<QuantityType>({
id: null,
title: ""
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'type_quantity') {
    await refresh(params)
  }
})



//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'type_quantity') {
    await refresh(params)
  }
})

watchDebounced(
  () => params.search,
  async () => {
    params.page = 1;
    await refresh(params)
  }, { deep: true, debounce: 500, maxWait: 5000 }
);



// Functions

const deleteType = async () => {
  isLoading.value = true
  try {
    await store.deleteQuantityType(itemId.value)
    await UIkit.modal("#quantity-type-delete").hide();
    toast.success(t('deleted_successfully'));
        await refresh(params)
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
}


const refresh = async (filter) => {
  isLoading.value = true;
  try {
    store.getQuantityType(filter);
  } catch (error: any) {
    toast.error(t('error'))
  }

  isLoading.value = false;
};


const savetype = () => {
  refresh(params);
}

onMounted(() => {
  refresh(params);
});
</script>

<template>
  <div class="card">
    <div class="flex justify-end items-end mb-7">

      <button class="btn-primary" uk-toggle="target: #type_modal" @click="editData = <QuantityType>{}">
        {{ t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="recipeCategoryFields"
      :items="store.quantityTypeList">

      <template #empty-message>
        <div>{{ t('no_available_data') }}</div>
      </template>

      <template #header="header">
        {{ t(header.text) }}
      </template>

      <template #item-name="item">
     {{ item.title }}
      </template>

      <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>

      <template #item-actions="item">
        <div class="flex justify-end my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #type_modal" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button @click="itemId = item.id" class="ml-3 btn-danger btn-action" uk-toggle="target: #quantity-type-delete">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>


    <QuantityTypeModal :edit-data="editData" @savetype="savetype"/>
    <DeleteModal @delete-action="deleteType" id="quantity-type-delete" />
  </div>
</template>
