<script lang="ts" setup>


//IMPORTED FILES
import {ref, watch} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";

import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import sectionStoriesModal from "../store";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import {EditData} from "../interfaces";
import {useRoute} from 'vue-router'
import {useSidebarStore} from '@/stores/layoutConfig'


//DECLARED VARIABLES
const emptyData = ref(false)
const general = useSidebarStore()
const {t} = useI18n();
const route = useRoute()
const isSubmitted = ref<boolean>(false);
const store = sectionStoriesModal();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: EditData | null }>();
const validated = ref(false)
let sectionStories = ref<EditData>({
  story_section_id: null,
  duration: '',
  button_name: '',
  button_name_uz: '',
  button_name_kr: '',
  button_name_ru: '',
  button_type: '',
  button_url: '',
  is_button: false,
  object_id: null,
  story: null,
  content_type: null,
  background: '',
  background_uz: '',
  background_kr: '',
  background_ru: '',
  status: ''
});
const title = ref('')

//FUNCTIONS
function openModal() {
  emptyData.value = true
  if (propData.editData && propData.editData.story_section_id) {
    sectionStories.value.button_name = propData.editData?.button_name
    sectionStories.value.button_name_uz = propData.editData?.button_name_uz
    sectionStories.value.button_name_kr = propData.editData?.button_name_kr
    sectionStories.value.button_name_ru = propData.editData?.button_name_ru
    sectionStories.value.button_type = propData.editData.button_type
    sectionStories.value.button_url = propData.editData?.button_url
    sectionStories.value.object_id = propData.editData.object_id
    sectionStories.value.duration = propData.editData.duration
    sectionStories.value.is_button = propData.editData.is_button
    sectionStories.value.story = propData.editData.story
    sectionStories.value.story_section_id = propData.editData.story_section_id
    sectionStories.value.content_type = propData.editData.content_type
    sectionStories.value.background = propData.editData.background?.full_size
    sectionStories.value.background_uz = propData.editData.background_uz?.full_size
    sectionStories.value.background_kr = propData.editData.background_kr?.full_size
    sectionStories.value.background_ru = propData.editData.background_ru?.full_size
    store.storySectionButtonType.data.forEach((item: any) => {
      if (item.value == sectionStories.value.button_type) {
        item.first = 'first'
        sectionStories.value.button_type = item
      }
    })

  }
}

const hideModal = () => {
  emptyData.value = false
  general.tabs = 'UZ'
  validated.value = false
  sectionStories.value.button_name = ''
  sectionStories.value.button_name_uz = ''
  sectionStories.value.button_name_kr = ''
  sectionStories.value.button_name_ru = ''
  sectionStories.value.button_type = {
    "content_type_id": 30,
    "url": "/knowledge_base/content_type_model_data/poll/",
    "value": "POLL",
    "title": {"uz": "So`rov", "kr": "Сўров", "ru": "Голосование"}
  }
  sectionStories.value.button_url = ''
  sectionStories.value.duration = ''
  sectionStories.value.is_button = false
  sectionStories.value.object_id = null
  sectionStories.value.story = null
  sectionStories.value.content_type = null
  sectionStories.value.background = ''
  sectionStories.value.background_uz = ''
  sectionStories.value.background_kr = ''
  sectionStories.value.background_ru = ''
  sectionStories.value.story_section_id = null
}

store.getConentButtontype('/knowledge_base/content_type_model_data/poll/')
watch(() => sectionStories.value.button_type, function (val: any) {
  console.log(val, 'val')
  if (val?.url) {
    store.getConentButtontype(val.url)
    sectionStories.value.content_type = val.content_type_id
  }
  if (val?.url && !val.first) {
    sectionStories.value.object_id = null
  }

})
watch(() => sectionStories.value.is_button, function (val: boolean) {
  if (!val) {
    sectionStories.value.object_id = null
    sectionStories.value.button_type = null
    sectionStories.value.button_name = ''
    sectionStories.value.button_name_uz = ''
    sectionStories.value.button_name_kr = ''
    sectionStories.value.button_name_ru = ''
    sectionStories.value.button_url = ''

  }
})

const saveEdit = async () => {
      if (!sectionStories.value.background_uz || !sectionStories.value.button_name_uz) {
        general.tabs = 'UZ'
      } else if (!sectionStories.value.background_kr || !sectionStories.value.button_name_kr) {
        general.tabs = 'KR'
      } else if (!sectionStories.value.background_ru || !sectionStories.value.button_name_ru) {
        general.tabs = 'RU'
      }
      validated.value = true
      if (!route.params.id) return;
      sectionStories.value.background = sectionStories.value.background_uz
      sectionStories.value.button_name = sectionStories.value.button_name_uz
      sectionStories.value.story = String(route.params.id)
      if (!sectionStories.value.is_button) {
        sectionStories.value.object_id = null
        sectionStories.value.button_name = ''
        sectionStories.value.button_name_uz = ''
        sectionStories.value.button_name_kr = ''
        sectionStories.value.button_name_ru = ''
        sectionStories.value.button_url = ''
        sectionStories.value.button_type = ''
      }
      if (sectionStories.value.background_uz && sectionStories.value.background_kr && sectionStories.value.background_ru && sectionStories.value.is_button && sectionStories.value.button_name_uz && sectionStories.value.button_name_kr && sectionStories.value.button_name_ru && sectionStories.value.button_type && (sectionStories.value.object_id || sectionStories.value.button_url)) {
        if (sectionStories.value.is_button) {
          sectionStories.value.button_type = sectionStories.value.button_type?.value
        }
        if (propData.editData && propData.editData.story_section_id) {
          try {
            const fd = objectToFormData(['background', 'background_uz', 'background_kr', 'background_ru'], sectionStories.value);
            await store.updateSectionStories(fd)
            await UIkit.modal("#stories_section_modal").hide();
            toast.success(t("updated_successfully"));
            isSubmitted.value = false;
            emit("refresh");
          } catch (error: any) {
            isSubmitted.value = false;
            toast.error(t("error"));
          }
        } else {
          try {
            const fd = objectToFormData(['background', 'background_uz', 'background_kr', 'background_ru'], sectionStories.value);
            await store.createSectionStories(fd)
            await UIkit.modal("#stories_section_modal").hide();
            toast.success(t("created_successfully"));
            emit("refresh");
            isSubmitted.value = false;
          } catch (error: any) {
            isSubmitted.value = false;
            toast.error(t('error'));
          }
        }
      }
      if (sectionStories.value.background_uz && sectionStories.value.background_kr && sectionStories.value.background_ru && !sectionStories.value.is_button) {
        if (sectionStories.value.is_button) {
          sectionStories.value.button_type = sectionStories.value.button_type?.value
        }
        if (propData.editData && propData.editData.story_section_id) {
          try {
            const fd = objectToFormData(['background', 'background_uz', 'background_kr', 'background_ru'], sectionStories.value);
            await store.updateSectionStories(fd)
            await UIkit.modal("#stories_section_modal").hide();
            toast.success(t("updated_successfully"));
            isSubmitted.value = false;
            emit("refresh");
          } catch (error: any) {
            isSubmitted.value = false;
            toast.error(t("error"));
          }
        } else {
          try {
            const fd = objectToFormData(['background', 'background_uz', 'background_kr', 'background_ru'], sectionStories.value);
            await store.createSectionStories(fd)
            await UIkit.modal("#stories_section_modal").hide();
            toast.success(t("created_successfully"));
            emit("refresh");
            isSubmitted.value = false;
          } catch (error: any) {
            isSubmitted.value = false;
            toast.error(t('error'));
          }


        }
      }
    }
;


</script>

<template>
  <div
      id="stories_section_modal"
      class="uk-flex-top"
      uk-modal
      @shown="openModal"
      @hidden="hideModal"
  >
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg "
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData && propData.editData.story_section_id ? $t("EditStory") : $t("AddStory") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <div class="flex ">
          <label for="from" class="dark:text-gray-300 md:w-2/4">
            {{ $t("Duration") + ' ' + `(${$t('sec')})` }}
            <input
                type="number"
                class="form-input mb-3"
                v-model="sectionStories.duration"
                :class="!sectionStories.duration && validated ? 'required-input' : ''"
            />
            <p
                v-if="!sectionStories.duration && validated"
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
          </label>

          <div class="mt-2" style="margin-left:130px">
            <p class="mb-1">{{ $t("Add Button") }}</p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                  type="checkbox"
                  v-model="sectionStories.is_button"
                  class="sr-only peer"
              />
              <div
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>

        <ModalTabs class="mt-1" :title="title">
          <ModalTab title="UZ">


            <label>{{ $t('photo') + ' ' + $t("UZ") }}</label>
            <FileInput
                :empty="emptyData"
                class="mb-3"
                v-model="sectionStories.background_uz"
                @remove="sectionStories.background_uz = null"
                :typeModal="propData.editData && propData.editData.story_section_id"
                name="stories-template-section"
            />
            <p
                v-if="!sectionStories.background_uz && validated"
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
            <form v-if="sectionStories.is_button" class="mt-3">
              <label for="nameUz">{{ $t('nameButton') + ' ' + $t('UZ') }} </label>
              <input
                  id="nameUz"
                  type="text"
                  class="form-input "
                  v-model="sectionStories.button_name_uz"
              />
              <p
                  v-if="!sectionStories.button_name_uz && validated && sectionStories.is_button"
                  class="text-danger text-sm"
              >
                {{ $t('validation.this_field_is_required') }}
              </p>
            </form>
          </ModalTab>
          <ModalTab title="KR">

            <label>{{ $t('photo') + ' ' + $t("KR") }}</label>
            <FileInput
                class="mb-3"
                :empty="emptyData"
                v-model="sectionStories.background_kr"
                @remove="sectionStories.background_kr = null"
                :typeModal="propData.editData && propData.editData.story_section_id"
                name="stories-template-section"
            />
            <p
                v-if="!sectionStories.background_kr && validated"
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
            <form v-if="sectionStories.is_button" class="mt-3">
              <label for="nameUz">{{ $t('nameButton') + ' ' + $t('KR') }} </label>

              <input
                  id="nameUz"
                  type="text"
                  class="form-input "
                  v-model="sectionStories.button_name_kr"
              />
              <p
                  v-if="!sectionStories.button_name_kr && validated && sectionStories.is_button"
                  class="text-danger text-sm"
              >
                {{ $t('validation.this_field_is_required') }}
              </p>
            </form>

          </ModalTab>

          <ModalTab title="RU">

            <label>{{ $t('photo') + ' ' + $t("RU") }}</label>
            <FileInput
                :empty="emptyData"
                class="mb-3"
                v-model="sectionStories.background_ru"
                @remove="sectionStories.background_ru = null"
                :typeModal="propData.editData && propData.editData.story_section_id"
                name="stories-template-section"
            />
            <p
                v-if="!sectionStories.background_ru && validated"
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
            <form v-if="sectionStories.is_button" class="mt-3">
              <label for="nameRu">{{ $t('nameButton') + ' ' + $t('RU') }}</label>

              <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  v-model="sectionStories.button_name_ru"

              />
              <p
                  v-if="!sectionStories.button_name_ru && validated && sectionStories.is_button"
                  class="text-danger text-sm"
              >
                {{ $t('validation.this_field_is_required') }}
              </p>
            </form>


          </ModalTab>
        </ModalTabs>
        <div v-if="sectionStories.is_button">

          <div

          >
            <p class=" mt-3 ">{{ $t("Button Type") }}</p>
            <v-select
                :options="store.storySectionButtonType.data"
                v-model="sectionStories.button_type"
                :getOptionLabel="(name:any) => name.title && name.title[$i18n.locale]"
                :reduce="(name:any) => name"
                :clearable="false"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
            <p
                v-if="!sectionStories.button_type && validated && sectionStories.is_button"
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
          </div>
          <div v-if="sectionStories.button_type?.value == 'URL'">
            <p class="mt-3"> {{ $t('URL') }}</p>
            <input
                type="text"
                style="padding-top:12px;padding-bottom:12px"
                class="form-input  "
                v-model="sectionStories.button_url"
            />
            <p
                v-if="!sectionStories.button_url && validated && sectionStories.is_button && sectionStories.button_type?.value == 'URL' "
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
          </div>
          <div v-else-if="sectionStories.button_type?.value !== 'URL' && sectionStories.button_type?.value"

          >
            <p class="mt-3">{{ $t(`${sectionStories.button_type?.value}`) }}</p>
            <v-select
                :options="store.contentButtonTypeList.results"
                v-model="sectionStories.object_id"
                :getOptionLabel="(name:any) => name.value"
                :reduce="(name:any) => name.object_id"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
            <p
                v-if="!sectionStories.object_id && validated && sectionStories.is_button  && sectionStories.button_type?.value !== 'URL' && sectionStories.button_type?.value "
                class="text-danger text-sm"
            >
              {{ $t('validation.this_field_is_required') }}
            </p>
          </div>

        </div>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #stories_section_modal" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button
            :class="propData.editData && propData.editData.story_section_id ? 'btn-warning mr-2' : 'btn-success mr-2'"
            @click="saveEdit"
        >
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{
              propData.editData && propData.editData.story_section_id ? $t("Edit") : $t("Add")
            }}</span>
        </button>
      </div>
    </div>
  </div>

</template>

