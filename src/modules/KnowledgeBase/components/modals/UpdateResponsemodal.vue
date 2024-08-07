<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import useVuelidate, {Validation} from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";
import {ErrorMessage} from "@/modules/KnowledgeBase/interfaces/index"
import KnowledgeBase from "@/modules/KnowledgeBase/store/index";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import {useSidebarStore} from '@/stores/layoutConfig'


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const general = useSidebarStore()
const propData = defineProps<{ editData: ErrorMessage }>();
const emits = defineEmits(["saveMessage"]);
const store = KnowledgeBase()
const errorMessage = ref<ErrorMessage>({
  status_code: 0,
  message: "",
  message_uz: "",
  message_ru: "",
  message_kr: "",
})


// validations
const rules = computed(() => {
  return {
    message_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    message_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    message_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});
const validate: Ref<Validation> = useVuelidate(rules, errorMessage);


//FUNCTIONS
async function openModal() {
  errorMessage.value.status_code = propData.editData.status_code
  errorMessage.value.message_uz = propData.editData.message_uz
  errorMessage.value.message_ru = propData.editData.message_ru
  errorMessage.value.message_kr = propData.editData.message_kr
}


function hideModal() {
  errorMessage.value.status_code = 0
  errorMessage.value.message_uz = ""
  errorMessage.value.message_ru = ""
  errorMessage.value.message_kr = ""
  validate.value.$reset()
}


const updateDeal = async () => {
  if (!errorMessage.value.message_uz) {
    general.tabs = 'UZ'
  } else if (!errorMessage.value.message_kr) {
    general.tabs = 'KR'
  } else if (!errorMessage.value.message_ru) {
    general.tabs = 'RU'
  }

  errorMessage.value.message = errorMessage.value.message_uz

  const success = await validate.value.$validate();
  if (!success) return;

  try {
    await store.updateErrorMessage(propData.editData.id, errorMessage.value).then(() => {
      emits("saveMessage");
      setTimeout(() => {
        toast.success(t("updated_successfully"));
      }, 200);
      UIkit.modal("#response_modal").hide();
    });

    isSubmitted.value = false;

  } catch (error: any) {
    isSubmitted.value = false;
    toast.error(
        error.response.message || error.response.data.msg || error.response.data.error || t('error')
    );
  }
};


</script>

<template>
  <div id="response_modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg "
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ t('edit_message') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz"
              >{{ t('message') + ' ' + t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="errorMessage.message_uz"
                    :class="validate.message_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.message_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label for="nameUz"
              >{{ t('message') + ' ' + t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="errorMessage.message_kr"
                    :class="validate.message_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.message_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>

            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu"
              >{{ t('message') + ' ' + t('RU') }}
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    v-model="errorMessage.message_ru"
                    :class="validate.message_ru.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                    v-for="error in validate.message_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>

      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #response_modal" class="btn-secondary">
          {{ t("Cancel") }}
        </button>

        <button class="btn-warning mr-2" @click="updateDeal" :disabled="isSubmitted">
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{ t("Change") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
