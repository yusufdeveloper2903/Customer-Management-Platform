<script setup lang="ts">

// IMPORTED FILES

import {fields} from "../constants/index";
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import users from "../store/index";
import {toast} from "vue3-toastify";
import {formatPhoneNumber} from "@/components/Formatters/Formatters";
import DoubleRight from "../img/double-right-chevron-svgrepo-com.svg"
import {useI18n} from 'vue-i18n'
import {formatDate} from "@/mixins/features";
import {watchDebounced} from "@vueuse/core";
import {params} from '../interfaces'

// DECLARED VARIABLES

const {t} = useI18n()
const store = users();
let usersList = ref<object[]>([]);
const isLoading = ref(false);
const router = useRouter()
const filterUsers = reactive<params>({
  page_size: 10,
  page: 1,
  search: null,
});

// MOUNTED

onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    filterUsers.page = JSON.parse(page)
  }
  if (page_size) {
    filterUsers.page_size = JSON.parse(page_size)
  }
  await refresh()
});


// WATCHERS


watchDebounced(() => filterUsers.search, async () => {
      filterUsers.page = 1
  localStorage.setItem('page', '1')

  await refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
)

// FUNCTIONS

const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getUsers(filterUsers);
    usersList.value = store.usersList.results;
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
};
const changePagination = (e: number) => {
  filterUsers.page = e;
  refresh();
};
const onPageSizeChanged = (event: number) => {
  filterUsers.page = 1
  filterUsers.page_size = event
  refresh()
}
const showDetailPage = (item: any) => {
  router.push({name: 'user detail', params: {id: item.id}})
};
</script>

<template>
  <div>
    <div class="card">
      <div class="md:flex items-center justify-between mb-9">
        <form class=" md:flex items-center gap-5 md:w-5/12">
          <div>
            <label for="search" class="dark:text-gray-300">
              {{ $t("Search") }}
            </label>

            <input
                id="search"
                type="text"
                class="form-input"
                v-model="filterUsers.search"
            />
          </div>

        </form>
      </div>

      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :loading="isLoading"
          :headers="fields"
          :items="usersList"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ $t("no_available_data") }}</div>
        </template>
        <template #header="header">
          {{ $t(header.text) }}
        </template>


        <template #item-phone="items">
          <span v-if="items.phone">
            {{ formatPhoneNumber(items.phone) }}
          </span>
        </template>
        <template #item-created_date="data">
          <span>
            {{ formatDate(data.created_date) }}
          </span>
        </template>
        <template #item-last_login="data">
          <span>
            {{ formatDate(data.last_login) }}
          </span>
        </template>

        <template #item-is_active="items">
          <label class=" mt-2 relative inline-flex items-center cursor-pointer">
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

        <template #item-detail="item">
          <button @click="showDetailPage(item)" class="btn-success btn-action my-1"><img :src="DoubleRight" alt="Icon">
          </button>
        </template>
      </EasyDataTable>

      <TwPagination
          class="mt-10 tw-pagination"
          :current="filterUsers.page"
          :total="store.usersList.count"
          :per-page="filterUsers.page_size"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagination"
          @per-page-changed="onPageSizeChanged"
      />

    </div>
  </div>
</template>
