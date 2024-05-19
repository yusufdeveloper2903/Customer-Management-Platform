<script setup lang="ts">


//IMPORTED FILES
import {PollsTable} from "../constants";
import PollsStore from ".././store/index";
import {onMounted, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import {useRouter} from "vue-router";
import DoubleRight from "@/modules/Users/img/double-right-chevron-svgrepo-com.svg";
import DetailsModal from "@/modules/Polls/components/CreatePolls.vue";
import VueDatePicker from "@vuepic/vue-datepicker";


//DECLARED VARIABLES
const dateConfig = ref({})
const editData = <any>ref({
  id: null,
  status: '',
  name: '',
})
let PollsList = ref<object[]>([]);
const {t} = useI18n()
const router = useRouter()
const store = PollsStore();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const params = reactive({
  page: 1,
  page_size: 10,
  search: null,
  status: null,
  start_date: null,
  end_date: null
})
let toRefresh = ref(false)
const listStatus = ref([
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Waiting',
    value: 'WAITING'
  },
  {
    title: 'Finished',
    value: 'FINISHED'
  }
])


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
  await refresh()

})


//WATCHERS
watchDebounced(() => params.search, function () {
  params.page = 1
  localStorage.setItem('page', '1')
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000})
watchDebounced(() => params.start_date, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watchDebounced(() => params.status, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})


watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        if (!value) {
          params.start_date = null
          params.end_date = null
        } else {
          params.start_date = started_date.split('T')[0]
          params.end_date = end_date.split('T')[0]
        }
      } else {
        params.start_date = null
        params.end_date = null
      }
    }
)

//FUNCTIONS
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getPollsList(params);
    PollsList.value = store.PollsList.results
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};
const changeColor = (val: string) => {
  if (val == 'ACTIVE') {
    return t('bg-success')
  } else if (val == 'WAITING') {
    return t('bg-secondary')
  } else {
    return t('bg-warning')
  }
}
const changeStatus = (val: string) => {
  if (val == 'ACTIVE') {
    return t('Active')
  } else if (val == 'WAITING') {
    return t('Waiting')
  } else {
    return t('Finished')
  }
}
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deletePolls(itemToDelete.value)
    await UIKit.modal("#polls-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.PollsList.count > 1 && ((store.PollsList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
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
const showDetailPage = (item: any) => {
  router.push({name: 'polls-detail-id', params: {id: item.id}})
};
const handleDeleteModal = (id: number) => {
  itemToDelete.value = id
  UIKit.modal("#polls-main-delete-modal").show()
};
const editModal = async (val: any) => {
  editData.value = await val
  await UIKit.modal("#polls-modal").show();
}

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7 ">
      <div class="flex items-center md:w-7/12">
        <label>{{ $t('Search') }}
          <input
              v-model="params.search"
              type="text"
              class="form-input"
          />
        </label>
        <div class="md:w-1/3 ml-4 ">
          <label for="role" class="dark:text-gray-300">
            {{ $t("Status") }}
          </label>
          <v-select
              :options="listStatus"
              v-model="params.status"
              :getOptionLabel="(name:any) => t(name.title)"
              :reduce="(item:any) => item.value"
          >
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
        </div>
        <div class="md:w-1/3 ml-4 ">
          <label for="from" class="dark:text-gray-300">
            {{ $t("date_from") + ' - ' + $t("date_to") }}
          </label>
          <VueDatePicker :enableTimePicker="false" auto-apply :range="{ partialRange: false }" v-model="dateConfig"/>

        </div>
      </div>

      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              uk-toggle="target: #polls-modal" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :loading="isLoading"
        :headers="PollsTable"
        :items="PollsList"
    >
      <template #empty-message>
        <div class="dark:text-white">{{ $t("no_available_data") }}</div>
      </template>
      <template #header="header">
        {{ $t(header.text) }}
      </template>
      <template #item-count_question="items">
          <span
              class="rounded bg-success px-4 p-1 pt-1 inline  text-white"
          >
            {{ items.count_question }}
          </span>
      </template>
      <template #item-status="items">
          <span
              :class="changeColor(items.status)" class="rounded  px-4 p-1 pt-1 inline  text-white"
          >
            {{ changeStatus(items.status) }}
          </span>
      </template>
      <template #header-actions="item">
        <div class="flex justify-end">
          {{ $t(item.text) }}
        </div>
      </template>
      <template #item-actions="data">
        <div class="flex my-4 justify-end">
          <button @click="showDetailPage(data)" class="btn-success btn-action mr-3">
            <img :src="DoubleRight"
                 alt="Icon">
          </button>
          <button class="btn-warning btn-action"
                  @click="editModal(data)">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button
              class="ml-3 btn-danger btn-action"
              @click="handleDeleteModal(data.id)"
          >
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
        :total="store.PollsList.count"
        class="mt-10 tw-pagination"
        :current="params.page"
        :restart="toRefresh"
        :per-page="params.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />
  </div>
  <DetailsModal :editData="editData" @refresh="refresh"/>
  <DeleteModal @delete-action="deleteAction" id="polls-main-delete-modal"/>
</template>
