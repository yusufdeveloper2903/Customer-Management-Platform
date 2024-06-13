<script setup lang="ts">


//IMPORTED FILES
import {storiesTable} from "../constants";
import StoriesStore from ".././store/index";
import {nextTick, onMounted, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import ShowPhotoGlobal from "@/components/ShowPhotoGlobal.vue";
import {useRouter} from "vue-router";


//DECLARED VARIABLES
let storiesList = ref<object[]>([]);
const {t} = useI18n()
const router = useRouter()
const store = StoriesStore();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const params = reactive({
  page: 1,
  page_size: 10,
  search: '',
  status: ''
})
let toRefresh = ref(false)
const image = ref<string>("");
const imageCard = ref();
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
const changeColor = (val: string) => {
  if (val == 'ACTIVE') {
    return t('bg-success')
  } else if (val == 'DRAFT') {
    return t('bg-warning')
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
  await refresh()

})


//WATCHERS
watchDebounced(() => params.search, function () {
  params.page = 1
  localStorage.setItem('page', '1')

  refresh()
}, {deep: true, debounce: 500, maxWait: 5000})

watchDebounced(
    () => params.status,
    async () => {
      params.page = 1;
      localStorage.setItem('page', '1')

      await refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);

//FUNCTIONS
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getStoriesList(params);
    storiesList.value = store.storiesList.results
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};


const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteStories(itemToDelete.value)
    await UIKit.modal("#stories-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.storiesList.count > 1 && ((store.storiesList.count - 1) % params.page_size == 0)) {
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
  UIKit.modal("#stories-main-delete-modal").show()
};
const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIKit.modal("#stories-modal-image").show();
  });
};
const changeName = (val) => {
  if (val === 'ACTIVE') {
    return t('Active')
  } else if (val === 'DRAFT') {
    return t('Draft')
  } else {
    return t('Finished')
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7  ">
      <div class="flex justify-center gap-3 w-1/3">
        <div class="w-1/3  mt-[0.10rem]">
          <label for="search">
            {{ $t('Search') }}
          </label>

          <input type="text" class="form-input" v-model="params.search"/>
        </div>

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
              @click="router.push('/stories-detail')">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :loading="isLoading"
        :headers="storiesTable"
        :items="storiesList"
    >
      <template #empty-message>
        <div class="dark:text-white">{{ $t("no_available_data") }}</div>
      </template>
      <template #header="header">
        {{ $t(header.text) }}
      </template>

      <template #item-subtitle="item">
        {{ item['subtitle_' + $i18n.locale] }}
      </template>
      <template #item-status="item">
     <span
         :class="changeColor(item.status)" class="rounded  px-4 p-1 pt-1 inline  text-white"
     >
  {{ changeName(item.status) }}
</span>
      </template>

      <template #item-avatar="item">
        <div class="py-3 flex justify-left gap-3">
          <img
              v-if="item.avatar"
              class="w-[45px] h-[45px] rounded"
              :src="item.avatar"
              alt="Rounded avatar"
              @click="onShowFile(item.avatar)"
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
      <template #header-actions="item">
        <div class="flex justify-end">
          {{ $t(item.text) }}
        </div>
      </template>
      <template #item-actions="data">
        <div class="flex my-4 justify-end">
          <button class="btn-warning btn-action"
                  @click="router.push(`/stories-detail/${data.id}`)">
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
        :total="store.storiesList.count"
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
  <DeleteModal @delete-action="deleteAction" id="stories-main-delete-modal"/>
  <ShowPhotoGlobal :image="image" id="stories-modal-image" ref="imageCard"/>
</template>
