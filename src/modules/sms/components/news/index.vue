<script setup lang="ts">

//IMPORTED FILES

import {useI18n} from "vue-i18n";
import {newsFields} from "../../constants/index"
import knowledgeBase from "../../store/index"
import {onMounted, ref, reactive, watch, nextTick} from "vue";
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {useRouter} from "vue-router";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";
import {EditDataNews} from '../../interfaces'
import {watchDebounced} from "@vueuse/core";

//DECLARED VARIABLES

const {t} = useI18n()
const router = useRouter()
const store = knowledgeBase()
const newsList = ref<object[]>([]);
const isLoading = ref(false);
const newsId = ref<number | null>(null)
const params = reactive({
  page_size: 10,
  page: 1,
  search: "",
  status: null,
  start_time: null,

});
const image = ref<string>("");
const imageCard = ref();
const editData = ref<EditDataNews>({
  id: null,
  title: '',
  title_uz: '',
  title_ru: '',
  title_kr: '',
  file: "",
  start_time: "",
  status: ""
})
const props = defineProps<{
  sms: string,
  params: {
    page: number,
    page_size: number
  },
}>();
let toRefresh = ref(false)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let page = localStorage.getItem('page')
  let page_size = localStorage.getItem('page_size')
  if (page) {
    params.page = JSON.parse(page)
  }
  if (page_size) {
    params.page_size = JSON.parse(page_size)
  }
  let sms = localStorage.getItem('sms')
  if (sms == 'directory.News') {
    await refresh();
    await store.getStatus()
  }
});


//FUNCTIONS
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getNews(params)
    newsList.value = store.newsList.results;
  } catch (error: any) {
    toast.error(t('error'));
  }
  isLoading.value = false;
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

const saveNews = () => {
  refresh();
}
const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal("#news-show-image").show();
  });
};
const handleDeleteModal = (id: number) => {
  newsId.value = id;
  UIkit.modal("#news-delete-modal").show();
};
const deleteNews = async () => {
  isLoading.value = true
  try {
    await store.deleteNews(newsId.value)
    await UIkit.modal("#news-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if (store.newsList.count > 1 && ((store.newsList.count - 1) % params.page_size == 0)) {
      params.page = params.page - 1
      await refresh()
    } else {
      await refresh()
    }
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};

watchDebounced(
    () => params.search,
    () => {
      params.page = 1
      localStorage.setItem('page', '1')
      refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);
watchDebounced(
    () => params.status,
    () => {
      params.page = 1
      refresh()
    }, {deep: true, debounce: 500, maxWait: 5000}
);

watchDebounced(
    () => params.start_time,
    () => {
      params.page = 1
      refresh();
    }, {deep: true, debounce: 500, maxWait: 5000}
);
watch(() => props.sms, async function (val) {
  toRefresh.value = !toRefresh.value
  if (val == 'directory.News') {
    params.page = props.params.page
    params.page_size = props.params.page_size
    await refresh();
    await store.getStatus()
  }

})

</script>

<template>
  <div>


    <div class="md:flex items-end justify-between mb-7">
      <form class=" md:flex items-center gap-5 md:w-9/12">
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

        <div class="md:w-1/3 ">
          <label for="role" class="dark:text-gray-300">
            {{ $t("Status") }}
          </label>
          <v-select
              :options="store.statusList && store.statusList.results"
              v-model="params.status"
              :getOptionLabel="(name:any) => name['title_'+$i18n.locale]"
              :reduce="(name:any) => name.id"
          >
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
        </div>

        <div class="md:w-1/3 ">
          <label for="from" class="dark:text-gray-300">
            {{ $t("startDate") }}
          </label>
          <VueDatePicker :enableTimePicker="false" auto-apply v-model="params.start_time" model-type="yyyy-MM-dd"
          ></VueDatePicker>
        </div>

      </form>
      <button
          class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
          @click="router.push('/add-news')"
      >
        {{ $t("Add") }}
      </button>
    </div>

    <EasyDataTable theme-color="#7367f0" hide-footer :loading="isLoading" :headers="newsFields" :items="newsList">

      <template #empty-message>
        <div>{{ $t('no_available_data') }}</div>
      </template>
      <template #header="header">
        {{ $t(header.text) }}
      </template>

      <template #item-title="item">
        {{ item['title_' + $i18n.locale] }}
      </template>

      <template #item-status="item">
        <span v-if="item.status"
              :class="item.status.unique_name == 'not_sent' ? 'rounded-md bg-danger px-4 pb-0.5 text-white' : item.status.unique_name == 'in_progress' ? 'rounded-md bg-warning px-4 pb-0.5 text-white' : 'rounded-md bg-primary px-4 pb-0.5 text-white'">{{
            item.status['title_' + $i18n.locale]
          }}</span>
      </template>

      <template #item-from_to="item">
        <div>{{ item.start_time }}</div>
      </template>
      <template #item-file="item">
        <div class="py-3 flex justify-left items-center gap-3">
          <img v-if="item.file"
               class="w-[45px] h-[45px] rounded object-cover"
               :src="item.file"
               alt="Rounded avatar"
               @click="onShowFile(item.file)"
          />
          <div
              v-else
              class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
          >
            <Icon
                icon="Camera"
                color="#356c2d"
            />
          </div>
        </div>
      </template>

      <template #header-actions="item">
        <div class="flex justify-end">
          {{ $t(item.text) }}
        </div>
      </template>
      <template #item-actions="item">
        <div class="flex my-2 justify-end">
          <button class="btn-warning btn-action" @click="
                router.push(`/news-detail/${item.id}`)
              ">
            <Icon icon="Pen New Square" color="#fff" size="16"/>
          </button>
          <button class="ml-3 btn-danger btn-action" @click="handleDeleteModal(item.id)">
            <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <TwPagination :restart="toRefresh" class="mt-10 tw-pagination" :current="params.page"
                  :total=" store.newsList.count"
                  :per-page="params.page_size"
                  :text-before-input="$t('go_to_page')" :text-after-input="$t('forward')"
                  @page-changed="changePagination" @per-page-changed="changePageSize"/>


    <AddEditModal :editData="editData" @saveNews="saveNews"/>
    <DeleteModal @delete-action="deleteNews" :id="'news-delete-modal'"/>
    <ShowFileModal :image="image" ref="imageCard" id="news-show-image"/>
  </div>
</template>