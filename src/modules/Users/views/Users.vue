<script setup lang="ts">
import {fields} from "../constants/index";
import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import users from "../store/index";
import { toast } from "vue3-toastify";
import {formatPhoneNumber} from "../features";
import type { ClickRowArgument } from "vue3-easy-data-table";

// import {useI18n} from "vue-i18n";

// const {locale} = useI18n();
const store = users();
let usersList = ref<object[]>([]);
const isLoading = ref(false);
const router = useRouter()

const filterUsers = reactive({
  page_size: 10,
  search: "",
  role: null,
});

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});


const refresh = async (filter) => {
  isLoading.value = true;
  try {
    await store.getUsers(filter);
    usersList.value = store.usersList.results;
  } catch (error: any) {
    toast.error(
        error.response.data.msg || error.response.data.error || "Error"
    );
  }

  isLoading.value = false;
};


const current = ref<number>(1);

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({...paginationFilter, ...filterUsers});
};

const timeout = ref();

const searchByName = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    refresh(filterUsers);
  }, 500);
};

const showDetailPage = (item: ClickRowArgument) => {
  router.push({ name: 'user detail', params: { id: item.id } })
};

watch(
    () => filterUsers.search,
    () => {
      if (usersList.value.length <= 10) {
        current.value = 1;
      }
    }
);

onMounted(async () => {
  await refresh(paginationFilter);

});
</script>

<template>
  <div>
    <div class="card">
      <div class="md:flex items-center justify-between mb-5">
        <form class="mb-4 md:flex items-center gap-5 md:w-5/12">
          <div class="md:w-1/2">
            <label for="search" class="dark:text-gray-300">
              {{ $t("Search") }}
            </label>

            <input
                id="search"
                type="text"
                class="form-input"
                :placeholder="$t('Search')"
                v-model="filterUsers.search"
                @input="searchByName"
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
          @click-row="showDetailPage"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ $t("no_available_data") }}</div>
        </template>

        <template #header-full_name="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-last_login="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-phone="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-created_date="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-is_active="header">
          {{ $t(header.text).toUpperCase() }}
        </template>


        <template #item-phone="items">
          <span>
            {{ formatPhoneNumber(items.phone) }}
          </span>
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
      </EasyDataTable>

      <TwPagination
          class="mt-10 tw-pagination"
          :current="current"
          :total="store.usersList.count"
          :per-page="10"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagionation"
      />

    </div>
  </div>
</template>
