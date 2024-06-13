<script setup lang="ts">


//IMPORTED FILES
import {newsTemplateTable} from "../constants";
import knowledgeBase from ".././store/index";
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import NewsTemplateModal from "../components/modals/NewsTemplateModal.vue";
import {NewsTemplate} from "../interfaces/index";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";
import UIkit from "uikit";


//DECLARED VARIABLES
const {t} = useI18n()
const store = knowledgeBase();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const dataToEdit = ref<NewsTemplate>({
  id: null,
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  file: null,
  url: "",
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
  if (knowledgeBase == 'News template') {
    await refresh()
  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'News template') {
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
  await store.getNewsTemplate(params);
};
const openModal = () => {
  UIkit.modal("#news_template", {
    selPanel: '.uk-modal-dialog',
    stack: false
  }).show()
  dataToEdit.value = {};
}


const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#file-modal-image").show();
  });
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteNewsTemplate(itemToDelete.value)
    await UIKit.modal("#newstemplate-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.newTemplate.count > 1 && ((store.newTemplate.count - 1) % params.page_size == 0)) {
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
  UIKit.modal("#newstemplate-main-delete-modal").show()
};

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <label for="search">
        {{ $t('Search') }}
        <input
            v-model="params.search"
            type="text"
            class="form-input"
        />
      </label>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              @click="openModal(false )">
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :loading="isLoading"
        :headers="newsTemplateTable"
        :items="store.newTemplate.results"
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
      <template #item-description="item">
        {{ item['description_' + $i18n.locale] }}
      </template>
      <template #item-url="{ url }">
        <a :href="url" class="">{{ url }}</a>
      </template>
      <template #item-photo="{ file }">
        <div class="py-3 flex justify-left gap-3">
          <img
              v-if="file"
              class="w-[45px] h-[45px] rounded "
              :src="file"
              alt="Rounded avatar"
              @click="onShowFile(file)"
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
          <button uk-toggle="target: #news_template" class="btn-warning btn-action" @click="dataToEdit = data">
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
        :total="store.newTemplate.count"
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
  <DeleteModal @delete-action="deleteAction" id="newstemplate-main-delete-modal"/>
  <NewsTemplateModal :edit-data="dataToEdit" @refresh="refresh"/>
  <ShowFileModal :image="image" id="file-modal-image" ref="imageCard"/>
</template>
