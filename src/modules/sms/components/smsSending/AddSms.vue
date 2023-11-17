<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { useI18n } from 'vue-i18n'
// import {Textarea} from "flowbite-vue";
import type { Header } from "vue3-easy-data-table";
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, ref, reactive, watch } from "vue";
import { toast } from "vue3-toastify";
import knowledgeBase from "../../store/index"
import referenceStore from "@/modules/KnowledgeBase/store/index"
import { useRoute, useRouter } from "vue-router";
import clientsStore from "@/modules/Users/store/index"

const { t } = useI18n()
const templateStore = referenceStore()
const store = knowledgeBase()
const router = useRouter()
const route = useRoute()
const is_active = ref(false)
const reseiversList = ref<object[]>([])
const current = ref<number>(1);
const loading = ref(false);
const clientsStorage = clientsStore()
const clientsList = ref<object[]>([])

const headers: Header[] = [
  { text: "", value: "check" },
  { text: "id", value: "id" },
  { text: "Full Name", value: "full_name" },
  { text: "phone_number", value: "phone" },
];

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const filterClient = reactive({
  page_size: 10,
  search: "",

});

interface SmsSendingData {
  start_time: any;
  template: null | number;
  description: {
    ru: string;
    uz: string;
  }
  receivers: number[]
}
const smsSendingData = ref<SmsSendingData>({
  start_time: "",
  template: null,
  description: {
    ru: "",
    uz: ""
  },
  receivers: []

})

const ckeckedDate = () => {
  if (is_active.value == false) {
    is_active.value = true
    smsSendingData.value.start_time = new Date()
  } else if (is_active.value == true) {
    is_active.value = false
    smsSendingData.value.start_time = null
  }

}

const refresh = async (filter) => {
  loading.value = true;
  try {
    if (route.params.id) {
      await store.getReseivers({ object_id: route.params.id, notification_type: 'sms' })
      reseiversList.value = store.reseiversList.results;
      smsSendingData.value.receivers = store.reseiversList.results.map(el => el.id)
    } else {
      await clientsStorage.getUsers(filter)
      clientsList.value = clientsStorage.usersList.results
    }
  } catch (error: any) {
    toast.error(
      error.response || "Error"
    );
  }
  loading.value = false;
};

onMounted(async () => {
  await refresh(filterClient)
  templateStore.getSmsTemplate()

  if (route.params.id) {
    await store.getSmsSendingDetail({ id: Number(route.params.id) })

    smsSendingData.value.start_time = store.smsSendingDetail.start_time;
    smsSendingData.value.description = store.smsSendingDetail.description
    smsSendingData.value.template = store.smsSendingDetail.template.id
  }

})

function getId(id: number) {
  if (smsSendingData.value.receivers.includes(id)) {
    let index = smsSendingData.value.receivers.indexOf(id)
    smsSendingData.value.receivers.splice(index, 1)
  } else {
    smsSendingData.value.receivers.push(id)
  }

}

function checkAll() {
  if (smsSendingData.value.receivers.length) {
    smsSendingData.value.receivers = []
    return
  }
  if (route.params.id) {
    store.reseiversList.results.map(i => {
      smsSendingData.value.receivers.push(i.id)
    })
  } else {
    clientsStorage.usersList.results.map(i => {
      smsSendingData.value.receivers.push(i.id)
    })
  }
}

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({ ...paginationFilter, ...filterClient });
};

watch(
  () => filterClient.search,
  () => {
    if (route.params.id ? store.reseiversList.results.length <= 10 : clientsStorage.usersList.results.length <= 10) {
      current.value = 1;
    }
  }
);

function saveData() {
  if (route.params.id) {
    try {
      store.updateSmsSending({ id: route.params.id, ...smsSendingData.value }).then(() => {
        router.push("/sms-template");
        toast.success(t("updated_successfully"));
      })
    } catch (error: any) {
      if (error) {
        toast.error(
          error.response.message || "Error"

        );
      }
    }
  } else {
    try {
      store.createSmsSending(smsSendingData.value).then(() => {
        router.push("/sms-template");
        toast.success(t("created_successfully"));
      })
    } catch (error: any) {
      if (error) {
        toast.error(
          error.response.message || "Error"

        );
      }
    }

  }
}

</script>

<template>
  <div class="flex gap-6">
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-1/2">
      <h1 class="font-semibold text-lg">{{ $t('sms sending') }}</h1>

      <div class="uk-margin mb-0 flex items-center">

        <div class="uk-form-controls mr-2 flex">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="is_active" @click="ckeckedDate" />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
          </label>
        </div>
        <label for="form-stacked-text" class="text-sm">{{ $t('Set date and time') }}</label>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('start_date') }} </label>
        <div class="uk-form-controls">
          <VueDatePicker v-model="smsSendingData.start_time" />
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('template') }}</label>
        <div class="uk-form-controls">
          <VSelect v-model="smsSendingData.template"
            :options="templateStore.smsTemplateList && templateStore.smsTemplateList.results"
            :getOptionLabel="(name) => name.title && name.title[$i18n.locale]" :reduce="(name) => name.id" />
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('description') }}</label>
        <div class="uk-form-controls">
          <textarea v-model="smsSendingData.description[$i18n.locale]" class="form-input" rows="5" />
        </div>
      </div>

    </div>

    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-full">
      <div>
        <h1 class="font-semibold text-lg mb-4">{{ $t('Receivers') }}</h1>

        <div class="flex items-center gap-4 mb-6">
          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Search') }}</label>
            <div class="uk-form-controls">
              <input type="search" class="form-input" v-model="filterClient.search" />
            </div>
          </div>
        </div>

        <EasyDataTable theme-color="#7367f0" :loading="loading" :headers="headers"
          :items="route.params.id ? reseiversList : clientsList" hide-footer>
          <template #header-check="">
            <input type="checkbox" @change="checkAll">
          </template>

          <template #item-check="item">
            <input type="checkbox" @change="getId(item.id)" :checked="smsSendingData.receivers.includes(item.id)">
          </template>

          <template #empty-message>
            <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
          </template>
          <template #header="data">
            {{ t(data.text).toUpperCase() }}
          </template>

          <template #item-name="item">
            {{ item.name[$i18n.locale] }}
          </template>
        </EasyDataTable>
      </div>
      <TwPagination class="mt-10 tw-pagination"
        :total="route.params.id ? store.reseiversList && store.reseiversList.count : clientsStorage.usersList && clientsStorage.usersList.count"
        :current="current" :per-page="10" :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
        @page-changed="changePagionation" />
    </div>
  </div>
  <div class="flex justify-end mt-4">
    <button class="btn-secondary" @click="router.back('/sms-template')">
      {{ $t('Cancel') }}
    </button>
    <button class="btn-success ml-2" @click="saveData">
      {{ $t('Save') }}
    </button>
  </div>
</template>

