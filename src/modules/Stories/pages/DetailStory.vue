<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed, reactive, onMounted, watch} from "vue";
import {helpers, required} from "@vuelidate/validators";
import {useVuelidate, Validation} from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import FileInput from "@/components/FileInput/FileInput.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import {useRoute, useRouter} from "vue-router";
import {storiesDetailTable} from '../constants'
import {toast} from "vue3-toastify";
import {useI18n} from 'vue-i18n';
import UIKit from "uikit";
import ShowTextModal from "@/components/ShowTextModal.vue";
import {useSidebarStore} from '@/stores/layoutConfig'
import DetailStorySwipper from "@/modules/Stories/pages/DetailStorySwipper.vue";
import StoriesDetail from '../store'
import DetailsModal from '../components/CreateSectionStories.vue';
import {watchDebounced} from "@vueuse/core";
import {EditData} from "../interfaces";
import {objectToFormData} from "@/mixins/formmatter";


//DECLARED VARIABLES

const general = useSidebarStore()
const store = StoriesDetail()
const itemToDelete = ref<number | null>(null);
const imageUrl = ref('')
const {t, locale} = useI18n()
const isLoading = ref(false);
const route = useRoute()
const router = useRouter()
const routeParams = ref('')
const isSubmitted = ref<boolean>(false);
const url = ref('')
const dateConfig = ref({})
let storiesVariable = ref<any>({
  id: '',
  subtitle: '',
  subtitle_uz: '',
  subtitle_kr: '',
  subtitle_ru: '',
  start_date: '',
  end_date: '',
  avatar: '',
  status: 'DRAFT',
});
const createdData = ref<string | null>('')
const buttonType = ref({})
const editData = ref<EditData | null>({
  story_section_id: null,
  duration: null,
  button_name: '',
  button_name_uz: '',
  button_name_kr: '',
  button_name_ru: '',
  button_type: '',
  button_url: '',
  is_button: false,
  status: '',
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
const Status = reactive([
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Draft',
    value: 'DRAFT'
  },
  {
    title: 'Finished',
    value: 'FINISHED'
  }
])

//MOUNTED LIEF CYCLE
onMounted(async () => {
  store.storiesDetailsList.results = []
  await getButtonType()
  if (route.params.id) {
    await refresh()
    await getDetail()
    storiesVariable.value = store.storiesDetailsId.data
    dateConfig.value = [storiesVariable.value.start_date, storiesVariable.value.end_date]
    routeParams.value = String(route.params.id)
  } else {
    createdData.value = localStorage.getItem('createdData')
    routeParams.value = ''
  }
})


//FUNCTION
const saveData = async (val: string) => {
  if (!storiesVariable.value.subtitle_uz) {
    general.tabs = 'UZ'
  } else if (!storiesVariable.value.subtitle_kr) {
    general.tabs = 'KR'
  } else if (!storiesVariable.value.subtitle_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  storiesVariable.value.subtitle = storiesVariable.value.subtitle_uz
  if (route.params.id) {
    storiesVariable.value.id = String(route.params.id)
    try {
      const fd = objectToFormData(['avatar'], storiesVariable.value);
      await store.updateStories(fd)
      isSubmitted.value = false;
      if (val == 'detail') {
        await router.push('/stories')
      }
      toast.success(t("updated_successfully"));
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  } else {
    try {
      const fd = objectToFormData(['avatar'], storiesVariable.value);
      await store.createStories(fd).then((res) => {
        router.push(`/stories-detail/${res.data.data.id}`)
        localStorage.setItem('createdData', res.data.status_code)
        createdData.value = res.data.status_code
      });
      isSubmitted.value = false;

      if (val == 'detail') {
        await router.push('/stories')
        toast.success(t("created_successfully"));
      }
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'));
    }
  }
};


const handleDeleteModal = (id: number) => {
  itemToDelete.value = id
  UIKit.modal("#stories-detail-main-delete-modal").show()
};


// const onShowFileLink = (item: any) => {
//   url.value = item;
//   nextTick(() => {
//     UIKit.modal("#stories-detail-url-image").show();
//   });
// };

const getButtonType = async () => {
  isLoading.value = true;
  try {
    await store.getStoriesSectionButtonType();
    isLoading.value = false;
  } catch (error: any) {
    toast.error(
        t('error')
    );
  }

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
const TooltipMaker = (val: any) => {
  if (val.button_type === 'URL') {
    return val.button_url
  } else {
    return val.button_type + '/' + val.poll_name
  }
}
const addSection = async () => {
  if (!storiesVariable.value.subtitle_uz) {
    general.tabs = 'UZ'
  } else if (!storiesVariable.value.subtitle_kr) {
    general.tabs = 'KR'
  } else if (!storiesVariable.value.subtitle_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  editData.value = null
  if (route.params.id) {
    await UIKit.modal("#stories_section_modal").show();
  } else if (createdData.value && createdData.value == '201') {
    await UIKit.modal("#stories_section_modal").show();
  } else {

    await saveData('modal')
    await UIKit.modal("#stories_section_modal").show();
  }


}

const deleteAction = async () => {
  isLoading.value = true
  try {
    await store.deleteStoriesSection(itemToDelete.value)
    await UIKit.modal("#stories-detail-main-delete-modal").hide();
    await refresh()
    toast.success(t('deleted_successfully'));
    isLoading.value = false
  } catch (error: any) {
    toast.error(t('error'));
  }
};

const showRow = (val: any) => {
  buttonType.value = val
  imageUrl.value = val['background_' + locale.value].full_size
}


//WATCHERS
watchDebounced(() => params.search, function () {
  params.page = 1
  localStorage.setItem('page', '1')

  refresh()
}, {deep: true, debounce: 500, maxWait: 5000,})

watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]

        storiesVariable.value.start_date = started_date.toLocaleString('it-IT')
        storiesVariable.value.end_date = end_date.toLocaleString('it-IT')

      } else {
        storiesVariable.value.start_date = ""
        storiesVariable.value.end_date = ""
      }

    }
)
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
    start_date: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    avatar: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },


  };
});
const validate: Ref<Validation> = useVuelidate(rules, storiesVariable);
</script>

<template>
  <div>

    <div class="flex gap-2 items-start">

      <div class="card w-1/4">
        <h3 class="text-success dark:text-success mb-3">{{ $t('Main') }}</h3>
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz"
              >{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
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
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label for="nameUz"
              >{{ $t('name') + ' ' + $t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
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
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu"
              >{{ $t('name') + ' ' + $t('RU') }}
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
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
          </ModalTab>
        </ModalTabs>
        <div class="mt-4">
          <label for="from" class="dark:text-gray-300">
            {{ $t("date_from") + ' - ' + $t("date_to") }}
          </label>
          <VueDatePicker format="dd-MM-yyyy" :enableTimePicker="false" auto-apply :range="{ partialRange: false }"
                         v-model="dateConfig"/>
          <p
              v-for="error in validate.start_date.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </div>
        <p class=" mt-4 ">{{ $t("Published") }}</p>

        <v-select
            :options="Status"
            :getOptionLabel="(role:any) => $t(`${role.title}`)"
            :reduce="(role:any) => role.value"
            v-model="storiesVariable.status"

        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>
        <div class="mt-2">
          <label> {{ $t('photo') }}</label>
          <FileInput
              v-model="storiesVariable.avatar"
              @remove="storiesVariable.avatar = null"
              :typeModal="routeParams"
              name="stories-modal-input"/>
          <p
              v-for="error in validate.avatar.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>

        </div>


      </div>
      <div class="card w-2/4">
        <h3 class="text-success dark:text-success mb-3">{{ $t('addPhoto') }}</h3>
        <div class="flex justify-between items-end mb-7">
          <label/>
          <button class="rounded-md bg-success px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full"
                  @click="addSection">
            {{ $t("Add") }}
          </button>
        </div>
        <EasyDataTable
            theme-color="#7367f0"
            hide-footer
            :loading="isLoading"
            :headers="storiesDetailTable"
            :items="store.storiesDetailsList.results"
            @click-row="showRow"
        >
          <template #empty-message>
            <div class="dark:text-white">{{ $t("no_available_data") }}</div>
          </template>

          <template #header="header">
            {{ $t(header.text) }}
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
          <template #item-button_url="item">

            <!--            @click="onShowFileLink(item)"-->

            <button
                type="button"
                class="tooltip btn-success btn-action"
                :disabled="!item.is_button"
            >
              <span class="tooltiptext" v-if="item.is_button">{{ TooltipMaker(item) }}</span>
              <Icon
                  icon="Link"
                  color="#FFF"
                  size="16"
              />
            </button>
          </template>
          <template #item-button_name="item">
            {{ item['button_name_' + $i18n.locale] }}
          </template>
          <template #item-background="item">

            <div class="py-3 flex justify-left gap-3">
              <div v-if="item['background_'+ locale]">
                <img
                    class="w-[90px] h-[90px] rounded "
                    :src="item['background_'+ locale].full_size"
                    alt="Rounded avatar"

                    style="aspect-ratio: 1/1"
                />
              </div>
              <div
                  v-else
                  class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
              >
                <Icon icon="Camera" color="#356c2d"/>
              </div>
            </div>
          </template>
          <template #header-actions="item">
            <div class="flex justify-end">
              {{ $t(item.text) }}
            </div>
          </template>
          <template #item-actions="data">
            <div class="flex my-4 justify-end" @click.stop>
              <button class="btn-warning btn-action" uk-toggle="target: #stories_section_modal"
                      @click="editData=data">
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


      </div>

      <div class=" w-1/4 ">
        <div class="card">
          <h3 class="text-success dark:text-success mb-3">{{ $t('previewPhoto') }}</h3>


          <div v-if="store.storiesDetailsList && store.storiesDetailsList.results.length">
            <DetailStorySwipper :data="store.storiesDetailsList.results"></DetailStorySwipper>
          </div>
          <div v-else>
            <div style="position:relative"
                 class=" font-medium dark:text-whitemb-5 flex h-[450px] w-[240px] mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
              {{ $t("no_photo") }}
            </div>
          </div>


        </div>
        <div
            class="mt-4 flex gap-4 justify-end"
        >
          <button class="btn-secondary" @click="router.push('/stories')">
            {{ $t("Cancel") }}
          </button>

          <button @click="saveData('detail')"
                  :class="$route.params.id ? 'bg-warning':'bg-success'"
                  class="rounded-md px-6 py-2 text-white duration-100 hover:opacity-90 md:w-auto w-full">
            {{ $route.params.id ? $t('Edit') : $t('Add') }}
          </button>
        </div>
      </div>
    </div>
    <DetailsModal :editData="editData" @refresh="refresh"/>
    <DeleteModal @delete-action="deleteAction" id="stories-detail-main-delete-modal"/>
    <ShowTextModal :url="url" id="stories-detail-url-image"/>
  </div>

</template>

<style scoped>


.tooltip {
  position: relative;
  display: inline-block;
  z-index: 99 !important;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {

  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  opacity: 0;
  transition: opacity 0.3s;

}


.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
