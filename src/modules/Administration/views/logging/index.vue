<script setup lang="ts">
//IMPORTED FILES
import {headerLoggingLeft, headerLoggingRight} from "@/modules/Administration/constants";
import Tab from "@/components/Tab/Tab.vue"
import Tabs from "@/components/Tab/Tabs.vue"
import administrationStore from '../../store/index'
import {
  onMounted,
  ref, watch,
} from "vue"
import dayjs from 'dayjs'
import {watchDebounced} from '@vueuse/core';
import VueDatePicker from "@vuepic/vue-datepicker";


//DECLARED VARIABLES
const tabsStored = ref<any>('')
const dateConfig = ref({})
const administrationStorage = administrationStore()
const isLoading = ref(false)
const isLoading2 = ref(false)
const isError = ref(false)
let params = ref({
  page: 1,
  page_size: 10,
  search: '',
  start_date: '',
  end_date: '',
})


//MOUNTED
onMounted(async () => {
  let storedTabs = localStorage.getItem('administration')
  tabsStored.value = storedTabs
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.value.page = JSON.parse(page)
  }
  if (page_size) {
    params.value.page_size = JSON.parse(page_size)
  }
  await refresh()
});


//FUNCTIONS
const refresh = async () => {
  isLoading.value = true
  try {
    if (tabsStored.value == 'authorization_log') {
      await administrationStorage.FETCH_JOURNAL_AUTHORIZATION_LIST(params.value)
    }
    if (tabsStored.value == 'activity_log') {
      await administrationStorage.FETCH_JOURNAL_AKTIVITIEST_LIST(params.value)
    }
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}

const downloadExcel = async () => {
  isLoading.value = true
  await administrationStorage.FETCH_JOURNAL_AUTHORIZATION_LIST_EXCEL({excel: true}).then((res) => {
    const url = window.URL.createObjectURL(
        new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
        })
    );
    const date = new Date();
    const fullDate = dayjs(date).format("DD-MM-YYYY");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fullDate);
    document.body.appendChild(link);
    link.click();
  })
      .catch(() => {
        isError.value = true
      })
      .finally(() => {
        isLoading.value = false
      })
}
const downloadExcel2 = async () => {
  isLoading2.value = true

  await administrationStorage.FETCH_JOURNAL_AKTIVITIEST_LIST_EXCEL({excel: true}).then((res) => {
    const url = window.URL.createObjectURL(
        new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
        })
    );
    const date = new Date();
    const fullDate = dayjs(date).format("DD-MM-YYYY");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fullDate);
    document.body.appendChild(link);
    link.click();
  })
      .catch(() => {
        isError.value = true
      })
      .finally(() => {
        isLoading2.value = false
      })
}
const onPageSizeChangedLeft = async (event: number) => {
  params.value.page = 1;
  params.value.page_size = event;
  refresh();
};
const onPageChange = async (event: number) => {
  params.value.page = event
  refresh()
}

const selectedTitle = (val: any) => {
  tabsStored.value = val
  params.value.page = 1;
  params.value.page_size = 10;
  params.value.search = '';
  params.value.start_date = '';
  params.value.end_date = '';
  localStorage.setItem('page', '1')
  localStorage.setItem('page_size', '10')
  localStorage.setItem('administration', val)
  refresh()

}


//WATCHERS
watchDebounced(() => params.value.search, async function () {
  params.value.page = 1
  localStorage.setItem('page', '1')

  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})

watchDebounced(() => params.value.start_date, async function () {
  params.value.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})

watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        params.value.start_date = started_date.split('T')[0]
        params.value.end_date = end_date.split('T')[0]
      } else {
        params.value.start_date = ""
        params.value.end_date = ""
      }
    }
)


</script>


<template>
  <div class="flex w-full gap-4">
    <div class="card w-full">
      <Tabs vertical pill @selectedTitle="selectedTitle" unique="unique">
        <Tab :title="'authorization_log'" class="w-full rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm ">

          <div class="flex w-full gap-4">


            <div class="flex items-start gap-10 w-full">
              <div class="w-full">
                <div class="flex items-end justify-between flex-wrap mb-7">
                  <div class="flex items-center md:w-5/12">
                    <form>
                      <label
                          for="search"
                          class="text-sm dark:text-white"
                      >{{ $t('Search') }}:</label>
                      <input
                          v-model="params.search"
                          id="search"
                          type="text"
                          class="form-input mb-1"
                      >
                    </form>
                    <div class="ml-4 md:w-7/12 ">
                      <label class="dark:text-gray-300">
                        {{ $t("date_from") + ' - ' + $t("date_to") }}
                      </label>
                      <VueDatePicker format="dd-MM-yyyy" :enableTimePicker="false" auto-apply :range="{ partialRange: false }"
                                     v-model="dateConfig"/>
                    </div>
                  </div>
                  <button class="btn-success " @click="downloadExcel()">
                          <span
                              class="block cursor-pointer mr-1"
                              uk-icon="download"
                          />
                    {{ $t('download_excel') }}
                  </button>
                </div>
                <EasyDataTable

                    theme-color="#7367f0"
                    buttons-pagination
                    :headers="headerLoggingLeft"
                    :loading="isLoading"
                    :items="administrationStorage.journal_authorization_list.results"
                    hide-footer
                    class="mb-3"
                >
                  <template #empty-message>
                    <div>{{ $t('no_available_data') }}</div>
                  </template>

                  <template #header="header">
                    {{ $t(header.text) }}
                  </template>


                  <template #item-user="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.user.username }}
                    </div>
                  </template>

                  <template #item-ip_address="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.ip_address }}
                    </div>
                  </template>

                  <template #item-mac_address="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.mac_address }}
                    </div>
                  </template>

                  <template #item-datetime="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ dayjs(items.datetime).format("DD-MM-YYYY HH:mm") }}
                    </div>
                  </template>

                </EasyDataTable>

                <TwPagination
                    class="tw-pagination"
                    :current="params.page"
                    :total="administrationStorage.journal_authorization_list.count"
                    :per-page="params.page_size"
                    :text-before-input="$t('go_to_page')"
                    :text-after-input="$t('forward')"
                    @page-changed="onPageChange($event)"
                    @per-page-changed="onPageSizeChangedLeft"
                />
              </div>
            </div>


          </div>
        </Tab>


        <Tab :title="'activity_log'" class="w-full rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm">

          <div class="flex w-full gap-4">


            <div class="flex items-start gap-10 w-full">
              <div class="w-full">
                <div class="flex items-end justify-between flex-wrap mb-7">
                  <div class="flex items-center  md:w-5/12">
                    <form>
                      <label
                          for="search"
                          class="text-sm dark:text-white"
                      >{{ $t('Search') }}:</label>
                      <input
                          v-model="params.search"
                          id="search"
                          type="text"
                          class="form-input mb-1"
                      >
                    </form>
                    <div class="ml-4 md:w-7/12 ">
                      <label class="dark:text-gray-300">
                        {{ $t("date_from") + ' - ' + $t("date_to") }}
                      </label>
                      <VueDatePicker format="dd-MM-yyyy" :enableTimePicker="false" auto-apply :range="{ partialRange: false }"
                                     v-model="dateConfig"/>
                    </div>
                  </div>
                  <button class="btn-success" @click="downloadExcel2()">
                          <span
                              class="block cursor-pointer mr-1"
                              uk-icon="download"
                          />
                    {{ $t('download_excel') }}
                  </button>
                </div>
                <EasyDataTable
                    theme-color="#7367f0"
                    buttons-pagination
                    :headers="headerLoggingRight"
                    :loading="isLoading2"
                    :items="administrationStorage.journal_activities_list.results"
                    hide-footer
                    class="mb-3"
                >
                  <template #empty-message>
                    <div>{{ $t('no_available_data') }}</div>
                  </template>
                  <template #header="header">
                    {{ $t(header.text) }}
                  </template>


                  <template #item-user="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.user.username }}
                    </div>
                  </template>
                  <template #item-ip_address="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.ip_address }}
                    </div>
                  </template>
                  <template #item-mac_address="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ items.mac_address }}
                    </div>
                  </template>
                  <template #item-datetime="items">
                    <div class="flex justify-left" style="overflow-wrap: anywhere;">
                      {{ dayjs(items.datetime).format("DD-MM-YYYY HH:mm") }}
                    </div>
                  </template>
                </EasyDataTable>
                <TwPagination
                    class="tw-pagination"
                    :current="params.page"
                    :total="administrationStorage.journal_activities_list.count"
                    :per-page="params.page_size"
                    :text-before-input="$t('go_to_page')"
                    :text-after-input="$t('forward')"
                    @page-changed="onPageChange($event)"
                    @per-page-changed="onPageSizeChangedLeft"
                />
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>
