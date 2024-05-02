<script setup lang="ts">


//IMPORTED FILES
import {SmsFields} from "../constants";
import knowledgeBase from ".././store/index"
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import CreateSmsTemplate from "./modals/CreateSmsTemplateModal.vue"
import {useI18n} from "vue-i18n";
import {watchDebounced} from "@vueuse/core";
import {editSms} from '../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
let smsTemplateList = ref<object[]>([]);

const userId = ref<number | null>(null);
const props = defineProps<{
  knowledge: string
}>();
let toRefresh = ref(false)
const params = reactive({
  page_size: 10,
  search: "",
  page: 1
});
const editData = ref<editSms>({
  id: null,
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_ru: '',
  description_kr: '',
  description_uz: ''
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'sms_template') {
    await refresh()
  } else {
    await refresh()
  }

})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'sms_template') {
    await refresh()
  }
})
watchDebounced(() => params.search, async function () {
  params.page = 1
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})


//FUNCTIONS
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteSmsTemplate(userId.value);
    UIkit.modal("#sms-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.smsTemplateList.count - 1) % params.page_size == 0) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
}

const handleDeleteModal = (id: number) => {
  userId.value = id
  UIkit.modal("#sms-main-delete-modal").show()
};
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getSmsTemplate(params);
    smsTemplateList.value = store.smsTemplateList.results;
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};

const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const saveSmsTemplate = () => {
  refresh()
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
              uk-toggle="target: #sms_template" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="SmsFields"
                   :items="smsTemplateList">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ $t('empty_text') }}</span>
      </template>

      <template #header-title="header">
        {{ $t(header.text) }}
      </template>

      <template #header-description="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item.title }}
      </template>

      <template #item-description="item">
        {{ item.description }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4 justify-left">
          <button class="btn-warning btn-action" uk-toggle="target: #sms_template" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>
    <TwPagination :total="store.smsTemplateList.count" class="mt-10 tw-pagination"
                  :restart="toRefresh"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>
  </div>

  <DeleteModal @delete-action="deleteAction" :id="'sms-main-delete-modal'"/>

  <CreateSmsTemplate @saveSmsTemplate="saveSmsTemplate" :editData="editData"/>
</template>
