<script setup lang="ts">


//IMPORTED FILES
import UIkit from "uikit";
import {watchDebounced} from '@vueuse/core';
import knowledgeStore from "@/modules/KnowledgeBase/store";
import {nextTick, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import AddEditNearbyPlaces from "./components/AddEditNearbyPlaces.vue";
import {formatPhoneNumber} from "@/mixins/features";
import UIKit from "uikit";
import {LocationPlace} from "../../interfaces";
import {toast} from "vue3-toastify";
import {headerPlaces} from '../../constants/index'


//DECLARED VARIABLES
const {t} = useI18n();
const store = knowledgeStore();
const loading = ref(false);
const itemForDelete = ref<number | null>();
const params = ref({
  page: 1,
  page_size: 10,
  search: null
});
const oldData = ref<LocationPlace>();
const openModal = (data: any) => {
  if (data) oldData.value = data;
  else oldData.value = undefined;
  nextTick(() => {
    UIKit.modal("#location-modal").show();
  });
};
const props = defineProps<{
  knowledge: string
  params: {
    page: number,
    page_size: number
  }
}>();
let toRefresh = ref(false)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.value.page = JSON.parse(page)
  }
  if (page_size) {
    params.value.page_size = JSON.parse(page_size)
  }
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'Locations') {
    await getListForm()
    await store.getRegions({page_size: 1000})

  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'Locations') {
    params.value.page = props.params.page
    params.value.page_size = props.params.page_size
    await getListForm()
    await store.getRegions({page_size: 1000})
  }
})
watchDebounced(() => params.value.search, async function () {
  localStorage.setItem('page', '1')
  params.value.page = 1
  getListForm()
}, {deep: true, debounce: 500, maxWait: 5000,})


//FUNCTIONS
const changePagination = (page: any) => {
  params.value.page = page;
  getListForm()
};
const onPageSizeChanged = (e: any) => {
  params.value.page_size = e
  params.value.page = 1
  getListForm()
}
const handleDeleteModal = (id: number) => {
  itemForDelete.value = id
  UIKit.modal('#location-delete-modal').show()
}

async function getListForm() {
  loading.value = true;
  await store.getAllFormsList(params.value);
  loading.value = false;
}

const getRegion = () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'Locations') {
    store.getRegions({page_size: 1000})
  }
}
const deleteAction = async () => {
  loading.value = true
  try {
    await store.deleteLokation(itemForDelete.value)
    await UIkit.modal("#location-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.locationList.count > 1 && ((store.locationList.count - 1) % params.value.page == 0)) {
      params.value.page = params.value.page - 1
      getListForm()
    } else {
      getListForm()
    }
    loading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};

</script>

<template>
  <div class="card">
    <div class="flex items-end gap-2 mb-7 justify-between">
      <div>
        <label for="search" class="dark:text-gray-300">
          {{ t("Search") }}
          <input
              id="search"
              type="text"
              class="form-input"
              v-model="params.search"
          />
        </label>
      </div>


      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full "
              @click="openModal(false)">
        {{ t("Add") }}
      </button>
    </div>
    <div>
      <EasyDataTable
          hide-footer
          theme-color="#7367f0"
          :loading="loading"
          :headers="headerPlaces"
          :items="store.locationList.results"
      >
        <template #empty-message>
          <div>{{ $t('no_available_data') }}</div>
        </template>
        <template #header="header">
          {{ $t(header.text) }}
        </template>


        <template #item-title="item">
          {{ item['title_' + $i18n.locale] }}
        </template>
        <template #item-region="item">
          {{ item.region['name_' + $i18n.locale] }}
        </template>
        <template #item-address="item">
          {{ item['address_' + $i18n.locale] }}
        </template>
        <template #item-phones="item">
          <div v-for="phone in item.phones">
            {{ formatPhoneNumber(phone) }}
          </div>
        </template>
        <template #header-actions="item">
          <div class="flex justify-end">
            {{ $t(item.text) }}
          </div>
        </template>
        <template #item-actions="item">
          <div class="flex my-4 justify-end">
            <button class="btn-warning btn-action" @click="openModal(item)">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                class="ml-3 btn-danger btn-action"
                @click="handleDeleteModal(item.id)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </template>
      </EasyDataTable>
      <TwPagination
          :restart="toRefresh"
          :total="store.locationList.count"
          class="mt-10 tw-pagination"
          :current="params.page"
          :per-page="params.page_size"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagination"
          @per-page-changed="onPageSizeChanged"
      />
    </div>

    <AddEditNearbyPlaces :oldData="oldData" @refresh="getListForm" @getRegion="getRegion"/>
    <DeleteModal @delete-action="deleteAction" id="location-delete-modal"/>
  </div>
</template>

<style>
.vue3-easy-data-table__loading-mask[data-v-19cc4b1b] {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
