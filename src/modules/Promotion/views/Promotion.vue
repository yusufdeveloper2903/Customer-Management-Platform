<script setup lang="ts">
//Imported files

import {newsTemplateTable} from "../constants";
import {reactive, ref,} from "vue";
import CreatePromotionModal from "../components/CreatePromotionModal.vue"

//Declared variables

const isLoading = ref(false);
const current = ref<number>(1);

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
  description: {
    uz: string,
    ru: string
  },
}

const editData = ref<EditData>({
  id: null,
  title: {
    uz: "",
    ru: ""
  },
  description: {
    uz: "",
    ru: ""
  },
})
const filterSmsTemplate = reactive({
  page_size: 10,
  search: "",
});

</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        {{ $t('Search') }}
        <input type="text" class="form-input" placeholder="Search" v-model="filterSmsTemplate.search"/>
      </label>
      <button class="btn-primary" uk-toggle="target: #discounts">
        <!-- @clik="editData = {}" -->
        {{ $t("Add") }}
      </button>
    </div>
    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="newsTemplateTable"
                   :items="[]">

      <template #header-title="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-description="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #header-actions="header">
        {{ $t(header.text).toUpperCase() }}
      </template>

      <template #item-title="item">
        {{ item.title[$i18n.locale] }}
      </template>

      <template #item-description="item">
        {{ item.description[$i18n.locale] }}
      </template>

      <template #item-actions="item">
        <div class="flex my-4">
          <button class="btn-warning btn-action" uk-toggle="target: #discounts" @click="editData = item">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :total="10" class="mt-10 tw-pagination" :current="current" :per-page="10"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"/>

  </div>

  <CreatePromotionModal/>

</template>
