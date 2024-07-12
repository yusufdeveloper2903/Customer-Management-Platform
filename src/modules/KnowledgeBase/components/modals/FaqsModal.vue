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
import {FaqsTemplate} from "../../interfaces";
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const emptyData = ref(false)
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase();
const general = useSidebarStore()
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: FaqsTemplate }>();
let FaqsTemplate = ref<FaqsTemplate>({
  id: null,
  question: '',
  question_ru: '',
  question_uz: '',
  question_kr: '',
  answer: '',
  answer_ru: '',
  answer_kr: '',
  answer_uz: '',
});


//FUNCTIONS
function openModal() {
  emptyData.value = true
  if (propData.editData.id) {
    FaqsTemplate.value.question = propData.editData.question_uz
    FaqsTemplate.value.question_ru = propData.editData.question_ru
    FaqsTemplate.value.question_uz = propData.editData.question_uz
    FaqsTemplate.value.question_kr = propData.editData.question_kr
    FaqsTemplate.value.answer = propData.editData.answer_uz
    FaqsTemplate.value.answer_ru = propData.editData.answer_ru
    FaqsTemplate.value.answer_kr = propData.editData.answer_kr
    FaqsTemplate.value.answer_uz = propData.editData.answer_uz
    FaqsTemplate.value.id = propData.editData.id
  }
}

const hideModal = () => {
  validate.value.$reset()
  emptyData.value = false
  general.tabs = 'UZ'
  FaqsTemplate.value.question = ''
  FaqsTemplate.value.question_ru = ''
  FaqsTemplate.value.question_uz = ''
  FaqsTemplate.value.question_kr = ''
  FaqsTemplate.value.answer = ''
  FaqsTemplate.value.answer_ru = ''
  FaqsTemplate.value.answer_kr = ''
  FaqsTemplate.value.answer_uz = ''
  FaqsTemplate.value.id = null

}
const updateDeal = async () => {
  if (!FaqsTemplate.value.question_uz && !FaqsTemplate.value.answer_uz) {
    general.tabs = 'UZ'
  } else if (!FaqsTemplate.value.question_kr && !FaqsTemplate.value.answer_kr) {
    general.tabs = 'KR'
  } else if (!FaqsTemplate.value.question_ru && !FaqsTemplate.value.answer_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  FaqsTemplate.value.question = FaqsTemplate.value.question_uz;
  FaqsTemplate.value.answer = FaqsTemplate.value.answer_uz;


  if (propData.editData.id) {
    try {
      await store.updateFaqs(FaqsTemplate.value)
      await UIkit.modal("#faqs_template").hide();
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
      emit("refresh");
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  } else {
    try {
      await store.createFaqs(FaqsTemplate.value)
      await UIkit.modal("#faqs_template").hide();
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
    question_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    question_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    question_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    answer_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    answer_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    answer_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, FaqsTemplate);

</script>

<template>
  <div id="faqs_template" class="uk-flex-top " @shown="openModal" @hidden="hideModal">
    <div  style="width:800px" class="uk-modal-dialog uk-margin-auto-vertical rounded-lg ">
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("EditFaqsTemplate") : $t("AddFaqsTemplate") }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz">{{ t('Question') + ' ' + t('UZ') }}
                <input id="nameUz" type="text" class="form-input" v-model="FaqsTemplate.question_uz"
                       :class="validate.question_uz.$errors.length ? 'required-input' : ''"/>
                <p v-for="error in validate.question_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="Answer">{{ t('Answer') + ' ' + t('UZ') }}
                <Editor  content-type="html" toolbar="full"
                        class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                        v-model:content="FaqsTemplate.answer_uz" :class="validate.answer_uz.$errors.length
                    ? 'required-input'
                    : ''
                    ">
                </Editor>
                <p v-for="error in validate.answer_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label for="nameUz">{{ t('Question') + ' ' + t('KR') }}
                <input id="nameUz" type="text" class="form-input" v-model="FaqsTemplate.question_kr"
                       :class="validate.question_kr.$errors.length ? 'required-input' : ''"/>
                <p v-for="error in validate.question_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="Answer">{{ t('Answer') + ' ' + t('KR') }}

                <Editor  content-type="html" toolbar="full"
                        class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                        v-model:content="FaqsTemplate.answer_kr" :class="validate.answer_kr.$errors.length
                    ? 'required-input'
                    : ''
                    ">
                </Editor>
                <p v-for="error in validate.answer_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu">{{ t('Question') + ' ' + t('RU') }}
                <input id="nameRu" type="text" class="form-input" v-model="FaqsTemplate.question_ru" :class="validate.question_ru.$errors.length ? 'required-input' : ''
                  "/>
                <p v-for="error in validate.question_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="Answer">{{ t('Answer') + ' ' + t('RU') }}

                <Editor  content-type="html" toolbar="full"
                        class="scrollbar rounded border" style="height: 45vh; overflow-y: auto;"
                        v-model:content="FaqsTemplate.answer_ru" :class="validate.answer_ru.$errors.length
                    ? 'required-input'
                    : ''
                    ">
                </Editor>
                <p v-for="error in validate.answer_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>


      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #faqs_template" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
               v-if="isSubmitted"/>
          <span>{{
              propData.editData.id ? t("Edit") : t("Add")
            }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
