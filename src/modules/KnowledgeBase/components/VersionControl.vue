<script setup lang="ts">

//IMPORTED FILES
import {versionControlFields} from "../constants";
import knowledgeBase from ".././store/index"
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import AddVersionControl from "./modals/VersionControlModal.vue"
import {formatDate} from "@/mixins/features";
import {EditDataVersion} from '../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
const userId = ref<number | null>(null);
const editData = ref<EditDataVersion>({
  id: null,
  number: "",
  description: ""
})
const params = reactive({
  page_size: 10,
  start_date: "",
  end_date: "",
  page: 1
});
const props = defineProps<{
  knowledge: string
}>();
let toRefresh = ref(false)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'version_control') {
    await refresh()
  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'version_control') {
    await refresh()
  }
})


//FUNCTIONS
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteVersion(userId.value)
    await UIkit.modal("#version-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.versionControlList.count > 1 && ((store.versionControlList.count - 1) % params.page_size == 0)) {
      if (params.page > 1) {
        params.page = params.page - 1
        await refresh()
      }
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
const handleDeleteModal = (id: number) => {
  userId.value = id;
  UIkit.modal("#version-delete-modal").show();
};

const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getVersionControl(params);
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};


const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const saveVersionControl = () => {
  refresh()
}

watch(
    () => params.end_date,
    () => {
      params.page = 1
      refresh();
    },
);
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh()
}
</script>

<template>
  <div class="card">

    <div class="md:flex items-end justify-between mb-7">
      <form class=" md:flex items-center gap-5 md:w-9/12">

        <div class="md:w-1/2 md:m-0 mt-2">
          <label for="from" class="dark:text-gray-300">
            {{ t("from") }}
          </label>
          <VueDatePicker :enableTimePicker="false" auto-apply v-model="params.start_date"></VueDatePicker>
        </div>

        <div class="md:w-1/2 md:m-0 mt-2">
          <label for="to" class="dark:text-gray-300">
            {{ t("to") }}
          </label>
          <VueDatePicker :enableTimePicker="false" auto-apply v-model="params.end_date"></VueDatePicker>
        </div>
      </form>
      <button
          class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
          uk-toggle="target: #version_control" @click="editData = <EditDataVersion>{}"
      >
        {{ t("Add") }}
      </button>
    </div>


    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="versionControlFields"
                   :items="store.versionControlList.results">

      <template #empty-message>
        <div>{{ t('no_available_data') }}</div>
      </template>
      <template #header="header">
        {{ t(header.text) }}
      </template>




      <template #item-datetime="items">
        {{ formatDate(items.created_date) }}
      </template>
      <template #item-modified_date="items">
        {{ formatDate(items.modified_date) }}
      </template>
      <template #item-version_number="items">
        {{ items.number }}
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
        <div class="flex my-4 justify-center">
          <button class="btn-warning btn-action" uk-toggle="target: #version_control" @click="editData = item">

            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>

    </EasyDataTable>

    <TwPagination :restart="toRefresh" :total="store.versionControlList.count" class="mt-10 tw-pagination"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="t('go_to_page')" :text-after-input="t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>

  </div>

  <DeleteModal @delete-action="deleteAction" :id="'version-delete-modal'"/>


  <AddVersionControl @saveVersionControl="saveVersionControl" :editData="editData"/>

</template>
