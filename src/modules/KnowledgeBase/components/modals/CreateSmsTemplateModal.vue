<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import {EditCreate} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveSmsTemplate"]);
const propData = defineProps<{ editData: EditCreate }>();
let smsTemplateData = ref({
  title: '',
  description: '',

})


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    smsTemplateData.value.title = propData.editData.title
    smsTemplateData.value.description = propData.editData.description
  }
}

const hideModal = () => {
  validate.value.$reset()
  smsTemplateData.value.title = ""
  smsTemplateData.value.description = ""
}

function clearData() {
  smsTemplateData.value.title = ""
  smsTemplateData.value.description = ""
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateSmsTemplate({id: propData.editData.id, ...smsTemplateData.value})
      await UIkit.modal("#sms_template").hide();
      emits("saveSmsTemplate");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'));
    }

  } else {
    try {
      await store.createSmsTemplate(smsTemplateData.value)
      await UIkit.modal("#sms_template").hide();

      emits("saveSmsTemplate");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  }
};


//COMPUTED
const rules = computed(() => {
  return {
    title: {
      required: helpers.withMessage("validation.this_field_is_required", required),

    },
    description: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, smsTemplateData);
</script>

<template>
  <div id="sms_template" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">

        <form>
          <label for="nameUz">{{ $t('name') }}
            <input
                id="nameUz"
                type="text"
                class="form-input"
                v-model="smsTemplateData.title"
                :class="validate.title.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>


          <label class="mt-4 block" for="descriptionUz">{{ $t('description') }}
            <textarea
                id="descriptionUz"
                type="text"
                class="form-input"
                v-model="smsTemplateData.description"
                :class="validate.description.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.description.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>
        </form>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #sms_template" class="btn-secondary" @click="clearData">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal"
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
