<script setup lang="ts">

//IMPORTED FILES
import { onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { errorResponseFields } from "../constants";
import { useI18n } from "vue-i18n";
import KnowledgeBase from "../store/index";
import { watchDebounced } from "@vueuse/core";
import { ErrorMessage } from "../interfaces/index"
import UpdateResponsemodal from "./modals/UpdateResponsemodal.vue";




//DECLARED VARIABLES
const { t, locale } = useI18n()
const store = KnowledgeBase()
const isLoading = ref<boolean>(false);
let toRefresh = ref(false)
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
const editData = ref<ErrorMessage>({
status_code: 0,
message: "",
message_uz: "",
message_ru: "",
message_kr: "",
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
  if (knowledgeBase == 'error_response') {
    await refresh()
  }
})



//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'error_response') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh()
  }
})

watchDebounced(
  () => params.search,
  async () => {
    params.page = 1;
    await refresh()
  }, { deep: true, debounce: 500, maxWait: 5000 }
);



// Functions
const refresh = async () => {
  isLoading.value = true;
  try {
    store.getErrorMessage(params);
  } catch (error: any) {
    toast.error(t('error'))
  }

  isLoading.value = false;
};


const changePagination = (page: number) => {
  params.page = page;
  refresh();
};


const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}


const saveMessage = () => {
  refresh();
}

</script>

<template>
  <div class="card">

    <div class="flex justify-between items-end mb-7">
      <label for="search" class="w-1/4">
        {{ t('Search') }}
        <input
            v-model="params.search"
            type="text"
            class="form-input"
            :placeholder="t('Search')"
        />
      </label>
    </div>


    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="errorResponseFields"
      :items="store.errorMessageList.results">

      <template #empty-message>
        <div>{{ t('no_available_data') }}</div>
      </template>

      <template #header="header">
        {{ t(header.text) }}
      </template>

      <template #item-message="item">
        {{ item['message_' + locale] }}
      </template>

      <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>

      <template #item-actions="item">
        <div class="flex justify-end my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #response_modal" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
        :total="store.errorMessageList.count"
        class="mt-10 tw-pagination"
        :current="params.page"
        :restart="toRefresh"
        :per-page="params.page_size"
        :text-before-input="t('go_to_page')"
        :text-after-input="t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />

    <UpdateResponsemodal :edit-data="editData" @saveMessage="saveMessage" />
  </div>
</template>
