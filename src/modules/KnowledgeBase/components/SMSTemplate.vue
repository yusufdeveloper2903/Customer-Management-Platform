<script setup lang="ts">
import { locationFields } from "../constants";
import knowledgeBase from ".././store/index"
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import UIkit from "uikit";
import DeleteSmsTemplate from "./modals/DeleteSmsTemplateModal.vue"
import CreateSmsTemplate from "./modals/CreateSmsTemplateModal.vue"

const store = knowledgeBase()
const isLoading = ref(false);
let smsTemplateList = ref<object[]>([]);
const timeout = ref();
const current = ref<number>(1);
const userId = ref<number | null>(null);

interface EditData {
  id: number | null,
  title: {
      uz: string,
      ru: string
    },
    description: {
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
    description: {
      uz: "",
      ru: ""
    },
})
// filters
const filterSmsTemplate = reactive({
  page_size: 10,
  search: "",
});

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const handleDeleteModal = (id: number) => {
  userId.value = id;
  UIkit.modal("#sms_template-delete-modal").show();
};

const refresh = async (filter) => {
  isLoading.value = true;
  try {
    await store.getSmsTemplate(filter);
    smsTemplateList.value = store.smsTemplateList.results;
  } catch (error: any) {
    toast.error(
      error.response.data.msg || error.response.data.error || "Error"
    );
  }

  isLoading.value = false;
};

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({ ...paginationFilter, ...filterSmsTemplate });
};

const searchByName = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    refresh(filterSmsTemplate);
  }, 500);
};

const deleteSmsTemplate = () => {
  refresh(filterSmsTemplate);
};

const saveSmsTemplate = () => {
  refresh(filterSmsTemplate);
}

onMounted(async () => {
  await refresh(paginationFilter);
});


watch(
  () => filterSmsTemplate.search,
  () => {
    if (smsTemplateList.value.length <= 10) {
      current.value = 1;
    }
  }
);
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4" >
        Search
        <input type="text" class="form-input" placeholder="Search" @input="searchByName" v-model="filterSmsTemplate.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #sms_template" @click="editData = {}">
        {{ $t("global.add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="locationFields"
      :items="smsTemplateList">

      <template #header-title="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-description="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>

      <template #item-description="item">
        {{ item.description[$i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #sms_template" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="store.smsTemplateList.count" class="mt-10 tw-pagination" :current="current" :per-page="10"
      :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')" @page-changed="changePagionation" />
  </div>

  <DeleteSmsTemplate  :userId="userId"
          @deleteSmsTemplate="deleteSmsTemplate"/>

          <CreateSmsTemplate @saveSmsTemplate="saveSmsTemplate" :editData="editData"/>
</template>
