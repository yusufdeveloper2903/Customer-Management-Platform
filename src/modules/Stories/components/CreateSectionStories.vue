<script lang="ts" setup>


//IMPORTED FILES
import {ref, watch} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";

import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import sectionStoriesModal from "../store";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import {EditData} from "../interfaces";
import {useRoute} from 'vue-router'


//DECLARED VARIABLES
const {t} = useI18n();
const route = useRoute()
const isSubmitted = ref<boolean>(false);
const store = sectionStoriesModal();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: EditData | null }>();
let sectionStories = ref<EditData>({
  story_id: null,
  duration: '',
  button_name: '',
  button_name_uz: '',
  button_name_kr: '',
  button_name_ru: '',
  button_type: null,
  button_url: '',
  is_button: false,
  is_active: true,
  object_id: null,
  story: null,
  content_type: null,
  background: '',
  background_uz: '',
  background_kr: '',
  background_ru: '',
});


//FUNCTIONS
function openModal() {
  if (propData.editData && propData.editData.story_id) {
    if (propData.editData?.button_name) {
      sectionStories.value.button_name = propData.editData?.button_name

    }
    if (propData.editData?.button_name_uz) {
      sectionStories.value.button_name_uz = propData.editData?.button_name_uz

    }
    if (propData.editData?.button_name_kr) {
      sectionStories.value.button_name_kr = propData.editData?.button_name_kr

    }
    if (propData.editData?.button_name_ru) {
      sectionStories.value.button_name_ru = propData.editData?.button_name_ru

    }
    if (propData.editData.button_type) {
      sectionStories.value.button_type = propData.editData.button_type

    }
    if (propData.editData?.button_url) {
      sectionStories.value.button_url = propData.editData?.button_url

    }
    if (propData.editData?.object_id) {
      sectionStories.value.object_id = propData.editData?.object_id

    }
    sectionStories.value.duration = propData.editData.duration
    sectionStories.value.is_button = propData.editData.is_button
    sectionStories.value.is_active = propData.editData.is_active
    sectionStories.value.story = propData.editData.story_id
    sectionStories.value.content_type = propData.editData.content_type
    sectionStories.value.background = propData.editData.background
    sectionStories.value.background_uz = propData.editData.background_uz
    sectionStories.value.background_kr = propData.editData.background_kr
    sectionStories.value.background_ru = propData.editData.background_ru
  }
}

const hideModal = () => {
  sectionStories.value.button_name = ''
  sectionStories.value.button_name_uz = ''
  sectionStories.value.button_name_kr = ''
  sectionStories.value.button_name_ru = ''
  sectionStories.value.button_type = null
  sectionStories.value.button_url = ''
  sectionStories.value.duration = ''
  sectionStories.value.is_button = false
  sectionStories.value.is_active = true
  sectionStories.value.object_id = null
  sectionStories.value.story = null
  sectionStories.value.content_type = null
  sectionStories.value.background = ''
  sectionStories.value.background_uz = ''
  sectionStories.value.background_kr = ''
  sectionStories.value.background_ru = ''

}
watch(() => sectionStories.value.button_type, function (val: any) {
  if (val?.url) {
    store.getConentButtontype(val.url)
    sectionStories.value.content_type = val.content_type_id
  }
})

const saveEdit = async () => {
  if (!route.params.id ) return;
  sectionStories.value.button_type = sectionStories.value.button_type?.value
  sectionStories.value.background = sectionStories.value.background_uz
  sectionStories.value.story = String(route.params.id)
  sectionStories.value.story_id = String(route.params.id)

  if (propData.editData && propData.editData.story_id) {
    try {
      const fd = objectToFormData(['background', 'background_uz', 'background_kr', 'background_ru'], sectionStories.value);
      await store.updateSectionStories(fd)
      await UIkit.modal("#stories_section_modal").hide();
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
      emit("refresh");
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(t("error"));
      }
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
      if (error) {
        toast.error(t('error'));
      }
    }
  }
};


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
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData && propData.editData.story_id ? $t("Edit") : $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">


        <label for="from" class="dark:text-gray-300">
          {{ $t("Duration") }}
        </label>
        <input
            type="text"
            class="form-input mb-3"
            :placeholder="$t('Duration')"
            v-model="sectionStories.duration"
        />
        <div class="mt-4">
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
        <Tabs class="mt-1">
          <Tab title="UZ">
            <form v-if="sectionStories.is_button">
              <label for="nameUz">{{ $t('name') + ' ' + $t('UZ') }} </label>
              <input
                  id="nameUz"
                  type="text"
                  class="form-input mb-3"
                  :placeholder="$t('name')"
                  v-model="sectionStories.button_name_uz"
              />

            </form>

            <label>{{ $t('photo') }}</label>
            <FileInput
                v-model="sectionStories.background_uz"
                @remove="sectionStories.background_uz = null"
                :typeModal="propData.editData && propData.editData.story_id"
                name="stories-detail-template"
            />

          </Tab>
          <Tab title="KR">
            <form v-if="sectionStories.is_button">
              <label for="nameUz">{{ $t('name') + ' ' + $t('KR') }} </label>

              <input
                  id="nameUz"
                  type="text"
                  class="form-input mb-3"
                  :placeholder="$t('name')"
                  v-model="sectionStories.button_name_kr"
              />

            </form>
            <label>{{ $t('photo') }}</label>
            <FileInput
                v-model="sectionStories.background_kr"
                @remove="sectionStories.background_kr = null"
                :typeModal="propData.editData && propData.editData.story_id"
                name="stories-detail-template"
            />


          </Tab>

          <Tab title="Ru">
            <form v-if="sectionStories.is_button">
              <label for="nameRu">{{ $t('name') + ' ' + $t('RU') }}</label>

              <input
                  id="nameRu"
                  type="text"
                  class="form-input mb-3"
                  :placeholder="$t('name')"
                  v-model="sectionStories.button_name_ru"

              />

            </form>
            <label>{{ $t('photo') }} </label>
            <FileInput
                v-model="sectionStories.background_ru"
                @remove="sectionStories.background_ru = null"
                :typeModal="propData.editData && propData.editData.story_id"
                name="stories-detail-template"
            />


          </Tab>
        </Tabs>
        <div class="flex gap-4" v-if="sectionStories.is_button">

          <div
              class="select w-2/4"

          >
            <p class=" mt-5 ">{{ $t("Button Type") }}</p>
            <v-select
                class="style-chooser"
                :options="store.storySectionButtonType.data"
                v-model="sectionStories.button_type"
                :getOptionLabel="(name:any) => name.title && name.title[$i18n.locale]"
                :reduce="(name:any) => name"
                :clearable="false"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
          <div v-if="sectionStories.button_type?.value == 'URL'" class=" w-2/4">
            <p class="mt-5"> {{ $t('URL') }}</p>
            <input
                type="text"
                style="padding-top:12px;padding-bottom:12px"
                class="form-input  "
                :placeholder="$t('URL')"
                v-model="sectionStories.button_url"
            />
          </div>
          <div v-else-if="sectionStories.button_type?.value !== 'URL' && sectionStories.button_type?.value"
               class="select-chooser w-2/4"
          >
            <p class="mt-5">{{ $t(`${sectionStories.button_type?.value}`) }}</p>

            <v-select
                :options="store.contentButtonTypeList.results"
                v-model="sectionStories.object_id"
                :getOptionLabel="(name:any) => name.value"
                :reduce="(name:any) => name.object_id"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>

          </div>
          <div v-else
               class="select-chooser w-2/4 mt-11"
          >
            <v-select
                disabled="true"
            >
            </v-select>

          </div>
        </div>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #stories_section_modal" class="btn-secondary">
          {{ $t("Отмена") }}
        </button>

        <button
            :class="propData.editData && propData.editData.story_id ? 'btn-warning mr-2' : 'btn-success mr-2'"
            @click="saveEdit"
        >
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{
              propData.editData && propData.editData.story_id ? $t("Edit") : $t("Add")
            }}</span>
        </button>
      </div>
    </div>
  </div>

</template>

<style lang="scss">

.style-chooser .vs__dropdown-menu {
  position: fixed;
  z-index: 9999; /* Set a high z-index value */
  left: 30px;
  top: 220px;
  width: 44%;
  height: 40%;
  overflow: auto;
  background-color: white;

}

.select-chooser .vs__dropdown-menu {
  position: fixed;
  z-index: 9999;
  left: 305px;
  top: 220px;
  width: 44%;
  height: 40%;
  overflow: auto;
  background-color: white;

}
</style>

