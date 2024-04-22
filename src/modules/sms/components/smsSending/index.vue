<script setup lang="ts">

// IMPORTED FILES

import {useI18n} from "vue-i18n";
import {smsFields} from "../../constants/index"
import knowledgeBase from "../../store/index"
import {ref, reactive, watch, onMounted} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {useRouter} from "vue-router";
import {watchDebounced} from "@vueuse/core";

//DECLARED VARIABLES


const {t} = useI18n()
const router = useRouter()
const store = knowledgeBase()
const smsSendingList = ref<object[]>([]);
const isLoading = ref(false);
const smsId = ref<number | null>(null)
const smsFilter = reactive({
  page_size: 10,
  page: 1,
  search: null,
  start_time: null,
});
const props = defineProps<{
  sms: string
}>();
let toRefresh = ref(false)


//MOUNTED
onMounted(async () => {
  let sms = localStorage.getItem('sms')
  if (sms == 'sms sending') {
    await refresh();
    await store.getStatus()
  }
})


// WATCHERS
watch(() => props.sms, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'sms sending') {
    await refresh();
    await store.getStatus()
  }

})


watchDebounced(
    () => smsFilter.search,
    () => {
      smsFilter.page = 1
      refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);

watchDebounced(
    () => smsFilter.start_time,
    () => {
      smsFilter.page = 1
      refresh();
    }, {deep: true, debounce: 500, maxWait: 5000}
);

//FUNCTIONS
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getSmsSending(smsFilter)
    smsSendingList.value = store.smsSendingList.results;
  } catch (error: any) {
    toast.error(error.response.message || "Error");
  }
  isLoading.value = false;
};

const changePagination = (e: number) => {
  smsFilter.page = e;
  refresh();
};
const changePageSize = (event: number) => {
  smsFilter.page = 1
  smsFilter.page_size = event
  refresh()
}
const saveNews = () => {
  refresh();
}
const handleDeleteModal = (id: number) => {
  smsId.value = id;
  UIkit.modal("#sms_sending-delete-modal").show();
};
const deleteSms = async () => {
  isLoading.value = true
  try {
    await store.deleteSmsSending(smsId.value)
    UIkit.modal("#sms_sending-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.smsSendingList.count - 1) % smsFilter.page > 0) {
      smsFilter.page = smsFilter.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
</script>

<template>
  <div>
    <div class="md:flex items-end justify-between mb-7">
      <form class="md:flex items-center gap-5 md:w-9/12">
        <div class="md:w-1/3">
          <label for="search" class="dark:text-gray-300">
            {{ $t("Search") }}
          </label>
          <input
              id="search"
              type="text"
              class="form-input"
              :placeholder="$t('Search')"
              v-model="smsFilter.search"
          />
        </div>


        <div class="md:w-1/3 md:m-0 mt-2">
          <label for="from" class="dark:text-gray-300">
            {{ $t("from") }}
          </label>
          <VueDatePicker model-type="yyyy-MM-dd" :enable-time-picker="false"
                         v-model="smsFilter.start_time"></VueDatePicker>
        </div>

      </form>
      <button
          class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
          @click="router.push('/add-sms')"
      >
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="smsFields" :items="smsSendingList">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
      </template>

      <template #header="data">
        {{ $t(data.text) }}
      </template>

      <template #item-title="item">
        {{ item.title }}
      </template>
      <template #header-description="data">
        {{ $t(data.text) }}
      </template>


      <template #item-from_to="item">
        <div>{{ (item.start_time) }}</div>
      </template>


      <template #item-actions="items">
        <div class="flex my-2">
          <button class="btn-warning btn-action" @click="
                router.push(`/sms-detail/${items.id}`)
              ">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(items.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :restart="toRefresh" class="mt-10 tw-pagination" :current="smsFilter.page"
                  :total="store.smsSendingList.count" :per-page="smsFilter.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="changePageSize"/>

    <AddEditModal @saveNews="saveNews"/>
    <DeleteModal @delete-action="deleteSms" :id="'sms_sending-delete-modal'"/>
  </div>
</template>