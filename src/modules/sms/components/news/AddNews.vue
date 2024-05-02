<script setup lang="ts">

//IMPORTED FILES
import VueDatePicker from '@vuepic/vue-datepicker';
import {useI18n} from 'vue-i18n'
import '@vuepic/vue-datepicker/dist/main.css'
import {onMounted, ref, reactive, watch, computed, Ref} from "vue";
import {toast} from "vue3-toastify";
import knowledgeBase from "../../store/index"
import {useRoute, useRouter} from "vue-router";
import clientsStore from "@/modules/Users/store/index"
import newsTemplate from "@/modules/KnowledgeBase/store"
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import FileInput from "@/components/FileInput/FileInput.vue";
import {watchDebounced} from "@vueuse/core";
import {newsHeader} from '../../constants/index'
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";

//DECLARED VARIABLES
const itemSelected = ref<any[]>([]);
const newTemplate = newsTemplate()
const {t} = useI18n()
const store = knowledgeBase()
const router = useRouter()
const route = useRoute()
const receiversList = ref<object[]>([])
let select = ref(false)
const loading = ref(false);
const clientsStorage = clientsStore()
let lang = ref<string | null>('')
const newsData = ref<any>({
  title_ru: '',
  title_uz: '',
  title_kr: '',
  title: '',
  description_ru: '',
  description_uz: '',
  description_kr: '',
  description: '',
  photo: "",
  start_time: "",
  status: '',
  url: "",
  receivers: [],
  template: null,
  enable_push_notify: false
})
const params = reactive({
  page_size: 10,
  page: 1,
  search: null,
});


//WATCHERS
watchDebounced(() => params.search, async function () {
  await refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})

watch(() => store.receiversList.results, function () {
  itemSelected.value = store.receiversList.results
  select.value = true
})

watch(() => newsData.value.template, (val: any) => {
  if (val?.id) {
    newsData.value.title_uz = val?.title_uz
    newsData.value.title_ru = val?.title_ru
    newsData.value.title_kr = val?.title_kr
    newsData.value.description_uz = val?.description_uz
    newsData.value.description_ru = val?.description_ru
    newsData.value.description_kr = val?.description_kr
    newsData.value.description = val?.description
  }
})


//MOUNTED
onMounted(async () => {
  await refresh()

  if (route.params.id) {
    await store.getNewsDetail({id: Number(route.params.id)})
    await store.getReseivers({
      object_id: route.params.id,
      notification_type: 'news',
      search: params.search,
      page: params.page,
      page_size: params.page_size
    })
    newsData.value.start_time = store.newsListDetail.start_time;
    newsData.value.title = store.newsListDetail.title
    newsData.value.title_ru = store.newsListDetail.title_ru
    newsData.value.title_uz = store.newsListDetail.title_uz
    newsData.value.title_kr = store.newsListDetail.title_kr
    newsData.value.photo = store.newsListDetail.file
    newsData.value.url = store.newsListDetail.url
    newsData.value.status = store.newsListDetail.status
    newsData.value.description = store.newsListDetail.description
    newsData.value.description_ru = store.newsListDetail.description_ru
    newsData.value.description_uz = store.newsListDetail.description_uz
    newsData.value.description_kr = store.newsListDetail.description_kr
    newsData.value.template = store.newsListDetail.template
    newsData.value.enable_push_notify = store.newsListDetail.enable_push_notify
  }
  await store.getStatus()
  await newTemplate.getNewsTemplate({page_size: 1000})
  lang.value = localStorage.getItem('last-locale')
})


//FUNCTIONS
const refresh = async () => {
  loading.value = true;
  try {
    await clientsStorage.getUsers(params)
    receiversList.value = clientsStorage.usersList.results
  } catch (error: any) {
    toast.error(t('error'));
  }
  loading.value = false;
};

const changePagination = (e: number) => {
  params.page = e;
  refresh();
};
const changePageSize = (event: number) => {
  params.page = 1
  params.page_size = event
  refresh()
}

async function selectAllData() {
  select.value = !select.value
  if (select.value) {
    await clientsStorage.getUsersSelected(params)
    itemSelected.value = clientsStorage.usersListSelected.results
  } else {
    itemSelected.value = []
  }
}

const saveData = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  const formData = new FormData()
  if (typeof newsData.value.photo !== 'string' && newsData.value.photo !== null) {
    formData.append('file', newsData.value.photo)
  }
  if (newsData.value.title_uz) {
    formData.append('title', newsData.value.title_uz)
    formData.append('title_uz', newsData.value.title_uz)
  }
  if (newsData.value.title_ru) {
    formData.append('title_ru', newsData.value.title_ru)

  }
  if (newsData.value.title_kr) {
    formData.append('title_kr', newsData.value.title_kr)
  }
  if (newsData.value.description_uz) {
    formData.append('description', newsData.value.description_uz)
    formData.append('description_uz', newsData.value.description_uz)
  }
  if (newsData.value.description_ru) {
    formData.append('description_ru', newsData.value.description_ru)

  }
  if (newsData.value.description_kr) {
    formData.append('description_kr', newsData.value.description_kr)
  }
  if (newsData.value.start_time) {
    formData.append('start_time', newsData.value.start_time)
  }
  if (newsData.value.status) {
    formData.append('status', newsData.value.status?.id)
  }
  formData.append('enable_push_notify', String(newsData.value.enable_push_notify))
  if (itemSelected.value.length) {
    itemSelected.value.forEach(el => {
      formData.append('receivers', el.id)
    })
  } else {
    formData.append('receivers', '[]')

  }

  if (newsData.value.template) {
    formData.append('template', newsData.value.template?.id)
  } else {
    formData.append('template', '')

  }
  if (route.params.id) {
    try {
      let id = String(route.params.id)
      formData.append('id', id)
      await store.updateNews(formData).then(() => {
        router.push("/sms-template");
        toast.success(t("updated_successfully"));
      })
    } catch (error: any) {
      if (error) {
        toast.error(t('error'));
      }
    }

  } else {
    try {
      await store.createNews(formData).then(() => {
        router.push("/sms-template");
        toast.success(t("created_successfully"));
      })
    } catch (error: any) {
      if (error) {
        toast.error(t('error'));
      }
    }
  }
};


//COMPUTED
const rules = computed(() => {
  return {
    start_time: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),

    },
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),

    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    }
  };

});
const validate: Ref<Validation> = useVuelidate(rules, newsData);
</script>

<template>
  <div class="flex gap-6">
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-1/2">
      <h1 class="font-semibold text-lg">{{ $t('news') }}</h1>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('start_date') }} </label>
        <div class="uk-form-controls">
          <VueDatePicker :locale="'ru'" model-type="yyyy-MM-dd hh:mm:ss"
                         :class="validate.start_time.$errors.length ? 'required-input' : ''"
                         v-model="newsData.start_time"
          />
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
        <label for="form-stacked-text" class="mt-4 block">{{ $t('Status') }}
          <VSelect v-model="newsData.status"
                   :options="store.statusList.results"
                   :getOptionLabel="(item) => item['title_'+ $i18n.locale]"
                   :reduce="(name) => name.id"
          />
        </label>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text" class="mt-4 block">{{ $t('template') }}
          <VSelect v-model="newsData.template"
                   :getOptionLabel="(name) => name['title_'+ $i18n.locale]"
                   :options="newTemplate.newTemplate && newTemplate.newTemplate.results"
                   :reduce="(name) => name"
          />
        </label>
      </div>
      <Tabs>
        <Tab title="UZ">
          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('name') + ' ' + $t('UZ') }}</label>
            <div class="uk-form-controls">
              <input @input="newsData.template = null" v-model="newsData.title_uz" class="form-input"
                     :class="validate.title_uz.$errors.length ? 'required-input' : ''"/>
              <p
                  v-for="error in validate.title_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </div>
          </div>
          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('description') + ' ' + $t('UZ') }}</label>
            <div class="uk-form-controls">
          <textarea
              @input="newsData.template = null"
              v-model="newsData.description_uz"
              class="form-input" rows="5"/>
            </div>
          </div>

        </Tab>
        <Tab title="KR">

          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('name') + ' ' + $t('KR') }}</label>
            <div class="uk-form-controls">
              <input @input="newsData.template = null" :class="validate.title_kr.$errors.length ? 'required-input' : ''"
                     v-model="newsData.title_kr"
                     class="form-input"/>
              <p
                  v-for="error in validate.title_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </div>
          </div>
          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('description') + ' ' + $t('KR') }}</label>
            <div class="uk-form-controls">
          <textarea
              @input="newsData.template = null"
              v-model="newsData.description_kr"
              class="form-input" rows="5"/>
            </div>
          </div>
        </Tab>
        <Tab title="RU">

          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('name') + ' ' + $t('RU') }}</label>
            <div class="uk-form-controls">
              <input @input="newsData.template = null" :class="validate.title_ru.$errors.length ? 'required-input' : ''"
                     v-model="newsData.title_ru"
                     class="form-input"/>
              <p
                  v-for="error in validate.title_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </div>
          </div>
          <div class="uk-margin">
            <label for="form-stacked-text">{{ $t('description') + ' ' + $t('RU') }}</label>
            <div class="uk-form-controls">
          <textarea
              @input="newsData.template = null"
              v-model="newsData.description_ru"
              class="form-input" rows="5"/>
            </div>
          </div>
        </Tab>
      </Tabs>


      <div class="uk-margin">
        <label
        >{{ $t('photo') }}
          <FileInput
              v-model="newsData.photo"
              @remove="newsData.photo = ''"
              :typeModal="route.params.id"
              name="news-detail"
          />
        </label>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('Url') }}</label>
        <div class="uk-form-controls">
          <input type="text" class="form-input p-1" v-model="newsData.url"/>
        </div>
      </div>
      <p class=" mt-5 mb-1">{{ $t("push_notification") }}:</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            v-model="newsData.enable_push_notify"
            class="sr-only peer"
        />
        <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
        ></div>
      </label>
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-full">
      <div>
        <h1 class="font-semibold text-lg mb-4">{{ $t('Receivers') }}</h1>

        <div class="flex items-center gap-4 mb-6">
          <div class=" w-1/4">
            <label for="form-stacked-text">{{ $t('Search') }}</label>
            <div class="uk-form-controls">
              <input type="search" class="form-input" v-model="params.search"/>
            </div>
          </div>
        </div>
        <EasyDataTable theme-color="#7367f0" :loading="loading" :headers="newsHeader"
                       v-model:items-selected="itemSelected"
                       :items="receiversList"
                       @select-all="selectAllData"
                       hide-footer>
          <template #empty-message>
            <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
          </template>
          <template #header="data">
            {{ t(data.text) }}
          </template>
          <template #item-fio="item">
            {{ item.full_name }}
          </template>
        </EasyDataTable>
      </div>
      <TwPagination class="mt-10 tw-pagination"
                    :total="store.receiversList && store.receiversList.count"
                    :current="params.page" :per-page="params.page_size" :text-before-input="$t('go_to_page')"
                    :text-after-input="$t('forward')" @page-changed="changePagination"
                    @per-page-changed="changePageSize"/>
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

