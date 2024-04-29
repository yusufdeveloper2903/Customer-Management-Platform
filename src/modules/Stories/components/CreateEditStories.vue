<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed, nextTick} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import Stories from "../store/index";
import {storiesHeaders} from "../interfaces";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import VueDatePicker from '@vuepic/vue-datepicker';

//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = Stories();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: storiesHeaders }>();
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


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    storiesVariable.value.id = propData.editData.id;
    storiesVariable.value.subtitle = propData.editData.subtitle_uz;
    storiesVariable.value.subtitle_uz = propData.editData.subtitle_uz;
    storiesVariable.value.subtitle_kr = propData.editData.subtitle_kr;
    storiesVariable.value.subtitle_ru = propData.editData.subtitle_ru;
    storiesVariable.value.start_date = propData.editData.start_date;
    storiesVariable.value.end_date = propData.editData.end_date;
    storiesVariable.value.avatar = propData.editData.avatar;
    storiesVariable.value.is_active = propData.editData.is_active;
  }
}

const hideModal = () => {
  validate.value.$reset()
  storiesVariable.value.subtitle = ''
  storiesVariable.value.subtitle_ru = ''
  storiesVariable.value.subtitle_kr = ''
  storiesVariable.value.subtitle_uz = ''
  storiesVariable.value.is_active = false
  storiesVariable.value.start_date = ''
  storiesVariable.value.end_date = ""
  storiesVariable.value.avatar = null
}
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      storiesVariable.value.subtitle = storiesVariable.value.subtitle_uz;
      const formData = objectToFormData(storiesVariable.value);
      await store.updateStories(formData)
      await UIkit.modal("#stories-modal").hide();
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
      storiesVariable.value.subtitle = storiesVariable.value.subtitle_uz;
      const formData = objectToFormData(storiesVariable.value);
      await store.createStories(formData)
      await UIkit.modal("#stories-modal").hide();
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
    start_date: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    end_date: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
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
  <div
      id="stories-modal"
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
        <p class=" mt-4 ">{{ $t("Status") }}:</p>
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
              :typeModal="propData.editData.id"
              name="stories-modal-input"/>

        </div>

      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #stories-modal" class="btn-secondary">
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
