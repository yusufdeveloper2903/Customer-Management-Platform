<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import {EditVersion} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const store = knowledgeBase()
const emits = defineEmits(["saveVersionControl"]);
let versionControlData = ref({
  number: "",
  description: ""
})
const propData = defineProps<{ editData: EditVersion }>();


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    versionControlData.value.number = propData.editData.number
    versionControlData.value.description = propData.editData.description
  }
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateVersion({id: propData.editData.id, ...versionControlData.value})
      await UIkit.modal("#version_control").hide();
      emits("saveVersionControl");
      toast.success(t("updated_successfully"));
    } catch (error: any) {
      toast.error(t("error"))
    }

  } else {
    try {
      await store.createVersion(versionControlData.value)
      await UIkit.modal("#version_control").hide();
      emits("saveVersionControl");
      toast.success(t("created_successfully"));
    } catch (error: any) {
      toast.error(t('error'));
    }
  }
};
const hideData = () => {
  versionControlData.value.number = ''
  versionControlData.value.description = ''
  validate.value.$reset()
}


//COMPUTED
const rules = computed(() => {
  return {
    number: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, versionControlData);

</script>

<template>

  <div id="version_control" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideData">
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
        <form>
          <label>{{ $t('version_number') }} </label>
          <input
              type="text"
              class="form-input"
              v-model="versionControlData.number"
              :class="validate.number.$errors.length ? 'required-input' : ''"
          />
          <p
              v-for="error in validate.number.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
          <div class="mt-3">
            <label>{{ $t('Description') }} </label>
            <textarea
                type="text"
                class="form-input"
                v-model="versionControlData.description"
                :class="validate.number.$errors.length ? 'required-input' : ''"
            />
          </div>

        </form>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #version_control" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal">
          <span>{{ propData.editData.id ? $t("Change") : $t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
