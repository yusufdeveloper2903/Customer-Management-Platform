<script lang="ts" setup>
import { fields, newsItems } from "../constants/index";
import NewsDetails from "./modals/NewsDetails.vue";

const changePagionation = () => {};
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-end mb-10">
      <label for="search" class="w-1/4">
        Search
        <input type="text" class="form-input" placeholder="Search" />
      </label>
      <button class="btn-primary" uk-toggle="target: #news-detail">
        {{ $t("global.add") }}
      </button>
    </div>

    <EasyDataTable
      theme-color="#7367f0"
      hide-footer
      :loading="false"
      :headers="fields"
      :items="newsItems"
    >
      <template #item-actions="items">
        <div class="flex my-2">
          <button class="btn-warning btn-action">
            <Icon icon="Pen New Square" color="#fff" size="16" />
          </button>
          <button class="ml-3 btn-danger btn-action">
            <Icon icon="Trash Bin Trash" color="#fff" size="16" />
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
      class="mt-10 tw-pagination"
      :current="1"
      :total="25"
      :per-page="10"
      :text-before-input="$t('go_to_page')"
      :text-after-input="$t('forward')"
      @page-changed="changePagionation"
    />

    <NewsDetails />
  </div>
</template>
