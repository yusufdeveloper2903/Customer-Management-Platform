<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";
import {linksFields} from "../constants";
import ConfirmModal from "@/components/ConfirmModals/ConfirmModal.vue";
import KnowledgeBase from "../store/index";
import {Link} from "../interfaces/index";
import CreateLinks from "./modals/CreateLinks.vue";
import UIkit from "uikit";
import PhoneNumbers from "./Phones.vue"
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const isLoading = ref<boolean>(false);
const itemId = ref<number | null>(null);
const store = KnowledgeBase()
const items = ref<Link[]>([]);
const currentRow = ref<Link | null>(null);


const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const filter = ref({
  page_size: 10,
})

interface EditLink {
  id: null | number,
  type: string | number,
  url: string
}

const editLink = ref<EditLink>({
  id: null,
  type: "",
  url: ""
})

const dragStart = (item) => {
  currentRow.value = item;
};

const dragOver = (e) => {
  e.preventDefault();
};

const dragDrop = (item: Link) => {
  event?.preventDefault();
  store.create_drag_and_drop({id1: currentRow.value?.id, id2: item.id}).then(() => {
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
  refresh(paginationFilter);
};

const onPageSizeChanged = (e) => {
  paginationFilter.page_size = e
  paginationFilter.page = 1
  refresh(paginationFilter)
}

const deleteLinks = () => {
  store.deleteSocialMediaLinks(itemId.value).then(() => {
    refresh(paginationFilter);
    UIkit.modal("#links-delete").hide();
  })
};

const refresh = async (filter) => {
  isLoading.value = true;
  try {
    store.getSocialMediaLinks(filter)
    items.value = store.linksList?.results
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
  <div class="card">
    <div class="flex justify-between items-center mb-5">
      <h1 class="font-semibold text-lg mb-4 text-success">{{ $t('Links') }}</h1>
      <button class="btn-primary" uk-toggle="target: #links" @click="editLink = {}">
        {{ $t("Add") }}
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
      <thead>
      <tr>
        <th v-for="field in linksFields"
            class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-center text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
          {{ $t(field.text)}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in store.linksList?.results" :key="item.id"
          class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move"
          :draggable="true" @dragstart="dragStart(item)" @dragover="dragOver" @drop="dragDrop(item)">
        <td class="px-6 whitespace-no-wrap text-center ">{{ item.position }}</td>
        <td class="px-6 whitespace-no-wrap text-center">{{ item.type }}</td>
        <td class="px-6 whitespace-no-wrap text-center">{{ item.url }}</td>
        <td class="px-6 whitespace-no-wrap">
          <div class="flex py-2 justify-center">
            <button class="btn-warning btn-action" uk-toggle="target: #links" @click="editLink = item">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button @click="itemId = item.id" class="ml-3 btn-danger btn-action" uk-toggle="target: #links-delete">
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="empty_table" v-if="!store.linksList.results.length">{{ $t("empty_text") }}</div>

    <TwPagination
        class="mt-10 tw-pagination"
        :current="paginationFilter.page"
        :total="store.linksList.count"
        :per-page="paginationFilter.page_size"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
        @per-page-changed="onPageSizeChanged"
    />

    <ConfirmModal :title="$t('delete')" :cancel="$t('Cancel')" :ok="$t('delete')" id="links-delete" @ok="deleteLinks"
                  @cancel="itemId = null">
      <p>{{ $t('Are you sure?') }}</p>
    </ConfirmModal>

    <CreateLinks :editData="editLink" @saveContact="saveContact"/>
  </div>


  <div class="card mt-10">
    <PhoneNumbers/>
  </div>
</template>