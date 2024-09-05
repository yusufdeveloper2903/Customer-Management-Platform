<script setup lang="ts">

//IMPORTED FILES

import VueDatePicker from '@vuepic/vue-datepicker';
import {useI18n} from 'vue-i18n'
import '@vuepic/vue-datepicker/dist/main.css'
import {onMounted, ref, reactive, watch, computed, Ref} from "vue";
import {toast} from "vue3-toastify";
import knowledgeBase from "../../store/index"
import referenceStore from "@/modules/KnowledgeBase/store/index"
import {useRoute, useRouter} from "vue-router";
import clientsStore from "@/modules/Users/store/index"
import {watchDebounced} from "@vueuse/core";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import {addFields} from '../../constants/index'
import {formatPhoneNumber} from "@/components/Formatters/Formatters";

//DECLARED VARIABLES

let select = ref(false)
let smsData = ref<any>([])
const itemSelected = ref<any[]>([]);
const {t} = useI18n()
const templateStore = referenceStore()
const store = knowledgeBase()
const router = useRouter()
const route = useRoute()
const loading = ref(false);
const clientsStorage = clientsStore()
const params = reactive({
  page_size: 10,
  page: 1,
  search: null,
  gender: '',
  os_type: ''

});
const smsSendingData = ref<any>({
  start_time: "",
  template: null,
  description: '',
  receivers: [],
  title: '',
  id: null
})
const listStatusOs = ref([
  {
    title: 'Android',
    value: 'android'
  },
  {
    title: 'iOS',
    value: 'iOS'
  },

])
const listStatus = ref([
  {
    title: 'Male',
    value: 'M'
  },
  {
    title: 'Female',
    value: 'F'
  },

])

//MOUNTED LIFE CYCLE
onMounted(async () => {
      await refresh()
      await templateStore.getSmsTemplate({page_size: 1000})
      if (route.params.id) {
        await store.getSmsSendingDetail({id: Number(route.params.id)})
        await store.getReseivers({
          object_id: route.params.id,
          notification_type: 'sms',
          search: params.search,
          page: params.page,
          page_size: 1000
        })
        smsSendingData.value.start_time = store.smsSendingDetail.start_time;
        smsSendingData.value.description = store.smsSendingDetail.description
        smsSendingData.value.title = store.smsSendingDetail.title
        smsSendingData.value.template = store.smsSendingDetail.template
      }
    }
)


// FUNCTIONS
const refresh = async () => {
  loading.value = true;
  try {
    await clientsStorage.getUsers(params)
    smsData.value = clientsStorage.usersList.results
  } catch (error: any) {
    toast.error(t('error'));
  }
  loading.value = false;
};


async function saveData() {
  const success = await validate.value.$validate();
  if (!success) return;

  if (itemSelected.value.length) {
    itemSelected.value.forEach(el => {
      smsSendingData.value.receivers.push(el.id)
    })
  } else {
    smsSendingData.value.receivers = []
  }
  if (smsSendingData.value.template) {
    smsSendingData.value.template = smsSendingData.value.template?.id
  } else {
    smsSendingData.value.template = ''
  }

  if (route.params.id) {
    smsSendingData.value.id = Number(route.params.id)
    try {
      await store.updateSmsSending(smsSendingData.value)
      await router.push("/sms-template");
      toast.success(t("updated_successfully"));

    } catch (error: any) {
      toast.error(t('error'));
    }
  } else {
    try {
      await store.createSmsSending(smsSendingData.value)
      await router.push("/sms-template");
      toast.success(t("created_successfully"));
    } catch (error: any) {
      toast.error(t('error'));
    }

  }
}


const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const changePagination = (e: number) => {
  params.page = e;
  refresh();
};

async function selectAllData() {
  select.value = !select.value
  if (select.value) {
    await clientsStorage.getUsersSelected({page_size: 1000})
    console.log(clientsStorage.usersListSelected.results, 'clientsStorage.usersListSelected.results')
    itemSelected.value = clientsStorage.usersListSelected.results
  } else {
    itemSelected.value = []
  }
}


//WATCHERS
watchDebounced(() => params.search, async function () {
  params.page = 1
  localStorage.setItem('page', '1')
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})

watchDebounced(() => params.gender, async function () {
  params.page = 1
  localStorage.setItem('page', '1')
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watchDebounced(() => params.os_type, async function () {
  params.page = 1
  localStorage.setItem('page', '1')
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})
watch(() => store.receiversList.results, function () {
  itemSelected.value = store.receiversList.results
  select.value = true
})
watch(() => smsSendingData.value.template, (val) => {
  if (!val) {
    smsSendingData.value.title = ''
    smsSendingData.value.description = ''
  }
})
watch(() => smsSendingData.value.template, function (val) {
  if (val?.id) {
    smsSendingData.value.title = val.title
    smsSendingData.value.description = val.description
  }

})


//COMPUTED
const rules = computed(() => {
  return {
    start_time: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    }
  };
});
const validate: Ref<Validation> = useVuelidate(rules, smsSendingData);
</script>

<template>
  <div class="flex gap-6">
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-1/2">
      <h1 class="font-semibold text-lg">{{ $t('sms sending') }}</h1>
      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('start_date') }} </label>
        <div class="uk-form-controls">
          <VueDatePicker format="dd-MM-yyyy" :enableTimePicker="false" auto-apply :locale="'ru'"
                         model-type="yyyy-MM-dd hh:mm:ss"
                         v-model="smsSendingData.start_time"
                         :class="validate.start_time.$errors.length ? 'required-input' : ''"/>
          <p
              v-for="error in validate.start_time.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </div>
      </div>
      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('template') }}</label>
        <div class="uk-form-controls">
          <VSelect v-model="smsSendingData.template"
                   :options="templateStore.smsTemplateList && templateStore.smsTemplateList.results"
                   :getOptionLabel="(name:any) => name.title " :reduce="(item:any) => item"/>
        </div>
      </div>


      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('name') }}</label>
        <div class="uk-form-controls">
          <input v-model="smsSendingData.title" class="form-input" @input="smsSendingData.template = null"/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('description') }}</label>
        <div class="uk-form-controls">
          <textarea v-model="smsSendingData.description" @input="smsSendingData.template = null"
                    :class="validate.description.$errors.length ? 'required-input' : ''" class="form-input"
                    rows="5"/>
          <p
              v-for="error in validate.description.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </div>
      </div>

    </div>

    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-full">
      <div>
        <h1 class="font-semibold text-lg mb-4">{{ $t('Receivers') }}</h1>

        <div class="flex items-center gap-4 mb-6">
          <div>
            <label for="search" class="dark:text-gray-300">
              {{ $t("Search") }}
            </label>
            <input
                id="search"
                type="text"
                class="form-input"
                v-model="params.search"
            />
          </div>
          <div class="w-1/4">
            <p>{{ $t("gender") }}</p>
            <v-select
                :options="listStatus"
                v-model="params.gender"
                :getOptionLabel="(name:any) => t(name.title)"
                :reduce="(item:any) => item.value"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
          <div class="w-1/4">
            <p>{{ $t("device_os_types") }}</p>
            <v-select
                :options="listStatusOs"
                v-model="params.os_type"
                :getOptionLabel="(name:any) => t(name.title)"
                :reduce="(item:any) => item.value"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
        </div>
        <EasyDataTable theme-color="#7367f0" :loading="loading" :headers="addFields"
                       v-model:items-selected="itemSelected"
                       :items="smsData"
                       hide-footer
                       @select-all="selectAllData"
        >


          <template #empty-message>
            <div>{{ $t('no_available_data') }}</div>
          </template>
          <template #item-phone="items">
          <span v-if="items.phone">
            {{ formatPhoneNumber(items.phone) }}
          </span>
            <span v-else class="text-center " style="margin-left:60px">
                 -
          </span>
          </template>
          <template #item-full_name="item">
             <span v-if="item.full_name">
            {{ item.full_name }}
          </span>
            <span v-else class="text-center " style="margin-left:20px">
                 -
          </span>
          </template>
          <template #item-device_os_types="item">
            <div v-for="(i,index) in item.device_os_types" :key="index" class="ml-12">
              {{ i }}
            </div>
          </template>
          <template #item-gender="item">
          <span v-if="item.gender" class="text-center ml-2">
            {{ item.gender === 'M' ? $t('Male') : $t('Female') }}
          </span>
            <span v-else class="text-center ml-3">
                 -
          </span>
          </template>


          <template #header="header">
            {{ $t(header.text) }}
          </template>

          <template #item-name="item">
            {{ item.name[$i18n.locale] }}
          </template>
        </EasyDataTable>
      </div>
      <TwPagination
          :total="clientsStorage.usersList.count"
          class="mt-10 tw-pagination"
          :restart="refresh"
          :current="params.page" :per-page="params.page_size"
          :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
          @page-changed="changePagination" @per-page-changed="onPageSizeChanged"/>

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

