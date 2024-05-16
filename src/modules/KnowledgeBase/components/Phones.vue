<script setup lang="ts">

//IMPORTED FILES
import {onMounted, reactive, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {phoneNumberFields} from "../constants";
import KnowledgeBase from "../store/index";
import {Phones} from "../interfaces/index";
import UIkit from "uikit";
import CreatePhones from "./modals/CreatePhones.vue";
import {useI18n} from "vue-i18n";
import {EditPhone} from '../interfaces/index'

//DECLARED VARIABLES
const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = KnowledgeBase()
const items = ref<Phones[]>([]);
const currentRow = ref<Phones | null>(null);
const params = reactive({
  page_size: 10,
  page: 1,
  search: null
});
const editPhone = ref<EditPhone>({
  id: null,
  number: "",
})
const props = defineProps<{
  knowledge: string
}>();

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
const dragDrop = async (item: Phones) => {
  event?.preventDefault();
  await store.create_phones_drag_and_drop({id1: currentRow.value?.id, id2: item.id})
  await refresh();
  toast.success(t("updated_successfully"));
};

const saveContact = () => {
  refresh();
}


const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const onPageSizeChanged = (e) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const deletePhone = async () => {
  isLoading.value = true
  try {
    await store.deletePhones(itemId.value)
    await UIkit.modal("#phone-delete").hide();
    toast.success(t('deleted_successfully'));
    if (store.phonesList.count > 1 && ((store.phonesList.count - 1) % params.page_size == 0)) {
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
    await store.getPhones(params)
    items.value = store.phonesList.results
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};


</script>


<template>
  <div>
    <div class="flex justify-between items-end mb-7">
      <h1 class="font-semibold text-lg text-success">{{ $t('phone_numbers') }}</h1>
      <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full "
              uk-toggle="target: #phones" @click="editPhone = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th
            v-for="field in phoneNumberFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider secondTable"
        >
          {{ $t(field.text) }}

        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="item in store.phonesList.results"
          :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true"
          @dragstart="dragStart(item)"
          @dragover="dragOver"
          @drop="dragDrop(item)"
      >
        <td class="px-6 whitespace-no-wrap text-left">
          {{ item.id }}
        </td>

        <td class="px-6 whitespace-no-wrap text-left">{{ item.number }}</td>
        <td class="px-6 whitespace-no-wrap text-left">
          <div class="flex py-2 justify-end">
            <button
                class="btn-warning btn-action"
                uk-toggle="target: #phones"
                @click="editPhone = item"
            >
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                @click="itemId = item.id"
                class="ml-3 btn-danger btn-action"
                uk-toggle="target: #phone-delete"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="empty_table" v-if="!store.phonesList.results.length">{{ $t('no_available_data') }}</div>


    <TwPagination
        class="mt-10 tw-pagination"
        :current="params.page"
        :total="store.phonesList.count"
        :per-page="params.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagination"
        @per-page-changed="onPageSizeChanged"
    />


    <CreatePhones :editData="editPhone" @saveContact="saveContact"/>

    <DeleteModal @delete-action="deletePhone" id="phone-delete"/>

  </div>
</template>

<style lang="scss" scoped>
.secondTable:nth-child(3) {
  display: flex;
  justify-content: flex-end;
}
</style>