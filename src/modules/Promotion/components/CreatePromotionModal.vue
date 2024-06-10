<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed, watch, nextTick, reactive} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import prmotionBase from "../store/index";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import FileInput from '@/components/FileInput/FileInput.vue'
import {EditData} from '../Interface/index'
import {objectToFormData} from "@/mixins/formmatter";
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const propData = defineProps<{
  editData: EditData
}>();
const dateConfig = ref({})
const imageDiv = ref<string | undefined | null | object>('')
const imageDivBackground = ref<string | undefined | null | object>('')
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const general = useSidebarStore()
const store = prmotionBase()
const emits = defineEmits(["saveProducts"]);
let productsData = ref({
  id: '',
  title: '',
  title_ru: '',
  title_uz: '',
  title_kr: '',
  description: '',
  description_ru: "",
  description_uz: "",
  description_kr: "",
  status: '',
  background_photo: '',
  detail_photo: '',
  start_date: '',
  end_date: '',
  modified_date: 'string'
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

//FUNCTIONS
const updateDeal = async () => {
  if (!productsData.value.title_uz && !productsData.value.description_uz) {
    general.tabs = 'UZ'
  } else if (!productsData.value.title_kr && !productsData.value.description_kr) {
    general.tabs = 'KR'
  } else if (!productsData.value.title_ru && !productsData.value.description_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  productsData.value.title = productsData.value.title_uz;
  productsData.value.description = productsData.value.description_uz;
  productsData.value.id = propData.editData.id
  const fd = objectToFormData(['detail_photo', 'background_photo'], productsData.value)
  if (propData.editData.id) {
    try {
      await store.updatePromotion(fd)
      await UIkit.modal("#create_edit_promotion").hide();
      emits("saveProducts");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await store.createPromotion(fd)
      await UIkit.modal("#create_edit_promotion").hide();
      emits("saveProducts");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }
  }
}

watch(
    () => dateConfig.value,
    (value: any) => {
      if (value.length > 1) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        productsData.value.start_date = started_date.toLocaleString('it-IT')
        productsData.value.end_date = end_date.toLocaleString('it-IT')

      } else {
        productsData.value.start_date = ""
        productsData.value.end_date = ""
      }

    }
)

function openModal() {

  if (propData.editData.id) {
    productsData.value.title = propData.editData.title_uz
    productsData.value.title_uz = propData.editData.title_uz
    productsData.value.title_kr = propData.editData.title_kr
    productsData.value.title_ru = propData.editData.title_ru
    document.getElementsByClassName('ql-editor')[0].innerHTML = propData.editData.description_uz
    productsData.value.description = propData.editData.description_uz
    productsData.value.description_ru = propData.editData.description_ru
    productsData.value.description_uz = propData.editData.description_uz
    productsData.value.description_kr = propData.editData.description_kr
    productsData.value.background_photo = propData.editData.background_photo
    productsData.value.status = propData.editData.status
    productsData.value.detail_photo = propData.editData.detail_photo
    dateConfig.value = [propData.editData.start_date, propData.editData.end_date]
  }
}


const onHide = () => {
  general.tabs = 'UZ'
  document.getElementsByClassName('ql-editor')[0].innerHTML = ''

  validate.value.$reset()
  dateConfig.value = {}
  imageDiv.value = ''
  imageDivBackground.value = ""
  productsData.value.detail_photo = ""
  productsData.value.title = ''
  productsData.value.title_uz = ''
  productsData.value.title_ru = ''
  productsData.value.title_kr = ''
  productsData.value.status = ''

  productsData.value.start_date = ""
  productsData.value.end_date = ""
  productsData.value.background_photo = ""
  productsData.value.description = ''
  productsData.value.description_uz = ""
  productsData.value.description_ru = ""
  productsData.value.description_kr = ""
  const firstTab = document.querySelectorAll('.first_tab');
  const secondTab = document.querySelectorAll('.second_tab');
  const thirdTab = document.querySelectorAll('.third_tab');
  firstTab.forEach(function (val) {
    const inputElement = val.querySelector('input');
    const textAreaElement = val.querySelector('textarea');
    if (inputElement) {
      inputElement.value = ''
    }
    if (textAreaElement) {
      textAreaElement.value = ''
    }
  });
  secondTab.forEach(function (val) {
    const inputElement = val.querySelector('input');
    const textAreaElement = val.querySelector('textarea');
    if (inputElement) {
      inputElement.value = ''
    }
    if (textAreaElement) {
      textAreaElement.value = ''
    }
  });
  thirdTab.forEach(function (val) {
    const inputElement = val.querySelector('input');
    const textAreaElement = val.querySelector('textarea');
    if (inputElement) {
      inputElement.value = ''
    }
    if (textAreaElement) {
      textAreaElement.value = ''
    }
  });
}


//COMPUTED
const rules = computed(() => {
  return {
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});
const validate: Ref<Validation> = useVuelidate(rules, productsData);

</script>

<template>

  <div id="create_edit_promotion" class="uk-flex-top" uk-modal @shown="openModal" @hidden="onHide">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("ChangePromotion") : $t('AddPromotion') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <div class="first_tab">
              <label>{{ $t('name') + ' ' + $t('UZ') }}</label>
              <input
                  type="text"
                  class="form-input "
                  v-model="productsData.title_uz"
                  :class="validate.title_uz.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
              <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('UZ') }} </label>
              <Editor
                  v-if="productsData.description_uz"
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  id="editorFirst"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_uz"
              />
              <Editor
                  v-else
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_uz">
              </Editor>
              <p
                  v-for="error in validate.description_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>

            </div>


          </ModalTab>
          <ModalTab title="KR">
            <div class="second_tab">
              <label>{{ $t('name') + ' ' + $t('KR') }}</label>
              <input
                  type="text"
                  class="form-input "
                  v-model="productsData.title_kr"
                  :class="validate.title_kr.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
              <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('KR') }} </label>
              <Editor
                  v-if="productsData.description_kr"
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_kr"
              />
              <Editor
                  v-else
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_kr">
              </Editor>
              <p
                  v-for="error in validate.description_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>

            </div>


          </ModalTab>
          <ModalTab title="RU">
            <div class="third_tab">
              <label>{{ $t('name') + ' ' + $t('RU') }}</label>
              <input
                  type="text"
                  class="form-input "
                  v-model="productsData.title_ru"
                  :class="validate.title_ru.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
              <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('RU') }}</label>
              <Editor
                  v-if="productsData.description_ru"
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_ru"
              />
              <Editor
                  v-else
                  :placeholder="$t('enter_information')"
                  content-type="html"
                  toolbar="full"
                  class="scrollbar rounded border"
                  style="height: 15vh; overflow-y: auto;"
                  v-model:content="productsData.description_ru">
              </Editor>
              <p
                  v-for="error in validate.description_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>

            </div>


          </ModalTab>
        </ModalTabs>
        <div class="mt-2">
          <label for="from" class="dark:text-gray-300">
            {{ $t("date_from") + ' - ' + $t("date_to") }}
          </label>
          <VueDatePicker :enableTimePicker="false" auto-apply :range="{ partialRange: false }" v-model="dateConfig"/>
        </div>
        <p class=" mt-4 ">{{ $t("Published") }}</p>


        <v-select
            :options="Status"
            :getOptionLabel="(role:any) => $t(`${role.title}`)"
            :reduce="(role:any) => role.value"
            v-model="productsData.status"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>

        <div>

          <label class="mt-4 block" for="photo">{{ $t('Detail photo') }}
            <FileInput
                v-model="productsData.detail_photo"
                @remove="productsData.detail_photo = null"
                :typeModal="propData.editData.id"
                name="promotion-modal"
            />


          </label>

        </div>
        <div>
          <label class="mt-4 block" for="photo">{{ $t('Background photo') }}
            <FileInput
                v-model="productsData.background_photo"
                @remove="productsData.background_photo = null"
                :typeModal="propData.editData.id"
                name="second-promotion"
            />


          </label>

        </div>

      </div>

      <div
          class=" uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #create_edit_promotion" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal"
                :disabled="isSubmitted">
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{ propData.editData.id ? $t("Change") : $t('Add') }}</span>

        </button>
      </div>
    </div>
  </div>
</template>
