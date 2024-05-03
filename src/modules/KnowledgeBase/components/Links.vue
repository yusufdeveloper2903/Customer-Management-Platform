<script setup lang="ts">


//IMPORTED FILES
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {linksFields} from "../constants";
import KnowledgeBase from "../store/index";
import {Link} from "../interfaces/index";
import CreateLinks from "./modals/CreateLinks.vue";
import UIkit from "uikit";
import PhoneNumbers from "./Phones.vue"
import {useI18n} from "vue-i18n";
import {EditLink} from '../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = KnowledgeBase()
const items = ref<Link[]>([]);
const currentRow = ref<Link | null>(null);
const props = defineProps<{
  knowledge: string
}>();
const params = reactive({
  page_size: 10,
  page: 1,
  search: null
});
const editLink = ref<EditLink>({
  id: null,
  type: "",
  url: ""
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let knowledgeBase = localStorage.getItem('knowledgeBase')
  if (knowledgeBase == 'contacts') {
    await refresh()
  }
});


//WATCHERS
watch(() => props.knowledge, async function (val) {
  if (val == 'contacts') {
    await refresh()
  }
})


//FUNCTIONS
const dragStart = (item: any) => {
  currentRow.value = item;
};

const dragOver = (e: any) => {
  e.preventDefault();
};

const dragDrop = async (item: Link) => {
  event?.preventDefault();
  await store.create_drag_and_drop({id1: currentRow.value?.id, id2: item.id})
  await refresh();
  toast.success(t("updated_successfully"));
};

const saveContact = () => {
  refresh();
}
const changePagionation = (e: number) => {
  params.page = e;
  refresh();
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const deleteLinks = async () => {
  isLoading.value = true
  try {
    await store.deleteSocialMediaLinks(itemId.value)
    await UIkit.modal("#conctacs-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.linksList.count > 1 && ((store.linksList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
}
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getSocialMediaLinks(params)
    items.value = store.linksList.results
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};


</script>


<template>
  <div class="card">
    <div class="flex justify-between items-end mb-7">
      <h1 class="font-semibold text-lg text-success">{{ $t('social_links') }}</h1>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full "
              uk-toggle="target: #links" @click="editLink = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th v-for="field in linksFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
          {{ $t(field.text) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in store.linksList?.results" :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
        <td class="px-6 whitespace-no-wrap text-left ">{{ item.id }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item.type }}</td>
        <td class="px-6 whitespace-no-wrap text-left">{{ item.url }}</td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-left">
            <button class="btn-warning btn-action" uk-toggle="target: #links" @click="editLink = item">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button @click="itemId = item.id" class="ml-3 btn-danger btn-action"
                    uk-toggle="target: #conctacs-main-delete-modal">
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="empty_table" v-if="!store.linksList.results.length">{{ $t('no_available_data') }}</div>

    <TwPagination
        class="mt-10 tw-pagination"
        :current="params.page"
        :total="store.linksList.count"
        :per-page="params.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
        @per-page-changed="onPageSizeChanged"
    />
    <DeleteModal @delete-action="deleteLinks" id="conctacs-main-delete-modal"/>
    <CreateLinks :editData="editLink" @saveContact="saveContact"/>
  </div>


  <div class="card mt-10">
    <PhoneNumbers :knowledge="props.knowledge"/>
  </div>
</template>