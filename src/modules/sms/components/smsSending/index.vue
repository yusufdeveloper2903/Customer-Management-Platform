<script setup lang="ts">
import { useI18n } from "vue-i18n";
// import AddEditModal from './AddEditModal.vue'
import { smsFields       } from "../../constants/index"
import knowledgeBase from "../../store/index"
import { onMounted, ref, reactive, watch } from "vue";
import { toast } from "vue3-toastify";
import DeleteSmsSendingModal from "./DeleteSmsSending.vue";
import UIkit from "uikit";

const { t } = useI18n()
const store = knowledgeBase()
const smsSendingList = ref<object[]>([]);
const isLoading = ref(false);
const timeout = ref();
const current = ref<number>(1);
const smsId = ref<number | null>(null)

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const filterSmsSending = reactive({
  page_size: 10,
  search: "",
  status: null,
  start_time: null,

});

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  } 
    start_time: string,
    status: string
}


const editData = ref<EditData>({
  id: null,
    title: {
      uz: "",
      ru: ""
    },
    start_time: "",
    status: ""
})

const refresh = async (filter) => {
  isLoading.value = true;
  try {
    await store.getSmsSending(filter)
    smsSendingList.value = store.smsSendingList.results;
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
  refresh({ ...paginationFilter, ...filterSmsSending });
};

const searchByTitle = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    refresh(filterSmsSending);
  }, 500);
};

const saveNews = () => {
  refresh(filterSmsSending);
}

const handleDeleteModal = (id: number) => {
  smsId.value = id;
  UIkit.modal("#sms_sending-delete-modal").show();
};

const deleteSms = () => {
  refresh(filterSmsSending);
};

watch(
  () => filterSmsSending.search,
  () => {
    if (smsSendingList.value.length <= 10) {
      current.value = 1;
    }
  }
);

watch(
  
    () => filterSmsSending.start_time , 
    () => {
      refresh(filterSmsSending);
      
      if (smsSendingList.value.length <= 10) {
        current.value = 1;
      }
    },

);

watch(
  
    () => filterSmsSending.status , 
    () => {
      refresh(filterSmsSending);
      
      if (smsSendingList.value.length <= 10) {
        current.value = 1;
      }
    },

);

onMounted(async () => {
  await refresh(paginationFilter);
  await store.getStatus()
});
</script>

<template>
  <div>


      <div class="md:flex items-center justify-between mb-5">
        <form class="mb-4 md:flex items-center gap-5 md:w-9/12">
          <div class="md:w-1/2">
            <label for="search" class="dark:text-gray-300">
              {{ $t("Search") }}
            </label>
            <input
                id="search"
                type="text"
                class="form-input"
                :placeholder="$t('Search')"
                v-model="filterSmsSending.search"
                @input="searchByTitle"
            />
          </div>

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="role" class="dark:text-gray-300">
              {{ $t("Status") }}
            </label>
            <v-select
                :placeholder="$t('Status')"
                :options="store.statusList.results"
                v-model="filterSmsSending.status"
                :getOptionLabel="(name) => name.title[$i18n.locale]"  
                :reduce="(name) => name.id"
                >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="from" class="dark:text-gray-300">
              {{ $t("from") }}
            </label>
            <VueDatePicker v-model="filterSmsSending.start_time"></VueDatePicker>
          </div>

        </form>
        <button
            class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
            @click="editData = {}"
            uk-toggle="target: #newsModal"
        >
          {{ $t("Add") }}
        </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="smsFields" :items="smsSendingList">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
      </template>

      <template #header="data">
        {{ t(data.text).toUpperCase() }}
      </template>

      <template #item-title="item">
        {{ item.template.title[$i18n.locale] }}
      </template>

      <template #item-status="item">
        <span
          :class="item.status.unique_name == 'not_sent' ? 'rounded-md bg-danger px-4 pb-0.5 text-white' : item.status.unique_name == 'in_progress' ? 'rounded-md bg-warning px-4 pb-0.5 text-white' : 'rounded-md bg-primary px-4 pb-0.5 text-white'">{{
            item.status.title[$i18n.locale] }}</span>
      </template>

      <template #item-from_to="item">
        <div>{{ item.start_time }}</div>
      </template>


      <template #item-actions="item">
        <div class="flex my-2">
          <button class="btn-warning btn-action" uk-toggle="target: #newsModal" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination class="mt-10 tw-pagination" :current="current" :total="store.smsSendingList.count" :per-page="10"
      :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')" @page-changed="changePagionation" />

    <AddEditModal  :editData="editData" @saveNews="saveNews"/>
    <DeleteSmsSendingModal  @deleteSms="deleteSms" :smsId="smsId"/>
  </div>
</template>