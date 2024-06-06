<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, minLength, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import {EditPhone} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const store = knowledgeBase()
const isSubmitted = ref<boolean>(false);
const emits = defineEmits(["saveContact"]);
const propData = defineProps<{ editData: EditPhone }>();
const editData = ref({
  number: "",
})


//FUNCTIONS
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  if (propData.editData.id) {
    try {
      await store.updatePhones({id: propData.editData.id, ...editData.value})
      await UIkit.modal("#phones").hide();
      emits("saveContact");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }

  } else {
    try {
      await store.createPhones(editData.value)
      await UIkit.modal("#phones").hide();
      emits("saveContact");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error.response.data.message == '{\'number\': [ErrorDetail(string=\'phone number with this number already exists.\', code=\'unique\')]}') {
        toast.error(t('phone_number_exists'));
      } else {
        toast.error(t("error"))
      }

    }
  }
};

function hideModal() {
  editData.value.number = ""
  validate.value.$reset()
}

function openModal() {
  if (propData.editData.id) {
    editData.value.number = propData.editData.number
  }
}


//COMPUTED
const rules = computed(() => {
  return {
    number: {
      required: helpers.withMessage("validation.this_field_is_required", required),
      minLength: helpers.withMessage(
          "The phone number must be entered in the format: '998 [XX] [XXX XX XX]",
          minLength(17)
      ),
    },
  };
});
const validate: Ref<Validation> = useVuelidate(rules, editData);

</script>

<template>
  <div id="phones" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("Change") : t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">

        <form>

          <label for="phone">{{ t('phone_number') }}</label>
          <input id="phone" type="tel" class="form-input" :placeholder="t('phone_number')" v-maska
                 data-maska="+998 ## ### ## ##" :class="validate.number.$errors.length ? 'required-input' : ''"
                 v-model="editData.number"/>
          <p v-for="error in validate.number.$errors" :key="error.$uid" class="text-danger text-sm">
            {{ t(error.$message) }}
          </p>
        </form>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #phones" class="btn-secondary">
          {{ t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal"
                :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg"
               class="inline w-4 h-4 text-white animate-spin mr-2" v-if="isSubmitted"/>
          <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

