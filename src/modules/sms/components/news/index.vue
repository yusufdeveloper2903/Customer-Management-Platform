<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import AddEditModal from './AddEditModal.vue'

const {t, locale} = useI18n()

const openShowModal = ref(false)
const loading = ref(false);
const headers = [
  {text: "id", value: "id"},
  {text: "title", value: "title"},
  {text: "description", value: "description"},
  {text: "Запланировать время", value: "schedule"},
  {text: "Группа", value: "group"},
  {text: "Фото", value: "photo"},
  {text: "actions", value: "actions"},
];
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5
});

const headerItemClassNameFunction = (header) => {
  if (header.value === "actions") return "move";
  return "";
};
const openModal = () => {
  openShowModal.value = !openShowModal.value
}

const deleteForm = () => {

}
</script>
<template>
  <div>
    <div class="flex justify-between items-end  my-2 mb-12">
      <label for="default" class="text-gray-700 select-none font-medium w-1/4">
        {{ $t('Search') }}
        <input id="default" type="text" name="default" class="form-input"/>
      </label>

      <button
          @click="openModal"
          class="rounded-md bg-success px-8 py-2 text-white duration-100 hover:shadow-[0px_8px_25px_-8px_#67f07b] active:shadow-none">
        {{ $t('Add') }}
      </button>
    </div>

    <EasyDataTable
        buttons-pagination
        v-model:server-options="serverOptions"
        theme-color="#7367f0"
        :server-items-length="2"
        :loading="loading"
        class="user-table2"
        :header-item-class-name="headerItemClassNameFunction"
        :headers="headers"
        items=""
        :rows-items="[5, 10, 15]"
        :rows-per-page="10" :rows-per-page-message="$t('pagination_text')">

      <template #empty-message>
        <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
      </template>

      <template #header="data">
        {{ t(data.text).toUpperCase() }}
      </template>

      <template #item-name="item">
        {{ item.name[locale.valueOf()] }}
      </template>

      <template #item-actions="item">
        <div class="flex items-center justify-end gap-2">
          <button class="btn-warning btn-action" @click="$router.push(`/form-detail/${item.id}`)">
            <span uk-icon="icon: pencil" class="uk-icon"></span>
          </button>
          <button class="btn-danger btn-action" @click="deleteForm(item.id)">
            <span uk-icon="icon: trash" class="uk-icon"></span>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <AddEditModal
        @openModal="openModal"
        :openShowModal="openShowModal"
    />
  </div>
</template>