<script setup lang="ts">
//Imported files

import {nextTick, onMounted, reactive, ref} from "vue";
import staff from "../store/index";
import {fields} from "../constants/index";
import UIkit from "uikit";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {watchDebounced} from "@vueuse/core";
import DeleteModal from "@/components/DeleteModal.vue";
import {useI18n} from "vue-i18n";
import ShowFileModal from "@/modules/KnowledgeBase/components/ShowImageModal.vue";


//Declared files
const {t} = useI18n()
const image = ref<string>("");
const imageCard = ref();
const store = staff();
const router = useRouter();
const userId = ref<number | null>(null);
const isLoading = ref(false);
const filterUsers = reactive({
  page_size: 10,
  page: 1,
  search: "",
  role: null,
});

//MOUNTED
onMounted(async () => {
  await refresh();
  await store.getUsersRolesList()
})
//FUNCTIONS
const handleDeleteModal = (id: number) => {
  UIkit.modal("#staff-main-delete-modal").show();
  userId.value = id;
};

const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getStaffs(filterUsers);
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
    await store.deleteStaff(userId.value)
    UIkit.modal("#staff-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.staffsList.count - 1) % filterUsers.page > 0) {
      filterUsers.page = filterUsers.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }
};

const changePagionation = (e: number) => {
  filterUsers.page = e;
  refresh();
};

const filterByRole = () => {
  filterUsers.page = 1
  refresh()
}

watchDebounced(() => filterUsers.search, async function () {
  filterUsers.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
const onPageSizeChanged = (event: number) => {
  filterUsers.page = 1;
  filterUsers.page_size = event;
  refresh();
};

const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#file-show-staff-image").show();
  });
};
</script>

<template>
  <div>
    <div class="card">
      <div class="md:flex items-end justify-between mb-7">
        <form class="md:flex items-center gap-5 md:w-5/12">
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
            />
          </div>

          <div class="md:w-1/2 md:m-0 mt-2">
            <label for="role" class="dark:text-gray-300">
              {{ $t("Role") }}
            </label>
            <v-select
                :placeholder="$t('Role')"
                :options="store.users_roles.results"
                :getOptionLabel="(role:any) => role.name"
                :reduce="(role:any) => role.id"
                v-model="filterUsers.role"
                @update:model-value="filterByRole"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>

          </div>
        </form>
        <button
            class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
            @click="
                router.push({ name: 'add staff'})
              "
        >
          {{ $t("Add") }}
        </button>
      </div>

      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :loading="isLoading"
          :headers="fields"
          :items="store.staffsList.results"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ $t("no_available_data") }}</div>
        </template>

        <template #header-full_name="header">
          {{ $t(header.text) }}
        </template>

        <template #header-photo="header">
          {{ $t(header.text) }}
        </template>

        <template #header-username="header">
          {{ $t(header.text) }}
        </template>

        <template #header-phone="header">
          {{ $t(header.text) }}
        </template>

        <template #header-role="header">
          {{ $t(header.text) }}
        </template>

        <template #header-is_active="header">
          {{ $t(header.text) }}
        </template>

        <template #header-status="header">
          {{ $t(header.text) }}
        </template>

        <template #header-actions="header">
          {{ $t(header.text) }}
        </template>

        <template #item-photo="items">
          <div class="py-3 flex justify-left gap-3">
            <img
                v-if="items && items.photo"
                class="w-[45px] h-[45px] rounded object-cover"
                :src="items.photo"
                alt="Rounded avatar"
                @click="onShowFile(items.photo)"
            />
            <div
                v-else
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

          </div>
        </template>

        <template #item-phone="items">
          {{ items.phone }}
        </template>

        <template #item-role="items">
          <span
              v-if="items.role"
              class="rounded bg-primary px-4 p-1 pt-0.5 inline m-1 text-white"
          >
            {{ items.role.name }}
          </span>
        </template>

        <template #item-is_active="items">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
                disabled
                type="checkbox"
                :checked="items.is_active"
                class="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
             peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
             after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            ></div>
          </label>
        </template>

        <template #item-actions="items">
          <div class="flex justify-left">
            <button
                class="btn-warning btn-action"
                @click="
                router.push({ name: 'staff detail', params: { id: items.id } })
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
          :current="filterUsers.page"
          :total="store.staffsList.count"
          :per-page='filterUsers.page_size'
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagionation"
          @per-page-changed="onPageSizeChanged"

      />
      <DeleteModal @delete-action="deleteAction" :id="'staff-main-delete-modal'"/>
    </div>
  </div>
  <ShowFileModal :image="image" ref="imageCard" id="file-show-staff-image"/>
</template>
