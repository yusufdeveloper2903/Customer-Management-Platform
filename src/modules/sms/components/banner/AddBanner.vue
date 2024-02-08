<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { useI18n } from 'vue-i18n'
// import {Textarea} from "flowbite-vue";
import type { Header } from "vue3-easy-data-table";
import '@vuepic/vue-datepicker/dist/main.css'
import { onMounted, ref, reactive, watch } from "vue";
import { toast } from "vue3-toastify";
import knowledgeBase from "../../store/index"
import { useRoute, useRouter } from "vue-router";
import clientsStore from "@/modules/Users/store/index"
import referenceStore from "@/modules/KnowledgeBase/store/index"

const file = ref<string>("")
const templateStore = referenceStore()
const { t } = useI18n()
const store = knowledgeBase()
const router = useRouter()
const route = useRoute()
const reseiversList = ref<object[]>([])
const clientsList = ref<object[]>([])
const current = ref<number>(1);
const loading = ref(false);
const clientsStorage = clientsStore()

interface BannerData {
  start_time: any;
  end_time: any;
  description: {
    ru: string | null;
    uz: string | null;
  }
  template: string | number;
  url: string | null;
  title: {
    ru: string | null;
    uz: string | null;
  },
  photo: string | null,
  receivers: number[]
}

const bannerData = ref<BannerData>({
    title: {
      uz: "",
      ru: ""
    },
    photo: "",
    start_time: "",
    end_time: "",
    description: {
      uz: "",
      ru: ""
    },
    template: "",
    url: "",
    receivers: []

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
      await store.getReseivers({ object_id: route.params.id, notification_type: 'banner' })
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
  templateStore.getSmsTemplate()


  if (route.params.id) {
  await store.getBannerDetail({ id: Number(route.params.id)})     
  bannerData.value.start_time = store.bannerListDetail.start_time;
  bannerData.value.end_time = store.bannerListDetail.end_time;
  bannerData.value.title = store.bannerListDetail.title
  bannerData.value.photo = store.bannerListDetail.file
  bannerData.value.url = store.bannerListDetail.url
  bannerData.value.template = store.bannerListDetail.template.id
  bannerData.value.description = store.bannerListDetail.description

  }
})

function getId(id: number) {
  if (bannerData.value.receivers.includes(id)) {
    let index = bannerData.value.receivers.indexOf(id)
    bannerData.value.receivers.splice(index, 1)
  } else {
    bannerData.value.receivers.push(id)
  }

}

const headers: Header[] = [
  { text: "button", value: "check" },
  { text: "id", value: "id" },
  { text: "Full Name", value: "full_name" },
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
    bannerData.value.photo = e.target.files[0]
  file.value = e.target.files[0]
}

function checkAll() {
  if (bannerData.value.receivers.length) {
    bannerData.value.receivers = []
    return
  }
  if(route.params.id) {
    store.reseiversList.results.map(i => {
        bannerData.value.receivers.push(i.id)

    })
  } else {
    clientsStorage.usersList.results.map(i => {
        bannerData.value.receivers.push(i.id)
    })
  }
}


const saveData = async () => {
    const formData = new FormData()
    if(file.value){
      formData.append('file', bannerData.value.photo)
      formData.append('title', JSON.stringify(bannerData.value.title))
      formData.append('description', JSON.stringify(bannerData.value.description))
      formData.append('template', bannerData.value.template)
      formData.append('start_time', bannerData.value.start_time)
      formData.append('end_time', bannerData.value.end_time)
      formData.append('receivers', bannerData.value.receivers)
    } else {
      formData.append('title', JSON.stringify(bannerData.value.title))
      formData.append('description', JSON.stringify(bannerData.value.description))
      formData.append('template', bannerData.value.template)
      formData.append('start_time', bannerData.value.start_time)
      formData.append('end_time', bannerData.value.end_time)
      formData.append('receivers', bannerData.value.receivers)
    }
// console.log(formData);

  if (route.params.id) {    
    try {
        formData.append('id', route.params.id)
        await store.updateBanner(formData).then(() => {
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
        await store.createBanner(formData).then(() => {
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
      <h1 class="font-semibold text-lg">{{ $t('Banner') }}</h1>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('start_date') }}</label>
        <div class="uk-form-controls">
          <VueDatePicker v-model="bannerData.start_time" model-type="yyyy-MM-dd hh:mm" :placeholder="bannerData.start_time"/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('end_date') }}</label>
        <div class="uk-form-controls">
          <VueDatePicker v-model="bannerData.end_time" model-type="yyyy-MM-dd hh:mm" :placeholder="bannerData.end_time"/>
        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text" class="mt-4 block">{{ $t('template') }}
              <VSelect v-model="bannerData.template" 
                :options="templateStore.smsTemplateList && templateStore.smsTemplateList.results"
                :getOptionLabel="(name) => name.title && name.title[$i18n.locale]" :reduce="(name) => name.id" />
            </label>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('name') }}</label>
        <div class="uk-form-controls">
          <input disabled v-if="bannerData.template" class="form-input" rows="5" />
          <input v-model="bannerData.title[$i18n.locale]"  v-else class="form-input" rows="5" />

        </div>
      </div>

      <div class="uk-margin">
        <label for="form-stacked-text">{{ $t('description') }}</label>
        <div class="uk-form-controls">
          <textarea disabled v-if="bannerData.template" class="form-input" rows="5" />
          <textarea v-model="bannerData.description[$i18n.locale]" v-else class="form-input" rows="5" />

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
              <input type="text" class="form-input p-1" v-model="bannerData.url"/>
            </div>        
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
            <input type="checkbox" @change="getId(item.id)" :checked="bannerData.receivers.includes(item.id)">
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
      <TwPagination class="mt-10 tw-pagination" :total="route.params.id ? store.reseiversList && store.reseiversList.count : clientsStorage.usersList && clientsStorage.usersList.count" :current="current" :per-page="10" :text-before-input="$t('go_to_page')"
        :text-after-input="$t('forward')" @page-changed="changePagionation" />
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

