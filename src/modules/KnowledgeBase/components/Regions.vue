<script setup lang="ts">
//Imported files

import {Regions} from "../constants";
import knowledgeBase from ".././store/index"
import {reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import CreateRegions from "./modals/CreateRegions.vue"
import {useI18n} from "vue-i18n";
import {watchDebounced} from "@vueuse/core";


//Declared variables
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
let regionList = ref<object[]>([]);
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
    await store.deleteRegion(userId.value);
    UIkit.modal("#region-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.regionsList.count - 1) % params.page > 0) {
      params.page = params.page - 1
      await refresh(params)
    } else {
      await refresh(params)
    }

    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
}

const handleDeleteModal = (id) => {
  userId.value = id
  UIkit.modal("#region-main-delete-modal").show()
};

watchDebounced(() => params.search, async function () {
  params.page = 1
  await refresh(params)
}, {deep: true, debounce: 500, maxWait: 5000,})


const refresh = async (filter: any) => {
  isLoading.value = true;
  try {
    await store.getRegions(filter);
    regionList.value = store.regionsList.results;
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
const saveSmsTemplate = () => {
  refresh(params)
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" :placeholder="$t('Search')"
               v-model="params.search"/>
      </label>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              uk-toggle="target: #regions" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="Regions"
                   :items="regionList">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header-name="header">
        {{ $t(header.text) }}
      </template>


      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #item-name="item">
        {{ item.name[$i18n.locale] }}
      </template>



      <template #item-actions="item">
        <div class="flex my-4 justify-left">
          <button class="btn-warning btn-action" uk-toggle="target: #regions" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>
    <TwPagination :total="store.regionsList.count" class="mt-10 tw-pagination"
                  :restart="toRefresh"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagionation" @per-page-changed="onPageSizeChanged"/>
  </div>

  <DeleteModal @delete-action="deleteAction" :id="'region-main-delete-modal'"
  />

  <CreateRegions @saveSmsTemplate="saveSmsTemplate" :editData="editData"/>
</template>
