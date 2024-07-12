<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import knowledgeBase from "../../store/index";
import {Onboarding} from "../../interfaces";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const emptyData = ref(false)
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase();
const general = useSidebarStore()
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: Onboarding }>();
let onBoarding = ref<Onboarding>({
  id: null,
  title: '',
  title_ru: '',
  title_uz: '',
  title_kr: '',
  description: '',
  description_ru: '',
  description_kr: '',
  description_uz: '',
  image: null,
});


//FUNCTIONS
function openModal() {
  emptyData.value = true
  if (propData.editData.id) {
    onBoarding.value.title = propData.editData.title
    onBoarding.value.title_ru = propData.editData.title_ru
    onBoarding.value.title_uz = propData.editData.title_uz
    onBoarding.value.title_kr = propData.editData.title_kr
    onBoarding.value.description = propData.editData.description
    onBoarding.value.description_ru = propData.editData.description_ru
    onBoarding.value.description_kr = propData.editData.description_kr
    onBoarding.value.description_uz = propData.editData.description_uz
    onBoarding.value.image = propData.editData.image
    onBoarding.value.id = propData.editData.id
  }
}

const hideModal = () => {
  validate.value.$reset()
  emptyData.value = false
  general.tabs = 'UZ'
  onBoarding.value.title = ''
  onBoarding.value.title_ru = ''
  onBoarding.value.title_uz = ''
  onBoarding.value.title_kr = ''
  onBoarding.value.description = ''
  onBoarding.value.description_ru = ''
  onBoarding.value.description_kr = ''
  onBoarding.value.description_uz = ''
  onBoarding.value.image = null
  onBoarding.value.id = null

}
const updateDeal = async () => {
  if (!onBoarding.value.title_uz && !onBoarding.value.description_uz) {
    general.tabs = 'UZ'
  } else if (!onBoarding.value.title_kr && !onBoarding.value.description_kr) {
    general.tabs = 'KR'
  } else if (!onBoarding.value.title_ru && !onBoarding.value.description_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  onBoarding.value.title = onBoarding.value.title_uz;
  onBoarding.value.description = onBoarding.value.description_uz;


  if (propData.editData.id) {
    try {
      const fd = objectToFormData(['file'], onBoarding.value);
      await store.updateOnboarding(fd)
      await UIkit.modal("#onboarding_template").hide();
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
      emit("refresh");
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  } else {
    try {
      const fd = objectToFormData(['file'], onBoarding.value);
      await store.createOnboarding(fd)
      await UIkit.modal("#onboarding_template").hide();
      toast.success(t("created_successfully"));
      emit("refresh");
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'));
    }
  }
};

//COMPUTED
const rules = computed(() => {
  return {
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, onBoarding);

</script>

<template>
  <div
      id="onboarding_template"
      class="uk-flex-top "
      uk-modal="bgClose:false"
      @shown="openModal"
      @hidden="hideModal"
  >
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg "
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("EditNestTemplate") : $t("AddNewsTemplate") }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz"
              >{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="onBoarding.title_uz"
                    :class="validate.title_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionUz"
              >{{ $t('description') + ' ' + $t('UZ') }}
                <textarea
                    id="descriptionUz"
                    type="text"
                    class="form-input"
                    v-model="onBoarding.description_uz"
                    :class="validate.description_uz.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_uz.$errors"
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
                    v-model="onBoarding.title_kr"
                    :class="validate.title_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionUz"
              >{{ $t('description') + ' ' + $t('KR') }}
                <textarea
                    id="descriptionUz"
                    type="text"
                    class="form-input"
                    v-model="onBoarding.description_kr"
                    :class="validate.description_kr.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_kr.$errors"
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
                    v-model="onBoarding.title_ru"
                    :class="validate.title_ru.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                    v-for="error in validate.title_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionRu"
              >{{ $t('description') + ' ' + $t('RU') }}
                <textarea
                    id="descriptionRu"
                    type="text"
                    class="form-input"
                    v-model="onBoarding.description_ru"
                    :class=" validate.description_ru.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>
        <label
        >{{ $t('photo') }}
          <FileInput
              :empty="emptyData"
              v-model="onBoarding.image"
              @remove="onBoarding.image = null"
              :typeModal="propData.editData.id"
              name="onboarding-template"
              id="onboarding-id"
          />
        </label>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #onboarding_template" class="btn-secondary">
          {{ $t("Cancel") }}
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
