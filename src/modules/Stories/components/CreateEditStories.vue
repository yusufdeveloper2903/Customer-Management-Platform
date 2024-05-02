<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed, reactive, nextTick, onMounted} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {storiesHeaders} from "../interfaces";
import FileInput from "@/components/FileInput/FileInput.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import {useRoute, useRouter} from "vue-router";
import {storiesDetailTable} from '../constants'
import {toast} from "vue3-toastify";
import {useI18n} from 'vue-i18n';
import UIKit from "uikit";
import ShowPhotoGlobal from "@/components/ShowPhotoGlobal.vue";
import StoriesDetail from '../store/index'
import CreateSectionStories from './CreateSectionStories.vue';
import {watchDebounced} from "@vueuse/core";
import {EditData} from "../interfaces/index";
import {objectToFormData} from "@/mixins/formmatter";


//DECLARED VARIABLES
const store = StoriesDetail()
const itemToDelete = ref<number | null>(null);
const image = ref<string>("");
const imageCard = ref();
const imageUrl = ref('')
const {t} = useI18n()
const isLoading = ref(false);
const route = useRoute()
const router = useRouter()
const routeParams = ref('')
const isSubmitted = ref<boolean>(false);
let storiesVariable = ref<storiesHeaders>({
  id: null,
  subtitle: '',
  subtitle_uz: '',
  subtitle_kr: '',
  subtitle_ru: '',
  start_date: '',
  end_date: '',
  avatar: '',
  is_active: false,
});
const editData = ref<EditData>({
  duration: null,
  button_name: '',
  button_name_uz: '',
  button_name_kr: '',
  button_name_ru: '',
  button_type: '',
  button_url: '',
  is_button: false,
  is_active: false,
  object_id: null,
  story: null,
  content_type: null,
  background: '',
  background_uz: '',
  background_kr: '',
  background_ru: '',
})

const params = reactive({
  page: 1,
  page_size: 10,
  search: null
})


//MOUNTED LIEF CYCLE
onMounted(async () => {
  if (route.params.id) {
    await refresh()
    await getDetail()
    storiesVariable.value = store.storiesDetailsId.data
    routeParams.value = String(route.params.id)
  } else {
    routeParams.value = ''
  }
})


//FUNCTION
const saveData = async () => {
  // const success = await validate.value.$validate();
  // if (!success) return;
  if (route.params.id) {
    storiesVariable.value.id = String(route.params.id)
    try {
      const fd = objectToFormData('avatar', storiesVariable.value);
      await store.updateStories(fd)
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(t("error"));
      }
    }
  } else {
    try {
      const fd = objectToFormData('avatar', storiesVariable.value);
      await store.createStories(fd)
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(t('error'));
      }
    }
  }
};
const changePagination = (page: number) => {
  params.page = page;
  refresh();
};
const onPageSizeChanged = (e: number) => {
  params.page_size = e
  params.page = 1
  refresh()
}
const handleDeleteModal = (id: number) => {
  itemToDelete.value = id
  UIKit.modal("#stories-detail-main-delete-modal").show()
};

const onShowFile = (item: any) => {
  image.value = item;
  nextTick(() => {
    UIKit.modal("#stories-detail-modal-image").show();
  });
};
const refresh = async () => {
  isLoading.value = true;
  try {
    await store.getStoriesDetailsList(params, route.params.id);
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};
const getDetail = async () => {
  isLoading.value = true;
  try {
    await store.getStoriesDetailId(route.params.id);
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

};
const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteStories(itemToDelete.value)
    await UIKit.modal("#stories-detail-main-delete-modal").hide();
    toast.success(t('deleted_successfully'));
    if ((store.storiesDetailsList.count - 1) % params.page_size == 0) {
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


//WATCHERS
watchDebounced(() => params.search, function () {
  params.page = 1
  refresh()
}, {deep: true, debounce: 500, maxWait: 500,})


//COMPUTED
const rules = computed(() => {
  return {
    subtitle_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    subtitle_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    subtitle_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },

  };
});

const validate: Ref<Validation> = useVuelidate(rules, storiesVariable);

</script>

<template>
  <div class="flex gap-4">
    <div class="card w-1/4">
      <Tabs class="mb-4">
        <Tab title="UZ">
          <form>
            <label for="nameUz"
            >{{ $t('name') + ' ' + $t('UZ') }}
              <input
                  id="nameUz"
                  type="text"
                  class="form-input"
                  :placeholder="$t('name')"
                  v-model="storiesVariable.subtitle_uz"
                  :class="validate.subtitle_uz.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.subtitle_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
          </form>
        </Tab>
        <Tab title="KR">
          <form>
            <label for="nameUz"
            >{{ $t('name') + ' ' + $t('KR') }}
              <input
                  id="nameUz"
                  type="text"
                  class="form-input"
                  :placeholder="$t('name')"
                  v-model="storiesVariable.subtitle_kr"
                  :class="validate.subtitle_kr.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.subtitle_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>


          </form>
        </Tab>

        <Tab title="RU">
          <form>
            <label for="nameRu"
            >{{ $t('name') + ' ' + $t('RU') }}
              <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  :placeholder="$t('name')"
                  v-model="storiesVariable.subtitle_ru"
                  :class="validate.subtitle_ru.$errors.length ? 'required-input' : ''
                  "
              />
              <p
                  v-for="error in validate.subtitle_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>


          </form>
        </Tab>
      </Tabs>
      <div class="mt-4">
        <label class="dark:text-gray-300">
          {{ $t("startDate") }}
        </label>
        <VueDatePicker :enableTimePicker="false" auto-apply model-type="yyyy-MM-dd hh:mm:ss"
                       :placeholder="$t('startDate')"
                       v-model="storiesVariable.start_date"></VueDatePicker>
      </div>

      <div class="mt-4 ">
        <label class="dark:text-gray-300">
          {{ $t("endDate") }}
        </label>
        <VueDatePicker :teleport="true" :enableTimePicker="false" auto-apply
                       model-type="yyyy-MM-dd hh:mm:ss"
                       :placeholder="$t('endDate')"
                       v-model="storiesVariable.end_date"/>
      </div>
      <p class=" mt-4 ">{{ $t("Publish") }}:</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            v-model="storiesVariable.is_active"
            class="sr-only peer"
        />
        <div
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
        ></div>
      </label>
      <div class="mt-2">
        <label> {{ $t('photo') }}</label>
        <FileInput
            v-model="storiesVariable.avatar"
            @remove="storiesVariable.avatar = null"
            :typeModal="routeParams"
            name="stories-modal-input"/>

      </div>


    </div>
    <div class="card w-2/4">
      <div class="flex justify-between items-end mb-7">
        <label for="search" class="w-1/4">
          {{ $t('Search') }}
          <input
              v-model="params.search"
              type="text"
              class="form-input"
              :placeholder="$t('Search')"
          />
        </label>
        <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
                uk-toggle="target:#stories-section-modal" @click="editData = {}">
          {{ $t("Add") }}
        </button>
      </div>
      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :loading="isLoading"
          :headers="storiesDetailTable"
          :items="store.storiesDetailsList.results"
      >
        <template #header="header">
          {{ $t(header.text) }}
        </template>

        <template #item-subtitle="item">
          {{ item['subtitle_' + $i18n.locale] }}
        </template>
        <template #item-is_active="items">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                v-model="items.is_active"
                class="sr-only peer"
            />
            <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            ></div>
          </label>
        </template>
        <template #item-background="item">
          <div class="py-3 flex justify-left gap-3">
            <img
                v-if="item.background"
                class="w-[45px] h-[45px] rounded object-cover"
                :src="item.background"
                alt="Rounded avatar"
                @click="onShowFile(item.background)"
            />
            <div
                v-else
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="Camera" color="#356c2d"/>
            </div>
          </div>
        </template>
        <template #item-actions="data">
          <div class="flex my-4 justify-left">
            <button class="btn-warning btn-action" uk-toggle="target: #stories-section-modal" @click="editData= data">
              <Icon icon="Pen New Square" color="#fff" size="16"/>
            </button>
            <button
                class="ml-3 btn-danger btn-action"

                @click="handleDeleteModal(data.id)"
            >
              <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
            </button>
          </div>
        </template>
      </EasyDataTable>

      <TwPagination
          :total="store.storiesDetailsList.count"
          class="mt-10 tw-pagination"
          :current="params.page"
          :per-page="params.page_size"
          :text-before-input="$t('go_to_page')"
          :text-after-input="$t('forward')"
          @page-changed="changePagination"
          @per-page-changed="onPageSizeChanged"
      />
    </div>
    <div class="card w-1/4 ">
      <div
          class="mb-5 flex h-[88%] w-[80%] mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
        <span v-if="!imageUrl" class="font-medium dark:text-white">{{ $t("no_photo") }}</span>
        <img
            v-else
            class="w-full h-full object-cover"
            :src="imageUrl"
            alt=""
        />
      </div>
      <div
          class=" flex gap-4 justify-end"
      >
        <button class="btn-secondary" @click="router.push('/stories')">
          {{ $t("Отмена") }}
        </button>

        <button @click="saveData"
                class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full">
          {{ $t('Add') }}
        </button>
      </div>
    </div>
  </div>
  <DeleteModal @delete-action="deleteAction" id="stories-detail-main-delete-modal"/>
  <ShowPhotoGlobal :image="image" id="stories-detail-modal-image" ref="imageCard"/>
  <CreateSectionStories :edit-data="editData" @refresh="refresh"/>
</template>
