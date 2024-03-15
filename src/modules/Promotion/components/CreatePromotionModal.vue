<script lang="ts" setup>

//Imported files

import {Ref, ref, computed, watch} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import prmotionBase from "../store/index";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";


//Declared variables

const propData = defineProps<{
  editData: EditData
}>();
const dateConfig = ref(null)
const imageDiv = ref<string | undefined | null | object>('')
const imageDivBackground = ref<string | undefined | null | object>('')
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = prmotionBase()
const emits = defineEmits(["saveProducts"]);
let productsData = ref({
  title: {
    uz: "",
    ru: "",
  },
  description: {
    uz: "",
    ru: ""
  },
  is_published: false,
  background_photo: null,
  detail_photo: null,
  start_date: null,
  end_date: null

})

//Declared type

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
  description: {
    uz: string,
    ru: string
  }
  is_active: boolean | null,
  is_published: boolean | null,
  background_photo: null | string,
  detail_photo: null | string,
  start_date: null | string
  end_date: null | string

}


//Declared Validate rules

const rules = computed(() => {
  return {
    title: {
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      },
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },
    description: {
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      },
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },
  };

});


//All Function

const getFile = (event: any) => {
  productsData.value.detail_photo = event.target.files[0]
  let input = event.target;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      imageDiv.value = e?.target?.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}
const getFileBackground = (event: any) => {
  productsData.value.background_photo = event.target.files[0]
  let input = event.target;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      imageDivBackground.value = e?.target?.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  const formData = new FormData()
  formData.append('title', JSON.stringify(productsData.value.title))
  formData.append('description', JSON.stringify(productsData.value.description))
  formData.append('is_published', productsData.value.is_published)
  formData.append('start_date', productsData.value.start_date)
  formData.append('end_date', productsData.value.end_date)
  if (imageDiv.value) {
    formData.append('detail_photo', productsData.value.detail_photo)
  }
  if (imageDivBackground.value) {
    formData.append('background_photo', productsData.value.background_photo)
  }
  if (propData.editData.id) {
    try {
      formData.append('id', propData.editData.id)
      await store.updatePromotion(formData)
      emits("saveProducts");
      UIkit.modal("#create_edit_promotion").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await store.createPromotion(formData)
      UIkit.modal("#create_edit_promotion").hide();
      emits("saveProducts");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }
  }
};

watch(
    () => dateConfig.value,
    (value: any) => {
      if (value) {
        let started_date = JSON.parse(JSON.stringify(value))[0]
        let end_date = JSON.parse(JSON.stringify(value))[1]
        if (!value) {
          productsData.value.start_date = ""
          productsData.value.end_date = ""
        } else {
          productsData.value.start_date = started_date.toLocaleString('it-IT')
          productsData.value.end_date = end_date.toLocaleString('it-IT')
        }
      }

    }
)

function openModal() {
  if (propData.editData.id) {
    productsData.value.title.uz = propData.editData.title?.uz
    productsData.value.title.ru = propData.editData.title?.ru
    productsData.value.description.ru = propData.editData.description?.ru
    productsData.value.description.uz = propData.editData.description?.uz
    productsData.value.background_photo = propData.editData.background_photo
    productsData.value.is_published = propData.editData.is_published
    productsData.value.detail_photo = propData.editData.detail_photo
    dateConfig.value = [propData.editData.start_date, propData.editData.end_date]
  } else {
    productsData.value.title.uz = ""
    productsData.value.is_published = false
    productsData.value.description.uz = ''
    productsData.value.description.ru = ''
    productsData.value.title.ru = ""
    productsData.value.background_photo = ''
    productsData.value.detail_photo = ''
    productsData.value.start_date = ""
    productsData.value.end_date = ""
    dateConfig.value = null

    imageDiv.value = ""
  }
}


const onHide = () => {
  validate.value.$reset()
  dateConfig.value = null
  imageDiv.value = ''
  imageDivBackground.value = ""
  productsData.value.detail_photo = ""
  productsData.value.title.ru = ''
  productsData.value.title.uz = ''
  productsData.value.start_date = ""
  productsData.value.end_date = ""
  productsData.value.background_photo = ""
  document.getElementById('fileInput').value = ''
  document.getElementById('fileInputback').value = ''

}
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
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <Tabs>
          <Tab title="UZ">
            <label>{{ $t('name') }}</label>
            <input
                type="text"
                class="form-input"
                :placeholder="$t('name')"
                v-model="productsData.title.uz"
                :class="validate.title.uz.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title.uz.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            <label for="number" class="block mt-4">{{ $t('description') }}
              <textarea
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('description')"
                  v-model="productsData.description.uz"
                  :class="validate.description.uz.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.description.uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>

            </label>
          </Tab>
          <Tab title="RU">
            <label>{{ $t('name') }}</label>
            <input
                type="text"
                class="form-input"
                :placeholder="$t('name')"
                v-model="productsData.title.ru"
                :class="validate.title.ru.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title.ru.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            <label for="number" class="block mt-4">{{ $t('description') }}
              <textarea
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('description')"
                  v-model="productsData.description.ru"
                  :class="validate.description.ru.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.description.ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>

          </Tab>
        </Tabs>
        <div class="mt-2">
          <label for="from" class="dark:text-gray-300">
            {{ $t("from_to") }}
          </label>
          <VueDatePicker auto-apply :range="{ partialRange: false }" v-model="dateConfig"/>
        </div>
        <p class=" mt-5 mb-1">{{ $t("Published") }}:</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="productsData.is_published"
              class="sr-only peer"
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
        <div>

          <label class="mt-4 block" for="photo">{{ $t('Detail photo') }}
            <input @change="getFile" id="fileInput" type="file"
                   class="form-file-input p-1"
            />

          </label>
          <div v-if="propData.editData.detail_photo || imageDiv">
            <img v-if="propData.editData.detail_photo && !imageDiv"
                 class="w-[100%] h-[200px] rounded object-contain mt-3"
                 :src="propData.editData.detail_photo "
                 alt="Rounded avatar"
            />
            <img v-else
                 class="w-[100%] h-[200px] rounded object-contain mt-3"
                 :src="imageDiv"
                 alt="Rounded avatar"
            />

          </div>
        </div>
        <div>

          <label class="mt-4 block" for="photo">{{ $t('Background photo') }}
            <input @change="getFileBackground" id="fileInputback" type="file"
                   class="form-file-input p-1"
            />

          </label>
          <div v-if="propData.editData.background_photo || imageDivBackground">
            <img v-if="propData.editData.background_photo && !imageDivBackground"
                 class="w-[100%] h-[200px] rounded object-contain mt-3"
                 :src="propData.editData.background_photo "
                 alt="Rounded avatar"
            />
            <img v-else
                 class="w-[100%] h-[200px] rounded object-contain mt-3"
                 :src="imageDivBackground"
                 alt="Rounded avatar"
            />

          </div>
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
