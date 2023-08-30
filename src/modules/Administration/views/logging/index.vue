<script setup lang="ts">



// ========================= IMPORTS_SECTION START =========================
import Tab from "@/components/Tab/Tab.vue"
import Tabs from "@/components/Tab/Tabs.vue"
import dots from "../../dots.svg"
import { administrationStore } from '../../store/index'
import UIkit from 'uikit'
import {
  onMounted,
  ref,
  reactive,
  computed
} from "vue"

import type { Header, Item } from "vue3-easy-data-table";
import dayjs from 'dayjs'
import { toast } from "vue3-toastify";
import { useI18n } from 'vue-i18n';
import { watchDebounced } from '@vueuse/core';
// ========================= IMPORTS_SECTION END =========================













// ========================= PRIMARY_DATA_SECTION START =========================
const { locale, t } = useI18n()
// const route = useRoute()
// const router = useRouter()
// const toast = useToast()


const administrationStorage = administrationStore()

// const {formatPrice} = formatter()
const isLoading = ref(false)
const isLoading2 = ref(false)
const isError = ref(false)
// ========================= PRIMARY_DATA_SECTION END =========================









// ========================= OTHER_DATA_SECTION START =========================
let params = ref({
  page: 1,
  page_size: 10,
  total: 20,
  search: '',
  start_date: null,
  end_date: null,
})
let params2 = ref({
  currentPage: 1,
  search: '',
  start_date: null,
  end_date: null,
  offset: 0,
  limit: 10,
  total: 0,
})


let timeOut = ref()


const deletingID = ref()
const selectedRowData = ref()
// ========================= OTHER_DATA_SECTION END =========================














// ========================= GET_SECTION START =========================
const refresh = async () => {
  isLoading.value = true
 
  await administrationStorage.FETCH_JOURNAL_AUTHORIZATION_LIST(params.value).then(response => {
    params.value.total = response.count
  })
  .catch(() => {
    setTimeout(() => {
      isError.value = true
    }, 500);
  })
  .finally(() => {
      isLoading.value = false
  })
}
const refresh2 = async () => {
  isLoading2.value = true
 
  await administrationStorage.FETCH_JOURNAL_AKTIVITIEST_LIST(params2.value).then(response => {
    params2.value.total = response.count
  })
  .catch(() => {
    setTimeout(() => {
      isError.value = true
    }, 500);
  })
  .finally(() => {
      isLoading2.value = false
  })
}
// ========================= GET_SECTION END =========================














// ========================= POST_SECTION START =========================
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
    setTimeout(() => {
      isError.value = true
    }, 500);
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
    setTimeout(() => {
      isError.value = true
    }, 500);
  })
  .finally(() => {
      isLoading2.value = false
  })
}
// ========================= POST_SECTION END =========================


















// ========================= UPDATE_SECTION START =========================

// ========================= UPDATE_SECTION END =========================






















// ========================= DELETE_SECTION START =========================

// ========================= DELETE_SECTION END =========================




















// ========================= ON_MOUNTED_SECTION START =========================
onMounted(async () => {
  await refresh()
  await refresh2()
})
// ========================= ON_MOUNTED_SECTION END =========================















// ========================= OPEN_MODAL_SECTION START =========================

// ========================= OPEN_MODAL_SECTION END =========================













// ========================= ON_INPUT_AND_SEARCH_SECTION START =========================
const onInput = async (event) => {
  params.value.page = event
  await refresh()
}

// const onSearch = async (event) => {
//   params.value.search = event.target.value
//   clearTimeout(timeOut.value)
//   timeOut.value = setTimeout(() => {
//     refresh()
//   }, 500)
// }

const onInput2 = async (event) => {
  params2.value.currentPage = event
  params2.value.offset = (event - 1) * params2.value.limit
  await refresh2()
}



// ========================= WATCH_SECTION START =========================
watchDebounced(() => params.value.search, async  function () {
  params.value.page = 1
  await refresh()
}, { deep: true, debounce: 500, maxWait: 5000, })
// ========================= WATCH_SECTION END =========================




// ========================= WATCH_SECTION START =========================
watchDebounced(() => params2.value.search, async  function () {
  params2.value.offset = 0
  await refresh2()
}, { deep: true, debounce: 500, maxWait: 5000, })
// ========================= WATCH_SECTION END =========================





const datePicked = async () => {
  if(params.value.start_date && params.value.end_date){
    params.value.start_date = dayjs(params.value.start_date).format("YYYY-MM-DD")
    params.value.end_date = dayjs(params.value.end_date).format("YYYY-MM-DD")
    await refresh()
  }
  if(!params.value.start_date && !params.value.end_date){
    await refresh()
  }
}
const datePicked2 = async () => {
  if(params2.value.start_date && params2.value.end_date){
    params2.value.start_date = dayjs(params2.value.start_date).format("YYYY-MM-DD")
    params2.value.end_date = dayjs(params2.value.end_date).format("YYYY-MM-DD")
    await refresh2()
  }
  if(!params2.value.start_date && !params2.value.end_date){
    await refresh2()
  }
}



// function clearFilters() {
//   params.value = {
//     currentPage: 1,
//     search: null,
//     start_date: null,
//     end_date: null,
//     offset: 0,
//     limit: 10,
//     total: 0,
//   }
//   refresh()
// }
// ========================= ON_INPUT_AND_SEARCH_SECTION END =========================























// ========================= HEADERS_SECTION START =========================
const headers: Header[] = [
  {
    text: "Login",
    value: "user",
  },
  {
    text: "region",
    value: "region",
  },
  {
    text: "district",
    value: "district",
  },
  {
    text: "ip_address",
    value: "ip_address",
  },
  {
    text: "mac_address",
    value: "mac_address",
  },
  {
    text: "date_and_time",
    value: "datetime",
  },
]
const headers2: Header[] = [
  {
    text: "actions",
    value: "request",
  },
  {
    text: "Login",
    value: "user",
  },
  {
    text: "region",
    value: "region",
  },
  {
    text: "district",
    value: "district",
  },
  {
    text: "ip_address",
    value: "ip_address",
  },
  {
    text: "mac_address",
    value: "mac_address",
  },
  {
    text: "date_and_time",
    value: "datetime",
  },
]
// ========================= HEADERS_SECTION END =========================




















// ========================= VALIDATION_SECTION START =========================

// ========================= VALIDATION_SECTION END =========================
















// ========================= TABLE_CLASSES START =========================
import { BodyRowClassNameFunction, HeaderItemClassNameFunction, BodyItemClassNameFunction} from "vue3-easy-data-table";
const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, columnNumber: number): string => {
  if (header.value === 'request') return 'table-header-center';
  if (header.value === 'user') return 'table-header-center';
  if (header.value === 'region') return 'table-header-center';
  if (header.value === 'district') return 'table-header-center';
  if (header.value === 'ip_address') return 'table-header-center';
  if (header.value === 'mac_address') return 'table-header-center';
  if (header.value === 'datetime') return 'table-header-center';
  return '';
};




const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, rowNumber: number): string => {
  if (column === 'request') return 'w-96';
  if (column === 'user') return 'w-96';
  if (column === 'region') return 'w-96';
  if (column === 'district') return 'w-96';
  if (column === 'ip_address') return 'w-96';
  if (column === 'mac_address') return 'w-96';
  if (column === 'datetime') return 'w-96';
  return '';
};
// ========================= TABLE_CLASSES END =========================



</script>




<template>
  <div class="flex w-full gap-4">
    <div class="w-full">
      <Tabs>
        <Tab :title="'authorization_log'" class="w-full rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm ">
        
            <div class="flex w-full gap-4">
                



                  
                  <div class="flex items-start gap-10 w-full">
                    <div class="w-full">
                      <div class="flex items-center justify-between flex-wrap mb-4">
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
                                :locale="'ru'"
                                :autoApply="true"
                                format="dd.MM.yyyy"
                                v-model="params.start_date"
                                :placeholder="$t('dd_mm_yy')"
                                :enableTimePicker="false"
                                @closed="datePicked()"
                                @cleared="datePicked()"
                              ></VueDatePicker>
                            </div>
                              <!-- <p
                                v-for="error in validate.date_of_birth.$errors"
                                :key="error.$uid"
                                class="whitespace-nowrap text-danger text-sm"
                              >
                                {{ $t(error.$message) }}
                              </p> -->
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
                                :locale="'ru'"
                                :autoApply="true"
                                format="dd.MM.yyyy"
                                v-model="params.end_date"
                                :placeholder="$t('dd_mm_yy')"
                                :enableTimePicker="false"
                                @closed="datePicked()"
                                @cleared="datePicked()"
                              ></VueDatePicker>
                            </div>
                              <!-- <p
                                v-for="error in validate.date_of_birth.$errors"
                                :key="error.$uid"
                                class="whitespace-nowrap text-danger text-sm"
                              >
                                {{ $t(error.$message) }}
                              </p> -->
                          </div>
                        </div>
                        <button class="btn-success mt-4" @click="downloadExcel()">
                          <span
                            class="block cursor-pointer mr-1"
                            uk-icon="download"
                          />
                          {{ $t('download_excel') }}
                        </button>
                      </div>
                      <!-- ============ VUE3-EASY-DATA-TABLE ============ -->
                      <EasyDataTable
                        v-if="administrationStorage.journal_authorization_list && 
                        administrationStorage.journal_authorization_list.results"
                        theme-color="#7367f0"
                        show-index
                        buttons-pagination
                        :headers="headers"
                        :loading="isLoading"
                        :body-item-class-name="bodyItemClassNameFunction"
                        :header-item-class-name="headerItemClassNameFunction"
                        :items="administrationStorage.journal_authorization_list.results"
                        hide-footer
                        class="mb-3"
                      >
                        <template #empty-message>
                          <div class="dark:text-white">{{ $t('no_available_data') }}</div>
                        </template>

                        <template #header-user="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>

                        <template #header-region="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-district="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-ip_address="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-mac_address="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>

                        <template #header-datetime="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>


                        <template #item-user="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.username}}
                          </div>
                        </template>

                        <template #item-region="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.region_parent && items.user.region_parent[locale]}}
                          </div>
                        </template>
                        
                        <template #item-district="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.region && items.user.region[locale]}}
                          </div>
                        </template>

                        <template #item-ip_address="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.ip_address}}
                          </div>
                        </template>

                        <template #item-mac_address="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.mac_address}}
                          </div>
                        </template>

                        <template #item-datetime="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{dayjs(items.datetime).format("DD-MM-YYYY HH:mm")}}
                          </div>
                        </template>

                      </EasyDataTable>
                      <!-- <TwPagination
                        class="tw-pagination"
                        :current="params.currentPage"
                        :total="params.total"
                        :per-page="params.limit"
                        :text-before-input="$t('go_to_page')"
                        :text-after-input="$t('forward')"
                        @page-changed="onInput($event)"
                      /> -->
                      <TwPagination
                        class="tw-pagination"
                        :current="params.page"
                        :total="params.total"
                        :per-page="params.page_size"
                        :text-before-input="$t('go_to_page')"
                        :text-after-input="$t('forward')"
                        @page-changed="onInput($event)"
                      />
                    </div>
                  </div>








            </div>
        </Tab>









        <Tab :title="'activity_log'" class="w-full rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm">

            <div class="flex w-full gap-4">
                


                  <div class="flex items-start gap-10 w-full">
                    <div class="w-full">
                      <div class="flex items-center justify-between flex-wrap mb-4">
                        <div class="flex items-center justify-between">
                          <form>
                            <label
                              for="search"
                              class="text-sm dark:text-white"
                            >{{ $t('Search') }}:</label>
                            <input
                              v-model="params2.search"
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
                                :locale="'ru'"
                                :autoApply="true"
                                format="dd.MM.yyyy"
                                v-model="params2.start_date"
                                :placeholder="$t('dd_mm_yy')"
                                :enableTimePicker="false"
                                @closed="datePicked2()"
                                @cleared="datePicked2()"
                              ></VueDatePicker>
                            </div>
                              <!-- <p
                                v-for="error in validate.date_of_birth.$errors"
                                :key="error.$uid"
                                class="whitespace-nowrap text-danger text-sm"
                              >
                                {{ $t(error.$message) }}
                              </p> -->
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
                                :locale="'ru'"
                                :autoApply="true"
                                format="dd.MM.yyyy"
                                v-model="params2.end_date"
                                :placeholder="$t('dd_mm_yy')"
                                :enableTimePicker="false"
                                @closed="datePicked2()"
                                @cleared="datePicked2()"
                              ></VueDatePicker>
                            </div>
                              <!-- <p
                                v-for="error in validate.date_of_birth.$errors"
                                :key="error.$uid"
                                class="whitespace-nowrap text-danger text-sm"
                              >
                                {{ $t(error.$message) }}
                              </p> -->
                          </div>
                        </div>
                        <button class="btn-success mt-4" @click="downloadExcel2()">
                          <span
                            class="block cursor-pointer mr-1"
                            uk-icon="download"
                          />
                          {{ $t('download_excel') }} 
                        </button>
                      </div>
                      <!-- ============ VUE3-EASY-DATA-TABLE ============ -->
                      <EasyDataTable
                        v-if="administrationStorage.journal_activities_list && administrationStorage.journal_activities_list.results"
                        theme-color="#7367f0"
                        show-index
                        buttons-pagination
                        :headers="headers2"
                        :loading="isLoading2"
                        :body-item-class-name="bodyItemClassNameFunction"
                        :header-item-class-name="headerItemClassNameFunction"
                        :items="administrationStorage.journal_activities_list.results"
                        hide-footer
                        class="mb-3"
                      >
                        <template #empty-message>
                          <div class="dark:text-white">{{ $t('no_available_data') }}</div>
                        </template>                    


                        <template #header-request="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>

                        <template #header-user="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-region="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-district="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>
                        
                        <template #header-ip_address="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>

                        <template #header-mac_address="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>

                        <template #header-datetime="header">
                          {{ $t(header.text).toUpperCase() }}
                        </template>


                        <template #item-user="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.username}}
                          </div>
                        </template>

                        <template #item-region="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.region_parent}}
                          </div>
                        </template>
                        
                        <template #item-district="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.user.region && items.user.region[locale]}}
                          </div>
                        </template>

                        <template #item-ip_address="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.ip_address}}
                          </div>
                        </template>

                        <template #item-mac_address="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{items.mac_address}}
                          </div>
                        </template>

                        <template #item-datetime="items">
                          <div class="flex justify-center" style="overflow-wrap: anywhere;">
                            {{dayjs(items.datetime).format("DD-MM-YYYY HH:mm")}}
                          </div>
                        </template>

                      </EasyDataTable>
                      <TwPagination
                        class="tw-pagination"
                        :current="params2.currentPage"
                        :total="params2.total"
                        :per-page="params2.limit"
                        :text-before-input="$t('go_to_page')"
                        :text-after-input="$t('forward')"
                        @page-changed="onInput2($event)"
                      />
                    </div>
                  </div>




              




              
              
              
              




            </div>
        </Tab>
      </Tabs>
      </div>



     
        







  </div>
</template>


<style lang="scss">

</style>