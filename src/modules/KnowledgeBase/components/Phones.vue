<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {phoneNumberFields} from "../constants";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import KnowledgeBase from "../store/index";
import {Link, Phones} from "../interfaces/index";
import UIkit from "uikit";
import CreatePhones from "./modals/CreatePhones.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const current = ref<number>(1);
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = KnowledgeBase()
const items = ref<Phones[]>([]);
const currentRow = ref<Link | null>(null);


const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const filter = ref({
  page_size: 10,
})

interface EditPhone {
  id: null | number,
  number: string,
}

const editPhone = ref<EditPhone>({
  id: null,
  number: "",
})

const dragStart = (item) => {
  currentRow.value = item;
};

const dragOver = (e) => {
  e.preventDefault();
};

const dragDrop = (item: Link) => {
  event?.preventDefault();
  store.create_phones_drag_and_drop({id1: currentRow.value?.id, id2: item.id}).then(() => {
    refresh(paginationFilter);
    setTimeout(() => {
      toast.success("ok");
    }, 200);
  })

};

const saveContact = () => {
  refresh(filter);
}


const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({...paginationFilter});
};

const deletePhone = () => {
  store.deletePhones(itemId.value).then(() => {
    refresh(paginationFilter);
    UIkit.modal("#phone-delete").hide();
  })
};


// phone number

const refresh = async (filter) => {
  isLoading.value = true;
  try {
    store.getPhones(filter)
    items.value = store.phonesList?.results
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

  isLoading.value = false;
};

onMounted(() => {
  refresh(paginationFilter);
});
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-5">
      <h1 class="font-semibold text-lg mb-4 text-success">{{ $t('Phone numbers') }}</h1>
      <button class="btn-primary" uk-toggle="target: #phones" @click="editPhone = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th
            v-for="field in phoneNumberFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider"
        >
          {{ field.text }}

        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="item in store.phonesList?.results"
          :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true"
          @dragstart="dragStart(item)"
          @dragover="dragOver"
          @drop="dragDrop(item)"
      >
        <td class="px-6 whitespace-no-wrap">
          {{ item.position }}
        </td>

        <td class="px-6 whitespace-no-wrap">{{ item.number }}</td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2">
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

    <TwPagination
        class="mt-10 tw-pagination"
        :current="current"
        :total="5"
        :per-page="10"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
    />


    <CreatePhones :editData="editPhone" @saveContact="saveContact"/>


    <ConfirmModal :title="$t('delete')" :cancel="$t('Cancel')" :ok="$t('delete')" id="phone-delete" @ok="deletePhone"
                  @cancel="itemId = null">
      <p>{{ $t('Are you sure?') }}</p>
    </ConfirmModal>
  </div>
</template>