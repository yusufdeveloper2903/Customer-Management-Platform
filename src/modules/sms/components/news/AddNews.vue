<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { useI18n } from 'vue-i18n'
import type { Header } from "vue3-easy-data-table";
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, ref, reactive, watch } from "vue";
import { toast } from "vue3-toastify";
import knowledgeBase from "../../store/index"
import { useRoute, useRouter } from "vue-router";
import clientsStore from "@/modules/Users/store/index"
import newsTemplate from "@/modules/KnowledgeBase/store"


const file = ref<string>("")
const newTemplate = newsTemplate()
const { t } = useI18n()
const store = knowledgeBase()
const router = useRouter()
const route = useRoute()
const reseiversList = ref<object[]>([])
const clientsList = ref<object[]>([])
const current = ref<number>(1);
const loading = ref(false);
const clientsStorage = clientsStore()

interface NewsData {
  start_time: any;
  url: string | null;
  status: string | null,
  title: {
    ru: string;
    uz: string;
  },
  description: {
      uz: string,
      ru: string
    },
  photo: string | null,
  receivers: number[],
  template: null | string,
  enable_push_notify: boolean
}

const newsData = ref<NewsData>({
    title: {
      uz: "",
      ru: ""
    },
    description: {
      uz: "",
      ru: ""
    },
    photo: "",
    start_time: "",
    status: "",
    url: "",
    receivers: [],
    template: null,
    enable_push_notify: false
})

const paginationFilter = reactive({
  page_size: 10,
  page: 1,
});

const filterClient = reactive({
  page_size: 10,
  search: "",

});


const refresh = async (filter) => {
  loading.value = true;
  try {
    if(route.params.id){
      await store.getReseivers({ object_id: route.params.id, notification_type: 'news' })
      reseiversList.value = store.reseiversList.results;
    } else {
      await clientsStorage.getUsers(filter)
      clientsList.value = clientsStorage.usersList.results
    }
  } catch (error: any) {
    toast.error(
      error.response.message || "Error"
    );
  }
  loading.value = false;
};

onMounted(async () => {
  await refresh(filterClient)
  await store.getStatus()
  await newTemplate.getNewsTemplate()

  if (route.params.id) {
  await store.getNewsDetail({ id: Number(route.params.id)})    
      newsData.value.start_time = store.newsListDetail.start_time;
      newsData.value.title = store.newsListDetail.title
      newsData.value.photo = store.newsListDetail.file
      newsData.value.url = store.newsListDetail.url
      newsData.value.status = store.newsListDetail.status
      newsData.value.description = store.newsListDetail.description
      newsData.value.template = store.newsListDetail.template
  }
})

function getId(id: number) {
  if (newsData.value.receivers.includes(id)) {
    let index = newsData.value.receivers.indexOf(id)
    newsData.value.receivers.splice(index, 1)
  } else {
    newsData.value.receivers.push(id)
  }

}

const headers: Header[] = [
  { text: "button", value: "check" },
  { text: "id", value: "id" },
  { text: "fio", value: "fio" },
  { text: "phone_number", value: "phone" },
];

const changePagionation = (e: number) => {
  paginationFilter.page = e;
  current.value = e;
  refresh({ ...paginationFilter, ...filterClient });
};

watch(
  () => filterClient.search,
  () => {
    if (route.params.id ? store.reseiversList.results.length  <= 10 : clientsStorage.usersList.results.length <= 10) {
      current.value = 1;
    }
  }
);

const getFile = (e: any) => {
  newsData.value.photo = e.target.files[0]
  file.value = e.target.files[0]
}

function checkAll() {
  if (newsData.value.receivers.length) {
    newsData.value.receivers = []
    return
  }
  if(route.params.id) {
    store.reseiversList.results.map(i => {
      newsData.value.receivers.push(i.id)

    })
  } else {
    clientsStorage.usersList.results.map(i => {
      newsData.value.receivers.push(i.id)
    })
  }
}


const saveData = async () => {
    const formData = new FormData()
    if(file.value){
      formData.append('file', newsData.value.photo)
      if(newsData.value.title){
        formData.append('title', JSON.stringify(newsData.value.title))
        formData.append('description', JSON.stringify(newsData.value.description))
      }
      formData.append('status', newsData.value.status)
      formData.append('start_time', newsData.value.start_time)
       newsData.value.receivers.forEach(el => {
         formData.append('receivers', el )
       })
      formData.append('template', newsData.value.template.id)
      formData.append('enable_push_notify', newsData.value.enable_push_notify)
    } else {
      if(newsData.value.title){
        formData.append('title', JSON.stringify(newsData.value.title))
        formData.append('description', JSON.stringify(newsData.value.description))
      }
      formData.append('status', newsData.value.status)
      formData.append('start_time', newsData.value.start_time)
      formData.append('enable_push_notify', newsData.value.enable_push_notify)
      newsData.value.receivers.forEach(el => {
         formData.append('receivers', el )
       })
      if(newsData.value.template){
        formData.append('template', newsData.value.template?.id)
      }

    }

  if (route.params.id) {    
    try {
        formData.append('id', route.params.id)
        await store.updateNews(formData).then(() => {
          router.push("/sms-template");
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
        });
      } catch (error: any) {
        if (error) {
          toast.error(
            error.response.message || "Error"

          );
        }
      }
    
  } else {
      try {
        await store.createNews(formData).then(() => {
          router.push("/sms-template");
          setTimeout(() => {
            toast.success(t("created_successfully"));
          }, 200);
        });
      } catch (error: any) {
        if (error) {
          toast.error(
            error.response.message || "Error"

          );
        }
      }
  }
};


</script>

<template>
  <div class="flex gap-6">
    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-1/2">
      <h1 class="font-semibold text-lg">{{ $t('news') }}</h1>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('start_date') }} </label> 
        <div class="uk-form-controls"> 
          <VueDatePicker v-model="newsData.start_time" model-type="yyyy-MM-dd hh:mm" :placeholder="newsData.start_time"/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text" class="mt-4 block">{{ $t('Status') }}
              <VSelect v-model="newsData.status" 
                :options="store.statusList && store.statusList.results"
                :getOptionLabel="(name) => name.title[$i18n.locale]"  
                :reduce="(name) => name.id"
                />
            </label>
      </div>

      <div class="uk-margin" v-if="!newsData.title[$i18n.locale]">
        <label for="form-stacked-text" class="mt-4 block">{{ $t('template') }}
              <VSelect v-model="newsData.template" 
              :getOptionLabel="(name) => name.title[$i18n.locale]"  
              :options="newTemplate.newTemplate && newTemplate.newTemplate.results"
              :reduce="(name) => name"
              />
            </label>
      </div>

      <div class="uk-margin" v-if="newsData.template">
        <label for="form-stacked-text">{{ $t('name') }}</label>
        <div class="uk-form-controls">
          <input v-model="newsData.template.title[$i18n.locale]" class="form-input" disabled/>        
        </div>
      </div>
      
      <div class="uk-margin" v-else>
        <label for="form-stacked-text">{{ $t('name') }}</label>
        <div class="uk-form-controls">
          <input v-model="newsData.title[$i18n.locale]" class="form-input" />
        </div>
      </div>

      <div class="uk-margin" v-if="newsData.template">
        <label for="form-stacked-text">{{ $t('description') }}</label>
        <div class="uk-form-controls">
          <textarea v-model="newsData.template.description[$i18n.locale]" class="form-input" rows="5" disabled />
        </div>
      </div>

      <div class="uk-margin" v-else>
        <label for="form-stacked-text">{{ $t('description') }}</label>
        <div class="uk-form-controls">
          <textarea v-model="newsData.description[$i18n.locale]" class="form-input" rows="5" />
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('photo') }}</label>
            <div class="uk-form-controls">
              <input @input="getFile" type="file" class="form-file-input p-1" />
            </div>        
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('Url') }}</label>
            <div class="uk-form-controls">
              <input type="text" class="form-input p-1" v-model="newsData.url"/>
            </div>        
      </div>

      <div class="uk-form-controls mr-2 flex">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="newsData.enable_push_notify"/>
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
          </label>
        </div>
    </div>



    <div class="uk-card uk-card-default uk-card-body uk-card-small rounded dark:bg-darkLayoutStorm w-full">
      <div>
        <h1 class="font-semibold text-lg mb-4">{{ $t('Receivers') }}</h1>

        <div class="flex items-center gap-4 mb-6">
          <div class=" w-1/4">
            <label for="form-stacked-text" >{{ $t('Search') }}</label>
            <div class="uk-form-controls">
              <input type="search" class="form-input" v-model="filterClient.search"/>
            </div>
          </div>
        </div>
        <EasyDataTable theme-color="#7367f0" :loading="loading" :headers="headers" :items="route.params.id ? reseiversList : clientsList" hide-footer>

          <template #header-check="">
            <input type="checkbox" @change="checkAll">
          </template>

          <template #item-check="item">
            <input type="checkbox" @change="getId(item.id)" :checked="newsData.receivers.includes(item.id)">
          </template>

          <template #empty-message>
            <span class="dark:text-neutral-400">{{ t('empty_text') }}</span>
          </template>
          <template #header="data">
            {{ t(data.text).toUpperCase() }}
          </template>

          <template #item-fio="item">
            {{ item.full_name }}
          </template>
        </EasyDataTable>
      </div>
      <TwPagination class="mt-10 tw-pagination" :total="route.params.id ? store.reseiversList && store.reseiversList.count : clientsStorage.usersList && clientsStorage.usersList.count" :current="current" :per-page="10" :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')" @page-changed="changePagionation" />
    </div>
  </div>
  <div class="flex justify-end mt-4">
    <button class="btn-secondary" @click="router.back('/sms-template')">
      {{$t('Cancel')}}
    </button>
    <button class="btn-success ml-2" @click="saveData">
      {{ $t('Save') }}
    </button>
  </div>
</template>