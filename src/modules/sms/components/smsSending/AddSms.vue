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
import {SmsSendingData} from '../../interfaces'
import {addFields} from '../../constants/index'

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
});
const smsSendingData = ref<SmsSendingData>({
  start_time: "",
  template: '',
  description: '',
  receivers: [],
  title: '',
})


//MOUNTED LIFE CYCLE
onMounted(async () => {
      await refresh()
      await templateStore.getSmsTemplate()

      if (route.params.id) {
        await store.getSmsSendingDetail({id: Number(route.params.id)})
        await store.getReseivers({object_id: route.params.id, notification_type: 'sms', search: params.search, page: params.page, page_size: params.page_size})
        smsSendingData.value.start_time = store.smsSendingDetail.start_time;
        smsSendingData.value.description = store.smsSendingDetail.description
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
    toast.error(
        error.response || "Error"
    );
  }
  loading.value = false;
};


async function saveData() {
  const success = await validate.value.$validate();
  if (!success) return;
  const formData = new FormData()
  if (smsSendingData.value.title) {
    formData.append('title', smsSendingData.value.title)
    formData.append('description', smsSendingData.value.description)
  }
  if (route.params.id) {
    formData.append('id', String(route.params.id))
  }
  if (smsSendingData.value.start_time) {
    formData.append('start_time', String(smsSendingData.value.start_time))
  }
  if (itemSelected.value.length) {
    itemSelected.value.forEach(el => {
      formData.append('receivers', el.id)
    })
  } else {
    formData.append('receivers', 'null')
  }

  if (smsSendingData.value.template) {
    formData.append('template', String(smsSendingData.value.template.id))
  }
  if (route.params.id) {
    try {
      store.updateSmsSending(formData).then(() => {
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
      store.createSmsSending(formData).then(() => {
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
    await clientsStorage.getUsersSelected(params)
    itemSelected.value = clientsStorage.usersListSelected.results
  } else {
    itemSelected.value = []
  }
}


//WATCHERS
watchDebounced(() => params.search, async function () {
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})


watch(() => store.receiversList.results, function () {
  itemSelected.value = store.receiversList.results
  select.value = true
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
          <VueDatePicker :locale="'ru'" model-type="yyyy-MM-dd hh:mm:ss" v-model="smsSendingData.start_time"
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
          <div class=" w-1/4">
            <label for="search" class="dark:text-gray-300">
              {{ $t("Search") }}
            </label>
            <input
                id="search"
                type="text"
                class="form-input"
                :placeholder="$t('Search')"
                v-model="params.search"
            />
          </div>
        </div>
        <EasyDataTable theme-color="#7367f0" :loading="loading" :headers="addFields"
                       v-model:items-selected="itemSelected"
                       :items="smsData"
                       hide-footer
                       @select-all="selectAllData"
        >


          <template #empty-message>
            <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
          </template>
          <template #header="data">
            {{ t(data.text) }}
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

