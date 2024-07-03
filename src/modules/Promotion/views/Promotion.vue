<script setup lang="ts">


//IMPORTED FILES
import promotionBase from '../store/index'
import {newsPromotionTable} from "../constants";
import {onMounted, reactive, ref,} from "vue";
import CreatePromotionModal from "../components/CreatePromotionModal.vue"
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import UIkit from "uikit";
import {formatDate} from "@/mixins/features";
import {EditData} from '../Interface/index'


//DECLARED VARIABLES
const {t} = useI18n()
const itemId = ref<number | null | undefined>(null);
const promotionStorage = promotionBase()
const isLoading = ref(false);
const params = reactive({
  page_size: 10,
  search: null,
  page: 1,
  status: null
});
const editData = ref<EditData>({
  id: null,
  title: '',
  title_ru: '',
  title_uz: '',
  title_kr: '',
  description_ru: '',
  description_uz: '',
  description_kr: '',
  is_active: false,
  background_photo: '',
  detail_photo: '',
  start_date: '',
  end_date: '',
  description: '',
  status: '',
  modified_date: ''
})
const listStatus = ref([
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Draft',
    value: 'DRAFT'
  },
  {
    title: 'Finished',
    value: 'FINISHED'
  }
])

//WATCHERS
watchDebounced(
    () => params.search,
    async () => {
      params.page = 1;
      localStorage.setItem('page', '1')
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);
watchDebounced(
    () => params.status,
    async () => {
      params.page = 1;
      localStorage.setItem('page', '1')
      await refresh(params)
    }, {deep: true, debounce: 500, maxWait: 5000}
);

//MOUNTED
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.page = JSON.parse(page)
  }
  if (page_size) {
    params.page_size = JSON.parse(page_size)
  }
  await refresh(params)
});


//FUNCTIONS
const refresh = async (val: any) => {
  isLoading.value = true;
  try {
    await promotionStorage.getPromotionList(val)
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};

const changeColor = (val: string) => {
  if (val == 'ACTIVE') {
    return t('bg-success')
  } else if (val == 'DRAFT') {
    return t('bg-warning')
  } else {
    return t('bg-secondary')
  }
}

const changeStatus = (val: string) => {
  if (val == 'ACTIVE') {
    return t('Active')
  } else if (val == 'DRAFT') {
    return t('Draft')
  } else {
    return t('Finished')
  }
}

function saveProducts() {
  refresh(params)
}

const changePagination = (e: number) => {
  params.page = e;
  refresh(params);
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh(params)
}
const deleteAction = async () => {
  isLoading.value = true
  try {
    await promotionStorage.deletePromotion(itemId.value)
    await UIkit.modal("#delete-promotion-item").hide();
    toast.success(t('deleted_successfully'));
    if (promotionStorage.promotionList.count > 1 && ((promotionStorage.promotionList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh(params)
    } else {
      await refresh(params)
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};
const handleDeleteModal = (id: number) => {
  itemId.value = id
  UIkit.modal("#delete-promotion-item").show()
};
const onGetData = async (val: any) => {
  try {
    await promotionStorage.getPromotionId(val)
    editData.value = promotionStorage.promotionListId
  } catch (error) {
    toast.error(t('error'));
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <div class="flex justify-center gap-3 w-1/3">
        <label for="search">
          {{ $t('Search') }}
          <input type="text" class="form-input" v-model="params.search"/>
        </label>
        <div class="w-2/3">
          <label class="dark:text-gray-300 ">
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
      </div>

      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              uk-toggle="target: #create_edit_promotion" @click="editData={}">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="newsPromotionTable"
                   :items="promotionStorage.promotionList.results">
      <template #empty-message>
        <div>{{ $t('no_available_data') }}</div>
      </template>
      <template #header="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item['title_' + $i18n.locale] }}
      </template>
      <template #item-start_date="item">
        {{ formatDate(item.start_date) }}
      </template>
      <template #item-end_date="item">
        {{ formatDate(item.end_date) }}
      </template>
      <template #item-is_published="item">
        <label
            className="relative inline-flex items-left cursor-pointer">
          <input
              type="checkbox"
              v-model="item.is_published"
              class="sr-only peer"
              disabled
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
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
      <template #item-actions="item">
        <div class="flex my-4 justify-end">
          <button class="btn-warning btn-action" uk-toggle="target: #create_edit_promotion" @click="onGetData(item.id)">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="promotionStorage.promotionList.count" class="mt-10 tw-pagination"
                  :current="params.page"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>
    <CreatePromotionModal :editData="editData" @saveProducts="saveProducts"/>
    <DeleteModal @delete-action="deleteAction" :id="'delete-promotion-item'"/>
  </div>

</template>
