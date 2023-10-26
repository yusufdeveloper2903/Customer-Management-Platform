<script setup lang="ts">
import {fields} from "../constants/index";
import {onMounted, reactive, ref, watch} from "vue";
import DeleteUserModal from "../components/DeleteUserModal.vue";
import UIkit from "uikit";
import {useRouter} from "vue-router";
import users from "../store/index";
import {toast} from "vue3-toastify";
import {formatPhoneNumber} from "../features";
import {useI18n} from "vue-i18n";

const {locale} = useI18n();
const store = users();
const router = useRouter();
let usersList = ref<object[]>([]);
const userId = ref<number | null>(null);
const isLoading = ref(false);

const filterUsers = reactive({
  page_size: 10,
  search: "",
  role: null,
});

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const handleDeleteModal = (id: number) => {
  userId.value = id;
  UIkit.modal("#user-delete-modal").show();
};

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

const deleteUser = () => {
  refresh(filterUsers);
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

watch(
    () => filterUsers.role,
    () => {
      refresh(filterUsers);

      if (usersList.value.length <= 10) {
        current.value = 1;
      }
    }
);

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

  await store.getUsersRoles();
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

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="role" class="dark:text-gray-300">
              {{ $t("Role") }}
            </label>

            <v-select
                :placeholder="$t('Role')"
                :options="store.usersRolesList.results"
                :getOptionLabel="(role) => role.name[locale]"
                :reduce="(role) => role.id"
                v-model="filterUsers.role"
            >
              <template #no-options>{{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
        </form>
        <button
            class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
            @click="router.push('/add-user')"
        >
          {{ $t("add") }}
        </button>
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

        <template #header-name="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-username="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-phone="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-region="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-role="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-is_active="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #header-actions="header">
          {{ $t(header.text).toUpperCase() }}
        </template>

        <template #item-name="items">
          <div class="py-3 flex items-center gap-3">
            <img v-if="items && items.photo"
                 class="w-[45px] h-[45px] rounded object-cover"
                 :src="items.photo"
                 alt="Rounded avatar"
            />
            <div
                v-else
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

            {{ items.name }}
          </div>
        </template>
        <template #item-phone="items">
          <span>
            {{ formatPhoneNumber(items.phone) }}
          </span>
        </template>
        <template #item-username="items">
          <span>
            {{ items.username }}
          </span>
        </template>

        <template #item-region="items">
          <span v-for="region in items.regions">
            {{ region.name[locale] }},
          </span>
        </template>

        <template #item-role="items">
          <span v-for="userRole in items.role" class="badge-primary">
            {{ userRole.name[locale] }}
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

        <template #item-actions="items">
          <div class="flex">
            <button
                class="btn-warning btn-action"
                @click="
                router.push({ name: 'user detail', params: { id: items.id } })
              "
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
          :current="current"
          :total="store.usersList.count"
          :per-page="10"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagionation"
      />

      <DeleteUserModal
          :userId="userId"
          @deleteUser="deleteUser"
      />
    </div>
  </div>
</template>
