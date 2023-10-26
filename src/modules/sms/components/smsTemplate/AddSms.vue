<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import {ref} from "vue";
import {useI18n} from 'vue-i18n'
// import {Textarea} from "flowbite-vue";
import type {Header, ServerOptions} from "vue3-easy-data-table";
import '@vuepic/vue-datepicker/dist/main.css'
// import '@/assets/modal.css'

const {t, locale} = useI18n()
const is_active = ref(true)
const date = ref(null)
const formList = ref<object[]>([])
const userList = ref([{
  id: 1,
  username: 'Michael Jacksen',
  phone_number: '+9989707770714'
}])

const loading = ref(false);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 5
});

function getId(id) {
  if (formList.value.some(item => item.id == id)) {
    let index = formList.value.map(el => el.id).indexOf(id)
    formList.value.splice(index, 1)
  } else {
    formList.value.push({
      id: id,
      main: false
    })
  }

}

const isChecked = (id: number): boolean => {
  let result = false
  formList.value.forEach(element => {
    console.log(element)

    if (element.id == id) {
      result = true

    }
  })

  return result

}

const headers: Header[] = [
  {text: "button", value: "check"},
  {text: "id", value: "id"},
  {text: "avatar", value: "avatar"},
  {text: "name_two", value: "ism"},
  {text: "username", value: "username"},
  {text: "phone_number", value: "phone_number"},
  {text: "account_type_status", value: "account_type"},
];

const headerItemClassNameFunction = (header): string => {
  if (header.value === "actions") return "move";
  return "";
};
</script>

<template>
  <div class="flex gap-6">
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-1/2">
      <h1 class="font-semibold text-lg">СМС-рассылка</h1>

      <div class="uk-margin mb-0 flex items-center">

        <div class="uk-form-controls mr-2 flex">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                :checked="is_active"
                class="sr-only peer"
            />
            <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"/>
          </label>
        </div>
        <label for="form-stacked-text" class="text-sm">{{ $t('Задать дату и время') }}</label>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('Начало рассылки:') }}</label>
        <div class="uk-form-controls">
          <VueDatePicker v-model="date"/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('СМС-шаблоны:') }}</label>
        <div class="uk-form-controls">
          <VSelect/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('Описание') }}</label>
        <div class="uk-form-controls">
          <textarea class="form-input" rows="5"/>
        </div>
      </div>

    </div>

    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-full">
      <div>
        <h1 class="font-semibold text-lg mb-4">Сотрудники</h1>

        <div class="flex items-center gap-4 mb-6">
          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Search') }}</label>
            <div class="uk-form-controls">
              <input
                  type="search"
                  class="form-input"
              />
            </div>
          </div>

          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Компания') }}</label>
            <div class="uk-form-controls">
              <VSelect/>
            </div>
          </div>

          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Выберите подразделение:') }}</label>
            <div class="uk-form-controls">
              <VSelect/>
            </div>
          </div>

          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Выберите подразделение:') }}</label>
            <div class="uk-form-controls">
              <VSelect/>
            </div>
          </div>
        </div>

        <EasyDataTable
            buttons-pagination v-model:server-options="serverOptions" theme-color="#7367f0"
            :server-items-length="2" :loading="loading" class="user-table2"
            :header-item-class-name="headerItemClassNameFunction" :headers="headers" :items="userList"
            :rows-items="[5, 10, 15]" :rows-per-page="10" :rows-per-page-message="$t('pagination_text')">

          <template #item-check="item">
            <input type="checkbox" @change="getId(item.id)" :checked="isChecked(item.id)">
          </template>

          <template #empty-message>
            <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
          </template>
          <template #header="data">
            {{ t(data.text).toUpperCase() }}
          </template>

          <template #item-name="item">
            {{ item.name[locale.valueOf()] }}
          </template>

          <!--            <template #item-actions="item">-->
          <!--              <div class="flex items-center justify-end gap-2">-->
          <!--                <button class="btn-warning btn-action py-1" @click="">-->
          <!--                  <span uk-icon="icon: pencil" class="uk-icon"></span>-->
          <!--                </button>-->
          <!--                <button class="btn-danger btn-action py-1" @click="">-->
          <!--                  <span uk-icon="icon: trash" class="uk-icon"></span>-->
          <!--                </button>-->
          <!--              </div>-->
          <!--            </template>-->
        </EasyDataTable>
      </div>
    </div>
  </div>
</template>

