<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import { preparation } from "../constants/index";
import Icon from '@/components/Icons/Icon.vue';
import AddPreparationModal from "./modals/AddPreparationModal.vue";



// Declared variables
const {t} = useI18n()
</script>

<template>
              <div class="flex justify-between items-end mb-5">
            <label for="search" class="w-1/3">
                {{ t('Search') }}
                <input type="text" class="form-input" :placeholder="t('Search')"/>
            </label>
            <button class="btn-primary" uk-toggle="target: #preparation_modal" >
                {{ t("Add") }}
            </button>
        </div>
          <EasyDataTable theme-color="#7367f0" hide-footer :headers="preparation" :items="[]">
            
            <template #empty-message>
              <div class="dark:text-white">{{ t("no_available_data") }}</div>
            </template>

            <template #header="header">
              {{ t(header.text) }}
            </template>

            <template #item-actions="">
                <div class="py-3 flex justify-left items-center gap-3">
                    <button class="btn-warning btn-action" >
                        <Icon icon="Pen New Square" color="#fff" size="16" />
                    </button>
                    <button class="btn-danger btn-action" >
                        <Icon icon="Trash Bin Trash" color="#fff" size="16" />
                    </button>
                </div>
            </template>
          </EasyDataTable>

          <TwPagination :total="2" class="mt-10 tw-pagination" :current="1" :per-page="10"
            :text-before-input="t('go_to_page')" :text-after-input="t('forward')" 
             />

             <AddPreparationModal  />
</template>