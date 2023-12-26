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
  computed,
  getCurrentInstance
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
const isError = ref(false)
// ========================= PRIMARY_DATA_SECTION END =========================









// ========================= OTHER_DATA_SECTION START =========================
let params = ref({
  page: 1,
  search: null,
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

  await administrationStorage.FETCH_BACKUP_LIST(params.value).then(response => {
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

function download(url) {
  const url_parts = url.split('/')
  fetch(url).then(function (t) {
    return t.blob().then(b => {
      var a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.setAttribute('download', url_parts[url_parts.length - 1])
      a.click()
    })
  })
}
// ========================= GET_SECTION END =========================














// ========================= POST_SECTION START =========================
const createBackup = async () => {
  isLoading.value = true

  await administrationStorage.CREATE_BACKUP().then( async response => {
    UIkit.modal("#backup-add-modal").hide();
    toast.success(t('created_successfully'));
    await refresh()
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
// ========================= POST_SECTION END =========================


















// ========================= UPDATE_SECTION START =========================

// ========================= UPDATE_SECTION END =========================






















// ========================= DELETE_SECTION START =========================
const deleteBackup = async () => {
  isLoading.value = true
  
  await administrationStorage.DELETE_BACKUP(deletingID.value).then( async response => {
    UIkit.modal("#backup-delete-modal").hide();
    await refresh()
    toast.success(t('deleted_successfully'));
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
// ========================= DELETE_SECTION END =========================




















// ========================= ON_MOUNTED_SECTION START =========================
onMounted(async () => {
  await refresh()
})
// ========================= ON_MOUNTED_SECTION END =========================















// ========================= OPEN_MODAL_SECTION START =========================
const openDeleteBackupModal = async (id) => {
  UIkit.modal("#backup-delete-modal").show();
  deletingID.value = id
}
// ========================= OPEN_MODAL_SECTION END =========================













// ========================= ON_INPUT_AND_SEARCH_SECTION START =========================
const onInput = async (event) => {
  params.value.page = event
  params.value.offset = (event - 1) * params.value.limit
  await refresh()
}




// ========================= WATCH_SECTION START =========================
watchDebounced(() => params.value.search, async  function () {
  params.value.offset = 0
  params.value.page = 1
  await refresh()
}, { deep: true, debounce: 500, maxWait: 5000, })
// ========================= WATCH_SECTION END =========================





const datePicked = async () => {
  if(params.value.start_date && params.value.end_date){
    params.value.offset = 0
    params.value.page = 1
    params.value.start_date = dayjs(params.value.start_date).format("YYYY-MM-DD")
    params.value.end_date = dayjs(params.value.end_date).format("YYYY-MM-DD")
    await refresh()
  }
  if(!params.value.start_date && !params.value.end_date){
    params.value.offset = 0
    await refresh()
  }
}




function clearFilters() {
  params.value = {
    page: 1,
    search: null,
    start_date: null,
    end_date: null,
    offset: 0,
    limit: 10,
    total: 0,
  }
  refresh()
}
// ========================= ON_INPUT_AND_SEARCH_SECTION END =========================























// ========================= HEADERS_SECTION START =========================
const headers: Header[] = [
  {
    text: "Author",
    value: "author",
  },
  {
    text: "name", // $t('name2')
    value: "title",
  },
  {
    text: "date_and_time",
    value: "created_at",
  },
  {
    text: "actions", // $t('actions')
    value: "actions",
  },
]
// ========================= HEADERS_SECTION END =========================




















// ========================= VALIDATION_SECTION START =========================

// ========================= VALIDATION_SECTION END =========================
















// ========================= TABLE_CLASSES START =========================
import { BodyRowClassNameFunction, HeaderItemClassNameFunction, BodyItemClassNameFunction} from "vue3-easy-data-table";
const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, columnNumber: number): string => {
  if (header.value === 'author') return 'table-header-center';
  if (header.value === 'title') return 'table-header-center';
  if (header.value === 'created_at') return 'table-header-center';
  if (header.value === 'actions') return 'table-header-right';
  return '';
};

const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, rowNumber: number): string => {
  if (column === 'author') return 'w-96';
  if (column === 'title') return 'w-96';
  if (column === 'created_at') return 'w-96';
  if (column === 'actions') return 'w-96';
  return '';
};
// ========================= TABLE_CLASSES END =========================



</script>




<template>
  <div class="flex w-full gap-4">
    <div class="rounded bg-white p-5 pb-10 dark:bg-darkLayoutStorm w-full">
      



        
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
                      :clearable="true"
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
                      :clearable="true"
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
              <button class="btn-primary mt-4" uk-toggle="target: #backup-add-modal">
                {{ $t('create_a_backup') }} 
              </button>
            </div>
            <!-- ============ VUE3-EASY-DATA-TABLE ============ -->
            <EasyDataTable
              v-if="administrationStorage.back_up_list && administrationStorage.back_up_list.results"
              theme-color="#7367f0"
              show-index
              buttons-pagination
              :headers="headers"
              :loading="isLoading"
              :body-item-class-name="bodyItemClassNameFunction"
              :header-item-class-name="headerItemClassNameFunction"
              :items="administrationStorage.back_up_list.results"
              hide-footer
              class="mb-3"
            > 
              <template #empty-message>
              <div class="dark:text-white">{{ $t('no_available_data') }}</div>
            </template>

              <template #header-author="header">
                {{ $t(header.text).toUpperCase() }}
              </template>

              <template #header-title="header">
                {{ $t(header.text).toUpperCase() }}
              </template>
              
              <template #header-created_at="header">
                {{ $t(header.text).toUpperCase() }}
              </template>
              
              <template #header-actions="header">
                {{ $t(header.text).toUpperCase() }}
              </template>


              <template #item-author="items">
                <div class="flex justify-center" style="overflow-wrap: anywhere;">
                  {{items.author && items.author.name ? items.author.name : ""}}
                </div>
              </template>

              <template #item-title="items">
                <div class="flex justify-center" style="overflow-wrap: anywhere;">
                  {{items.title}}
                </div>
              </template>

              <template #item-created_at="items">
                <div class="flex justify-center" style="overflow-wrap: anywhere;">
                  {{dayjs(items.created_at).format("DD-MM-YYYY")}}
                </div>
              </template>

              <template #item-actions="items">
                <div class="flex justify-end">
                  <button
                    class="btn-warning btn-action ml-2"
                    @click="download(items.file_path)"
                  >
                    <span
                      class="block cursor-pointer"
                      uk-icon="icon: cloud-download; ratio: 0.8;"
                    />
                  </button>
                  <button class="btn-danger btn-action ml-2" @click="openDeleteBackupModal(items.id)">
                    <Icon icon="Trash Bin Trash" color="#fff" size="16" />
                  </button>
                </div>
              </template>
            </EasyDataTable>
            <TwPagination
              class="tw-pagination"
              :current="params.page"
              :total="params.total"
              :per-page="params.limit"
              :text-before-input="$t('go_to_page')"
              :text-after-input="$t('forward')"
              @page-changed="onInput($event)"
            />
          </div>
        </div>




      </div>



     
        




      <!-- =========== Modal =========== -->
      <div
        id="backup-add-modal"
        class="uk-flex-top"
        uk-modal
      >
        <div class="uk-modal-dialog uk-margin-auto-vertical overflow-hidden rounded-md dark:bg-darkLayoutStorm">
          <button
            class="uk-modal-close-default"
            type="button"
            uk-close
          />
          <div class="uk-modal-header dark:bg-darkLayoutMain">
            <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b] dark:text-white">
              {{ $t('create_a_backup') }} 
            </h2>
          </div>
          <div class="uk-modal-body dark:text-gray-300">
            {{ $t('are_you_sure_you_want_to_back_up_the_database') }}
          </div>
          <div class="uk-modal-footer uk-text-right bg-white px-5 py-3 dark:bg-darkLayoutMain">
            <button
              uk-toggle="target: #backup-add-modal"
              class="mr-4 rounded-md bg-danger px-6 py-2 text-white duration-100 hover:opacity-90"
            >
              {{ $t('no') }}
            </button>
            <button
              class="rounded-md bg-primary px-6 py-2 text-white duration-100 hover:opacity-90"
              @click="createBackup()"
              :disabled="isLoading"
            >
              {{ $t('yes') }}
              <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin" 
                v-if="isLoading">
            </button>
          </div>
        </div>
      </div>
    
    
    




    
    
    
    
      <!-- =========== Modal =========== -->
      <div
        id="backup-delete-modal"
        class="uk-flex-top"
        uk-modal
      >
        <div class="uk-modal-dialog uk-margin-auto-vertical overflow-hidden rounded-md dark:bg-darkLayoutStorm">
          <button
            class="uk-modal-close-default"
            type="button"
            uk-close
          />
          <div class="uk-modal-header dark:bg-darkLayoutMain">
            <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b] dark:text-white">
              {{ $t('deletion_of_backup') }}
            </h2>
          </div>
          <div class="uk-modal-body dark:text-gray-300">
            {{ $t('are_you_sure_you_want_to_back_up_the_database') }}
          </div>
          <div class="uk-modal-footer uk-text-right bg-white px-5 py-3 dark:bg-darkLayoutMain">
            <button
              uk-toggle="target: #backup-delete-modal"
              class="mr-4 rounded-md bg-danger px-6 py-2 text-white duration-100 hover:opacity-90"
            >
              {{ $t('no') }}
            </button>
            <button
              class="rounded-md bg-primary px-6 py-2 text-white duration-100 hover:opacity-90"
              @click="deleteBackup()"
              :disabled="isLoading"
            >
              {{ $t('yes') }}
              <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin" 
                v-if="isLoading">
            </button>
          </div>
        </div>
      </div>







  </div>
</template>


<style lang="scss">

</style>