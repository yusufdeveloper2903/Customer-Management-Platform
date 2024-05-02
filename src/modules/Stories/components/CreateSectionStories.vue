<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import sectionStoriesModal from "../store/index";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import {EditData} from "../interfaces/index";

//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = sectionStoriesModal();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: any }>();
let sectionStories = ref<EditData>({
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
});
let buttonTypeList = ref([
  {
    title: 'Promotion',
    value: 'PROMOTION'
  },
  {
    title: 'Map',
    value: 'MAPS'
  },
  {
    title: "Poll",
    value: 'POLL'
  },
  {
    title: 'Product',
    value: 'PRODUCT'
  },
  {
    title: 'Recipes',
    value: 'RECIPES'
  },
  {
    title: 'Url',
    value: 'URL'
  },

])


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    sectionStories.value = propData.editData;
  }
}

const hideModal = () => {
  validate.value.$reset()
  sectionStories.value.button_name = ''
  sectionStories.value.button_name_uz = ''
  sectionStories.value.button_name_kr = ''
  sectionStories.value.button_name_ru = ''
  sectionStories.value.button_type = ''
  sectionStories.value.button_url = ''
  sectionStories.value.duration = null
  sectionStories.value.is_button = false
  sectionStories.value.is_active = false
  sectionStories.value.object_id = null
  sectionStories.value.story = null
  sectionStories.value.content_type = null
  sectionStories.value.background = ''
  sectionStories.value.background_uz = ''
  sectionStories.value.background_kr = ''
  sectionStories.value.background_ru = ''

}
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      const fd = objectToFormData('background', sectionStories.value);
      await store.updateSectionStories(fd)
      await UIkit.modal("#stories-section-modal").hide();
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
      const fd = objectToFormData('background', sectionStories.value);
      await store.createSectionStories(fd)
      await UIkit.modal("#stories-section-modal").hide();
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

//COMPUTED
const rules = computed(() => {
  return {
    story: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, sectionStories);

</script>

<template>
  <div
      id="stories-section-modal"
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
          {{ propData.editData.id ? $t("Edit") : $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">


        <label for="from" class="dark:text-gray-300">
          {{ $t("Duration") }}
        </label>
        <VueDatePicker auto-apply time-picker v-model="sectionStories.duration"/>
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
                :typeModal="propData.editData.id"
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
                :typeModal="propData.editData.id"
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
                :typeModal="propData.editData.id"
                name="stories-detail-template"
            />


          </Tab>
        </Tabs>
        <div class="flex gap-4" v-if="sectionStories.is_button">

          <div
              class="select w-1/4"

          >
            <p class=" mt-5 mb-1">{{ $t("Button Type") }}:</p>
            <v-select
                class="style-chooser"
                :options="buttonTypeList"
                v-model="sectionStories.button_type"
                :getOptionLabel="(name) => t(`${name.title}`)"
                :reduce="(name) => name.value"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
          <div
              class="select-chooser w-3/4"
              style="margin-top:44px"
          >
            <v-select
                :options="buttonTypeList"
                v-model="sectionStories.object_id"
                :getOptionLabel="(name) => t(`${name.title}`)"
                :reduce="(name) => name.value"

            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
        </div>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #stories-section-modal" class="btn-secondary">
          {{ $t("Отмена") }}
        </button>

        <button
            :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'"
            @click="updateDeal"
        >
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{
              propData.editData.id ? $t("Edit") : $t("Add")
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
  width: 10px;
  height: 40%;
  overflow: auto;
  background-color: white;

}

.select-chooser .vs__dropdown-menu {
  position: fixed;
  z-index: 9999;
  left: 175px;
  top: 220px;
  width: 66%;
  height: 40%;
  overflow: auto;
  background-color: white;

}
</style>

