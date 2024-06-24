<script setup lang="ts">


//IMPORTED FILES
import {splashFields} from "../constants";
import knowledgeBase from ".././store/index";
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import SplashModal from "./modals/SplashModal.vue";
import {Splash} from "../interfaces/index";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";


//DECLARED VARIABLES
const {t, locale} = useI18n()
const store = knowledgeBase();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const dataToEdit = ref<Splash>({
  id: null,
  title_ru: '',
  title_uz: '',
  title_kr: '',
  color: "",
  image: null,
  version: "",
  is_active: false,
});
const params = reactive({
  page: 1,
  page_size: 10,
  search: ''
})
const props = defineProps<{
  knowledge: string
  params: {
    page: number,
    page_size: number
  }
}>();
let toRefresh = ref(false)
const image = ref<string>("");
const imageCard = ref();


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
  if (knowledgeBase == 'splash') {
    await refresh()

  }
})


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'splash') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh()
  }

})
watchDebounced(() => params.search, async function () {
  params.page = 1
  localStorage.setItem('page', '1')
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000})


//FUNCTIONS
const refresh = async () => {
  await store.getSplash(params);
};


const openModal = () => {
  UIKit.modal("#splash").show()
  dataToEdit.value = <Splash>{};
}


const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIKit.modal("#file-modal-image").show();
  });
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteSplash(itemToDelete.value)
    await UIKit.modal("#splash-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.splashList.count > 1 && ((store.splashList.count - 1) % params.page_size == 0)) {
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
const handleDeleteModal = (id: number) => {
  itemToDelete.value = id
  UIKit.modal("#splash-delete-modal").show()
};

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
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              @click="openModal">
        {{ t("Add") }}
      </button>
    </div>
    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :loading="isLoading"
        :headers="splashFields"
        :items="store.splashList.results"
    >
      <template #empty-message>
        <div>{{ t('no_available_data') }}</div>
      </template>

      <template #header="header">
        {{ t(header.text) }}
      </template>

      <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>

      <template #item-title="item">
        {{ item['title_' + locale] }}
      </template>

      <template #item-image="{ image }">
        <div class="py-3 flex justify-left gap-3">
          <img
              v-if="image"
              class="w-[45px] h-[45px] rounded"
              :src="image"
              alt="Rounded avatar"
              @click="onShowFile(image)"
              style="aspect-ratio: 1/1 "
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon icon="Camera" color="#356c2d"/>
          </div>
        </div>
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

      <template #item-actions="data">
        <div class="flex my-4 justify-end">
          <button uk-toggle="target: #splash" class="btn-warning btn-action" @click="dataToEdit = data">
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
        :total="store.splashList.count"
        class="mt-10 tw-pagination"
        :current="params.page"
        :restart="toRefresh"
        :per-page="params.page_size"
        :text-before-input="t('go_to_page')"
        :text-after-input="t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />
  </div>
  <DeleteModal @delete-action="deleteAction" :id="'splash-delete-modal'"/>
  <SplashModal :edit-data="dataToEdit" @refresh="refresh"/>
  <ShowFileModal :image="image" id="file-modal-image" ref="imageCard"/>
</template>
