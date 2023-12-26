<script setup lang="ts">
import { versionControlFields } from "../constants";
import knowledgeBase from ".././store/index"
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import UIkit from "uikit";
import DeleteSmsTemplate from "./modals/DeleteSmsTemplateModal.vue"
import AddVersionControl from "./modals/VersionControlModal.vue"

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
      error.response || "Error"
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

    <div class="md:flex items-center justify-between mb-5">
        <form class="mb-4 md:flex items-center gap-5 md:w-9/12">

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="from" class="dark:text-gray-300">
              {{ $t("from") }}
            </label>
            <VueDatePicker></VueDatePicker>
          </div>

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="to" class="dark:text-gray-300">
              {{ $t("to") }}
            </label>
            <VueDatePicker ></VueDatePicker>
          </div>
        </form>
        <button
        class="btn-primary" uk-toggle="target: #version_control" 
        >
          {{ $t("Add") }}
        </button>
    </div>


    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="versionControlFields"
      :items="smsTemplateList">

      <template #header-datetime="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-version_number="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-is_active="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #item-is_active="items">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                :checked="items.is_active"
                disabled
                class="sr-only peer"
            />
            <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"/>
          </label>
        </template>

      <template #item-actions="item">
        <div class="flex my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #version_control" >
            <!-- @click="editData = item" -->
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="store.smsTemplateList && store.smsTemplateList.count" class="mt-10 tw-pagination" :current="current" :per-page="10"
      :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')" @page-changed="changePagionation" />
  </div>

  <DeleteSmsTemplate  :userId="userId"
          @deleteSmsTemplate="deleteSmsTemplate"/>

          <AddVersionControl />
          <!-- @saveSmsTemplate="saveSmsTemplate" :editData="editData" -->
</template>
