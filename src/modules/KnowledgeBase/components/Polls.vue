<script setup lang="ts">


//IMPORTED FILES
import {PollsFields} from "../constants";
import knowledgeBase from ".././store/index"
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import CreatePoll from "./modals/CreatePolls.vue"
import {useI18n} from "vue-i18n";
import {watchDebounced} from "@vueuse/core";
import {Polls} from '../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n()
const store = knowledgeBase()
const isLoading = ref(false);
let pollList = ref<object[]>([]);
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
const editData = ref<Polls>({
  id: null,
  name: '',
  is_active: false
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'Polls') {
    await refresh()
  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'Polls') {
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
    await store.detelePoll(userId.value);
    UIkit.modal("#polls-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.pollList.count > 1 && ((store.pollList.count - 1) % params.page_size == 0)) {
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
  UIkit.modal("#polls-main-delete-modal").show()
};
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getPolls(params);
    pollList.value = store.pollList.results;
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
const savePoll = () => {
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
              uk-toggle="target: #polls-modal" @click="editData = {}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="PollsFields"
                   :items="pollList">

      <template #empty-message>
        <div>{{ $t('no_available_data') }}</div>
      </template>

      <template #header-name="header">
        {{ $t(header.text) }}
      </template>

      <template #header-is_active="header">
        {{ $t(header.text) }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text) }}
      </template>
      <template #item-is_active="items">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="items.is_active"
              class="sr-only peer"
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </template>
      <template #item-actions="item">
        <div class="flex my-4 justify-left">
          <button class="btn-warning btn-action" uk-toggle="target: #polls-modal" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>
    <TwPagination :total="store.pollList.count" class="mt-10 tw-pagination"
                  :restart="toRefresh"
                  :current="params.page" :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>
  </div>

  <DeleteModal @delete-action="deleteAction" id="polls-main-delete-modal"/>

  <CreatePoll @savePoll="savePoll" :editData="editData"/>
</template>
