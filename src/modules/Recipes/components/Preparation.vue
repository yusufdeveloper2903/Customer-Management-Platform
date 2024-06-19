<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import { preparation } from "../constants/index";
import Icon from '@/components/Icons/Icon.vue';
import AddPreparationModal from "./modals/AddPreparationModal.vue";


// Declared variables
const { t } = useI18n()
let accordItem = <boolean>false
const items = [
  { id: '1', description: 'aaa' },
  { id: '2', description: 'vv' }
]
</script>

<template>
  <div class="flex justify-between items-end mb-5">
    <label for="search" class="w-1/3">
      {{ t('Search') }}
      <input type="text" class="form-input" :placeholder="t('Search')" />
    </label>
    <button class="btn-primary" uk-toggle="target: #preparation_modal">
      {{ t("Add") }}
    </button>
  </div>
  <EasyDataTable theme-color="#7367f0" hide-footer :headers="preparation" :items="items">


    <template #empty-message>
      <div class="dark:text-white">{{ t("no_available_data") }}</div>
    </template>

    <template #header="header">
      {{ t(header.text) }}
    </template>

    <template #header-actions="item">
        <div class="flex justify-end">
          {{ t(item.text) }}
        </div>
      </template>


    <template #item-description="item">
      <div class="grid divide-y divide-neutral-200">
            <div class="py-5">
              <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>{{ item.description }}</span>
                    <span class="transition group-open:rotate-180">
                      <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                </summary>
                <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
                  {{ item.description }}
                </p>
              </details>
            </div>
          </div>
    </template>

    <template #item-actions="">
      <div class="py-3 flex justify-end items-center gap-3">
        <button class="btn-warning btn-action">
          <Icon icon="Pen New Square" color="#fff" size="16" />
        </button>
        <button class="btn-danger btn-action">
          <Icon icon="Trash Bin Trash" color="#fff" size="16" />
        </button>
      </div>
    </template>
  </EasyDataTable>



  <!-- <table class="min-w-full bg-white border border-gray-300 dark:border-gray-600">
    <thead>
      <tr>
        <th v-for="field in preparation"
          class="px-6 py-3 bg-gray-100 dark:bg-darkLayoutMain text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider secondTable">
          {{ t(field.text) }}

        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-y dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-darkLayoutMain dark:text-gray-200 cursor-move">
        <td class="px-6 text-left" colspan="3">
          <div class="grid divide-y divide-neutral-200 w-full">
            <div class="py-5">
              <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none">

                    <span>1</span>
                    <span> What is a SAAS platform?</span>
                    <span>
                      <div class="flex py-2 justify-start">
                        <button class="btn-warning btn-action" uk-toggle="target: #phones" @click="">
                          <Icon icon="Pen New Square" color="#fff" size="16" />
                        </button>
                        <button @click="" class="ml-3 btn-danger btn-action" uk-toggle="target: #phone-delete">
                          <Icon icon="Trash Bin Trash" color="#fff" size="16" />
                        </button>
                      </div>
                  
                    </span>
                    <span class="transition group-open:rotate-180">
                      <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                </summary>
                <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
                  SAAS platform is a cloud-based software service that allows users to access
                  and use a variety of tools and functionality.
                </p>
              </details>
            </div>
          </div>
        </td>


      </tr>
    </tbody>
  </table>
  <div class="empty_table" v-if="!items.length">{{ t('no_available_data') }}</div> -->





  <TwPagination :total="2" class="mt-10 tw-pagination" :current="1" :per-page="10" :text-before-input="t('go_to_page')"
    :text-after-input="t('forward')" />

  <AddPreparationModal /></template>