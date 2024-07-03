<script setup lang="ts">


//IMPORTED FILES
import {OnboardingTable} from "../constants";
import knowledgeBase from ".././store/index";
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import UIKit from "uikit";
import onBoardingModal from "../components/modals/OnboardingModal.vue";
import {Onboarding} from "../interfaces/index";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";


//DECLARED VARIABLES
const {t, locale} = useI18n()
const store = knowledgeBase();
const isLoading = ref(false);
const itemToDelete = ref<number | null>(null);
const currentRow = ref<Onboarding | null>(null);
const dataToEdit = ref<Onboarding>({
  id: null,
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  image: null,
  index: 0
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
  if (knowledgeBase == 'Onboarding') {
    await refresh()
  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'Onboarding') {
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
  isLoading.value = true;
  try {
    await store.getOnboarding(params);
  } catch (error: any) {
    toast.error(t("error"));
  }
  isLoading.value = false;
};

const openModal = () => {
  UIKit.modal("#onboarding_template").show()
  dataToEdit.value = <Onboarding>{};
}


const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIKit.modal("#onboarding-file-modal-image").show();
  });
};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteOnboarding(itemToDelete.value)
    await UIKit.modal("#onboarding-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.onBoarding.count > 1 && ((store.onBoarding.count - 1) % params.page_size == 0)) {
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
const handleDeleteModal = (id: number | null) => {
  itemToDelete.value = id
  UIKit.modal("#onboarding-main-delete-modal").show()
};

const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};


const dragDrop = async (item: Onboarding) => {
  event?.preventDefault();
  await store.create_onboarding_drag_and_drop({new_index: currentRow.value?.index, last_index: item.index, id: item.id})
  await refresh();
  toast.success(t("updated_successfully"));
};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <label for="search">
        {{ t('Search') }}
        <input
            v-model="params.search"
            type="text"
            class="form-input"
        />
      </label>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
              @click="openModal(false )">
        {{ t("Add") }}
      </button>
    </div>


    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th v-for="field in OnboardingTable"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider firstTable">
          {{ t(field.text) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in store.onBoarding?.results" 
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
          <td class="px-6 whitespace-no-wrap text-left">{{ index }}</td>
          <td class="px-6 whitespace-no-wrap text-left">
          <div class="py-3 flex justify-left gap-3">
          <img
              v-if="item.image"
              class="w-[45px] h-[45px] rounded"
              :src="item.image"
              alt="Rounded avatar"
              @click="onShowFile(item.image)"
              style="aspect-ratio: 1/1 "
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon icon="Camera" color="#356c2d"/>
          </div>
        </div>
        </td>
        <td class="px-6 whitespace-no-wrap text-left ">{{ item['title_' + locale] }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item['description_' + locale] }}</td>

        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-end">
            <button class="btn-warning btn-action" uk-toggle="target: #onboarding_template" @click="dataToEdit = item">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button @click="handleDeleteModal(item.id)" class="ml-3 btn-danger btn-action"
                    >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="empty_table" v-if="!store.onBoarding.results.length">{{ t('no_available_data') }}</div>

    <TwPagination
        :total="store.onBoarding.count"
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
  <DeleteModal @delete-action="deleteAction" id="onboarding-main-delete-modal"/>
  <onBoardingModal :edit-data="dataToEdit" @refresh="refresh"/>
  <ShowFileModal :image="image" id="onboarding-file-modal-image" ref="imageCard"/>
</template>

<style>
.firstTable:nth-child(5) {
  display: flex;
  justify-content: flex-end;
}
</style>
