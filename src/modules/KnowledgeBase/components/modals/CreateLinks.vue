<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import {linkType} from '../../constants/index'
import {EditLink} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const store = knowledgeBase()
const isSubmitted = ref<boolean>(false);
const emits = defineEmits(["saveContact"]);
const propData = defineProps<{ editData: EditLink }>();
const editData = ref({
  type: "",
  url: ""
})


//FUNCTIONS
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  if (propData.editData.id) {
    try {
      await store.updateSocialMediaLinks({id: propData.editData.id, url: editData.value.url, type: editData.value.type})
      await UIkit.modal("#links").hide();
      emits("saveContact");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }

  } else {
    try {
      await store.createSocialMediaLinks(editData.value)
      await UIkit.modal("#links").hide();
      emits("saveContact");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error.response.data.message == '{\'type\': [ErrorDetail(string=\'social media link with this type already exists.\', code=\'unique\')]}') {
        toast.error(t("social_media_exists"));
      } else {
        toast.error(t("error"));
      }

    }
  }
};

function openModal() {
  if (propData.editData.id) {
    editData.value.type = propData.editData.type
    editData.value.url = propData.editData.url
  }
}

function hideModal() {
  validate.value.$reset()
  editData.value.type = ""
  editData.value.url = ""
}


//COMPUTED
const rules = computed(() => {
  return {
    type: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    url: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});
const validate: Ref<Validation> = useVuelidate(rules, editData);
</script>

<template>
  <div id="links" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("ChangeSocial") : $t('AddSocial') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <label>
          <p class=" mt-5 mb-1">{{ $t("type") }}:</p>
          <v-select id="type" :options="linkType" :get-option-label="(name) => name.name"
                    class="mb-4" :class="validate.type.$errors.length ? 'required-input' : ''"
                    :reduce="name => name.type"
                    v-model="editData.type">
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
          <p v-for="error in validate.type.$errors" :key="error.$uid" class="text-danger text-sm">
            {{ $t(error.$message) }}
          </p>
        </label>


        <label for="url">{{ $t('url') }}:</label>
        <input id="url" type="text" class="form-input"
               :class="validate.url.$errors.length ? 'required-input' : ''" v-model="editData.url"/>
        <p v-for="error in validate.url.$errors" :key="error.$uid" class="text-danger text-sm">
          {{ $t(error.$message) }}
        </p>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #links" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal"
                :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
               v-if="isSubmitted"/>
          <span>{{ propData.editData.id ? $t("Change") : $t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
