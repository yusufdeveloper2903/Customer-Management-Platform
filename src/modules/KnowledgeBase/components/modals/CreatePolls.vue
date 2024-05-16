<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import {Polls} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["savePoll"]);
const propData = defineProps<{ editData: Polls }>();
let pollList = ref({
  name: '',
  is_active: false,

})


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    pollList.value.name = propData.editData.name
    pollList.value.is_active = propData.editData.is_active
  }
}

const hideModal = () => {
  validate.value.$reset()
  pollList.value.name = ""
  pollList.value.is_active = false
}


const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updatePoll({id: propData.editData.id, ...pollList.value})
      await UIkit.modal("#polls-modal").hide();
      emits("savePoll");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'));
    }

  } else {
    try {
      await store.createPoll(pollList.value)
      await UIkit.modal("#polls-modal").hide();
      emits("savePoll");
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
    name: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, pollList);
</script>

<template>
  <div id="polls-modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
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
          <label for="nameUz">{{ $t('name') }}
            <input
                id="nameUz"
                type="text"
                class="form-input"
                v-model="pollList.name"
                :class="validate.name.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.name.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>


          <p class=" mt-5 mb-1">{{ $t("Status") }}:</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                v-model="pollList.is_active"
                class="sr-only peer"
            />
            <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            ></div>
          </label>
        </form>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #polls-modal" class="btn-secondary">
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
