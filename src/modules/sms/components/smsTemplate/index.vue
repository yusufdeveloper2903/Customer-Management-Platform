<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import Icon from "@/components/Icons/Icon.vue"
import {useRouter} from "vue-router";

const {t, locale} = useI18n()
const router = useRouter()

const loading = ref(false);
const headers = [
  {text: "id", value: "id"},
  {text: "description", value: "description"},
  {text: "Запланировать время", value: "schedule"},
  {text: "Группа", value: "group"},
  {text: "Статус", value: "status"},
  {text: "actions", value: "actions"},
];

const changePagionation = () => {

}

</script>
<template>
  <div>
    <div class="flex items-center gap-4 mb-4">
      <div class="w-1/4">
        <div
            class="uk-card uk-card-default uk-card-body uk-card-small rounded-md dark:bg-darkLayoutStorm bg-slate-50 shadow-lg">
          <div class="flex items-center justify-between">
            <button class="p-3 rounded-full bg-amber-100">
              <Icon icon="Wallet Money" color="#FFCD00"/>
            </button>

            <div class="flex flex-col items-end">
              <h1 class="font-semibold text-lg dark:text-gray-300">Баланс</h1>
              <span class="dark:text-gray-300">692,295.00 сум</span>
            </div>
          </div>

        </div>
      </div>

      <div class="w-1/4">
        <div
            class="uk-card uk-card-default uk-card-body uk-card-small rounded-md dark:bg-darkLayoutStorm bg-slate-50 shadow-lg">
          <div class="flex items-center justify-between">
            <button class="p-3 rounded-full bg-red-100">
              <Icon icon="Bill Cross" color="#DC3545"/>
            </button>

            <div class="flex flex-col items-end">
              <h1 class="font-semibold text-lg dark:text-gray-300">Не отправлено</h1>
              <span class="dark:text-gray-300">1</span>
            </div>
          </div>

        </div>
      </div>

      <div class="w-1/4">
        <div
            class="uk-card uk-card-default uk-card-body uk-card-small rounded-md dark:bg-darkLayoutStorm bg-slate-50 shadow-lg">
          <div class="flex items-center justify-between">
            <button class="p-3 rounded-full bg-lime-100">
              <Icon icon="Bill List" color="#28A745"/>
            </button>

            <div class="flex flex-col items-end">
              <h1 class="font-semibold text-lg dark:text-gray-300">Отправлено</h1>
              <span class="dark:text-gray-300">2</span>
            </div>
          </div>

        </div>
      </div>

      <div class="w-1/4">
        <div
            class="uk-card uk-card-default uk-card-body uk-card-small rounded-md dark:bg-darkLayoutStorm bg-slate-50 shadow-lg">
          <div class="flex items-center justify-between">
            <button class="p-3 rounded-full bg-cyan-100">
              <Icon icon="Clock Square" color="#00CFE8"/>
            </button>

            <div class="flex flex-col items-end">
              <h1 class="font-semibold text-lg dark:text-gray-300">В процессе</h1>
              <span class="dark:text-gray-300">8</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="flex justify-between items-end  my-2 mb-12">
      <label for="default" class="text-gray-700 select-none font-medium w-1/4">
        {{ $t('Search') }}
        <input id="default" type="text" name="default" class="form-input"/>
      </label>

      <button
          @click="$router.push('/add-sms')"
          class="rounded-md bg-success px-8 py-2 text-white duration-100 hover:shadow-[0px_8px_25px_-8px_#67f07b] active:shadow-none">
        {{ $t('Add') }}
      </button>
    </div>

    <EasyDataTable
        theme-color="#7367f0"
        hide-footer
        :headers="headers"
        :items="[]"
    >
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
          <button class="btn-warning btn-action" @click="router.push(`/form-detail/${item.id}`)">
            <span uk-icon="icon: pencil" class="uk-icon"></span>
          </button>
          <button class="btn-danger btn-action">
            <span uk-icon="icon: trash" class="uk-icon"></span>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination
        class="mt-2 tw-pagination"
        :current="1"
        :total="10"
        :per-page="10"
        :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')"
        @page-changed="changePagionation"
    />
  </div>
</template>
