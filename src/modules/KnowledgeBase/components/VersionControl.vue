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
import VueDatePicker from "@vuepic/vue-datepicker";
import {watchDebounced} from "@vueuse/core";


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
  page: 1,
  is_active: null
});
const props = defineProps<{
  knowledge: string
  params: {
    page: number,
    page_size: number
  }
}>();

let toRefresh = ref(false)
const dateConfig = ref({})
const changeColor = (val: string) => {
  if (val) {
    return t('bg-success')
  } else {
    return t('bg-secondary')
  }
}
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
  if (knowledgeBase == 'version_control') {
    await refresh()
  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'version_control') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh()
  }
})
watchDebounced(() => params.start_date, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watchDebounced(() => params.is_active, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        params.start_date = started_date.split('T')[0]
        params.end_date = end_date.split('T')[0]
      } else {
        params.start_date = ""
        params.end_date = ""
      }
    }
)

//FUNCTIONS
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteVersion(userId.value)
    await UIkit.modal("#version-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.versionControlList.count > 1 && ((store.versionControlList.count - 1) % params.page_size == 0)) {
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

const changeName = (val: any) => {
  if (val) {
    return t('Active')
  } else {
    return t('Inactive')
  }
}
let statusList = ref([
  {
    title: 'Active',
    value: true
  },
  {
    title: 'Inactive',
    value: false
  }
])

const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const saveVersionControl = () => {
  refresh()
}

watchDebounced(() => params.start_date, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh()
}
</script>

<template>
  <div class="card">

    <div class="md:flex items-end justify-between mb-7">
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
              :options="statusList"
              v-model="params.is_active"
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
          <VueDatePicker format="dd-MM-yyyy" :enableTimePicker="false" auto-apply :range="{ partialRange: false }"
                         v-model="dateConfig"/>

        </div>
      </div>
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

      <template #item-is_active="item">
        <span
            :class="changeColor(item.is_active)" class="rounded  px-4 p-1 pt-1 inline  text-white"
        >
  {{ changeName(item.is_active) }}
</span>
      </template>
      <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>
      <template #item-actions="item">
        <div class="flex my-4 justify-end">
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
