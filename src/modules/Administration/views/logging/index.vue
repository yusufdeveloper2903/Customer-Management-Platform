<script setup lang="ts">
//IMPORTED FILES
import {headerLoggingLeft, headerLoggingRight} from "@/modules/Administration/constants";
import Tab from "@/components/Tab/Tab.vue"
import Tabs from "@/components/Tab/Tabs.vue"
import administrationStore from '../../store/index'
import {
  onMounted,
  ref,
} from "vue"
import dayjs from 'dayjs'
import {watchDebounced} from '@vueuse/core';


//DECLARED VARIABLES
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
let filter = ref({
  page: 1,
  search: '',
  start_date: '',
  end_date: '',
  offset: 0,
  limit: 10,
})

//MOUNTED
onMounted(async () => {
  await refresh()
  await refresh2()

})


//FUNCTIONS
const refresh = async () => {
  isLoading.value = true
  try {
    await administrationStorage.FETCH_JOURNAL_AUTHORIZATION_LIST(params.value)
    isLoading.value = false
  } catch (error) {
    isError.value = true
  }
}
const refresh2 = async () => {
  isLoading2.value = true
  try {
    await administrationStorage.FETCH_JOURNAL_AKTIVITIEST_LIST(filter.value)
    isLoading2.value = false
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
const onInput = async (event: number) => {
  params.value.page = event
  refresh()
}
const onInput2 = async (event: number) => {
  filter.value.page = event
  refresh2()
}


//WATCHERS
watchDebounced(() => params.value.search, async function () {
  params.value.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watchDebounced(() => filter.value.search, async function () {
  filter.value.offset = 0
  filter.value.page = 1
  refresh2()
}, {deep: true, debounce: 500, maxWait: 5000,})
const datePicked = async () => {
  if (params.value.start_date && params.value.end_date) {
    params.value.start_date = dayjs(params.value.start_date).format("YYYY-MM-DD")
    params.value.end_date = dayjs(params.value.end_date).format("YYYY-MM-DD")
    refresh()
  }
  if (!params.value.start_date && !params.value.end_date) {
    refresh()
  }
}
const datePicked2 = async () => {
  if (filter.value.start_date && filter.value.end_date) {
    filter.value.start_date = dayjs(filter.value.start_date).format("YYYY-MM-DD")
    filter.value.end_date = dayjs(filter.value.end_date).format("YYYY-MM-DD")
    refresh2()
  }
  if (!filter.value.start_date && !filter.value.end_date) {
    refresh2()
  }
}
const onPageSizeChangedLeft = async (event: number) => {
  params.value.page = 1;
  params.value.page_size = event;
  refresh();
};
const onPageSizeChangedRight = async (event: number) => {
  filter.value.page = 1;
  filter.value.limit = event;
  refresh();
};
</script>


<template>
  <div class="flex w-full gap-4">
    <div class="w-full">
      <Tabs>
        <Tab :title="'authorization_log'" class="w-full rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm ">

          <div class="flex w-full gap-4">


            <div class="flex items-start gap-10 w-full">
              <div class="w-full">
                <div class="flex items-end justify-between flex-wrap mb-7">
                  <div class="flex items-center justify-between">
                    <form>
                      <label
                          for="search"
                          class="text-sm dark:text-white"
                      >{{ $t('Search') }}:</label>
                      <input
                          v-model="params.search"
                          id="search"
                          type="text"
                          :placeholder="$t('Search')"
                          class="form-input mb-1"
                      >
                    </form>
                    <div class="ml-4">
                      <div class="flex justify-between">
                        <label
                            for="phone"
                            class="text-sm text-gray-600 dark:text-gray-200"
                        >{{ $t('date_from') }}:
                        </label>
                      </div>
                      <div class="relative">
                        <VueDatePicker
                            auto-apply
                            :locale="'ru'"
                            :autoApply="true"
                            format="dd.MM.yyyy"
                            v-model="params.start_date"
                            :placeholder="$t('date_from')"
                            :enableTimePicker="false"
                            @closed="datePicked()"
                            @cleared="datePicked()"
                        ></VueDatePicker>
                      </div>

                    </div>
                    <div class="ml-4">
                      <div class="flex justify-between">
                        <label
                            for="phone"
                            class="text-sm text-gray-600 dark:text-gray-200"
                        >{{ $t('date_to') }}:
                        </label>
                      </div>
                      <div class="relative">
                        <VueDatePicker
                            auto-apply
                            :locale="'ru'"
                            :autoApply="true"
                            format="dd.MM.yyyy"
                            v-model="params.end_date"
                            :placeholder="$t('date_to')"
                            :enableTimePicker="false"
                            @closed="datePicked()"
                            @cleared="datePicked()"
                        ></VueDatePicker>
                      </div>

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
                    @page-changed="onInput($event)"
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
                  <div class="flex items-center justify-between">
                    <form>
                      <label
                          for="search"
                          class="text-sm dark:text-white"
                      >{{ $t('Search') }}:</label>
                      <input
                          v-model="filter.search"
                          id="search"
                          type="text"
                          :placeholder="$t('Search')"
                          class="form-input mb-1"
                      >
                    </form>
                    <div class="ml-4">
                      <div class="flex justify-between">
                        <label
                            for="phone"
                            class="text-sm text-gray-600 dark:text-gray-200"
                        >{{ $t('date_from') }}:
                        </label>
                      </div>
                      <div class="relative">
                        <VueDatePicker
                            auto-apply
                            :locale="'ru'"
                            :autoApply="true"
                            format="dd.MM.yyyy"
                            v-model="filter.start_date"
                            :placeholder="$t('date_from')"
                            :enableTimePicker="false"
                            @closed="datePicked2()"
                            @cleared="datePicked2()"
                        ></VueDatePicker>
                      </div>

                    </div>
                    <div class="ml-4">
                      <div class="flex justify-between">
                        <label
                            for="phone"
                            class="text-sm text-gray-600 dark:text-gray-200"
                        >{{ $t('date_to') }}:
                        </label>
                      </div>
                      <div class="relative">
                        <VueDatePicker
                            auto-apply
                            :locale="'ru'"
                            :autoApply="true"
                            format="dd.MM.yyyy"
                            v-model="filter.end_date"
                            :placeholder="$t('date_to')"
                            :enableTimePicker="false"
                            @closed="datePicked2()"
                            @cleared="datePicked2()"
                        ></VueDatePicker>
                      </div>

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
                    :current="filter.page"
                    :total="administrationStorage.journal_activities_list.count"
                    :per-page="filter.limit"
                    :text-before-input="$t('go_to_page')"
                    :text-after-input="$t('forward')"
                    @page-changed="onInput2($event)"
                    @per-page-changed="onPageSizeChangedRight"
                />
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>
