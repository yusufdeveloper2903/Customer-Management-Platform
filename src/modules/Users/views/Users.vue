<script setup lang="ts">
//Imported files

import {onMounted, reactive, ref} from "vue";
import users from "../store/index";
import {fields} from "../constants/index";
import UIkit from "uikit";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import DeleteModal from "@/components/DeleteModal.vue";
import {useI18n} from "vue-i18n";


//Declared files
const {t} = useI18n()
const store = users();
const router = useRouter();
const userId = ref<number>(0);
const isLoading = ref(false);
let allUsers = ref<any>([])
let pageTo = ref<number>(0)
let pageFrom = ref<number>(0)
const filterUsers = reactive({
  page_size: 10,
  page: 1,
  search: "",
});


//Mounted

onMounted(() => {
  refresh()
})


//FUNCTIONS
const handleDeleteModal = (id: number) => {
  UIkit.modal("#user-delete-modal").show();
  userId.value = id;
};


const refresh = () => {
  isLoading.value = true;
  try {
    allUsers.value = store.usersList.results.slice(0, filterUsers.page_size)
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
    allUsers.value = allUsers.value.filter(item => item.id !== userId.value);
    store.usersList.results = store.usersList.results.filter(item => item.id !== userId.value);
    store.usersList.count = store.usersList.results.length
    UIkit.modal("#user-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    refresh()
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};

const changePagionation = (e: number) => {
  filterUsers.page = e
  pageTo.value = e * filterUsers.page_size
  pageFrom.value = (e * filterUsers.page_size) - filterUsers.page_size
  if (pageFrom.value || pageTo.value) {
    allUsers.value = store.usersList.results.slice(pageFrom.value, pageTo.value)
  }

};


const onPageSizeChanged = (event: number) => {
  filterUsers.page_size = event
  allUsers.value = store.usersList.results.slice(0, event)
};

const openDetailePage = (val) => {
  store.userDetail = val
  router.push({name: 'users detail', params: {id: val.id}})
}

//WATCHERS
watchDebounced(() => filterUsers.search, async function () {
  filterUsers.page = 1
  allUsers.value = store.usersList.results.filter(item => item.name.includes(filterUsers.search));
}, {deep: true, debounce: 500, maxWait: 5000,})

</script>

<template>
  <div>
    <div class="card">
      <div class="md:flex items-end justify-between mb-7">
        <form class="md:flex items-center gap-5 md:w-7/12">
          <div>
            <label for="search" class="dark:text-gray-300">
              {{ t("Search") }}
            </label>
            <input
                id="search"
                type="text"
                class="form-input"
                v-model="filterUsers.search"
            />
          </div>
        </form>
        <button
            class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
            @click="
                router.push({ name: 'add users'})
              "
        >
          {{ t("Add") }}
        </button>
      </div>
      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :loading="isLoading"
          :headers="fields"
          :items="allUsers"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ t("no_available_data") }}</div>
        </template>
        <template #header="header">
          {{ t(header.text) }}
        </template>


        <template #item-name="items">
          <span class="text-nowrap">
          {{ items.name }}

          </span>
        </template>


        <template #item-phone="items">
          <span
              class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center">{{
              items.phone
            }}</span>
        </template>
        <template #item-hobbies="items">
          <span
              v-if="items.hobbies.length"
              v-for="item in items.hobbies"
              class="rounded bg-success px-4 p-1 pt-1 inline m-1 text-white"
          >
            {{ item }}
          </span>
        </template>

        <template #header-actions="item">
          <div class="flex justify-end">
            {{ $t(item.text) }}
          </div>
        </template>
        <template #item-actions="items">
          <div class="flex justify-end">
            <button
                class="btn-warning btn-action"
                @click="openDetailePage(items)"
            >
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                class="ml-3 btn-danger btn-action"
                @click="handleDeleteModal(items.id)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </template>
      </EasyDataTable>
      <TwPagination
          class="mt-10 tw-pagination"
          :current="filterUsers.page"
          :total="store.usersList.count"
          :per-page='filterUsers.page_size'
          :text-before-input="t('go_to_page')"
          :text-after-input="t('forward')"
          @page-changed="changePagionation"
          @per-page-changed="onPageSizeChanged"
      />
      <DeleteModal @delete-action="deleteAction" id="user-delete-modal"/>
    </div>
  </div>
</template>
