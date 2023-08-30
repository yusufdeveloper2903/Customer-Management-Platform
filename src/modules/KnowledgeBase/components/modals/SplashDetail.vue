<script lang="ts" setup>
import { Ref, ref, computed, inject, watch } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
// import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";

const { t } = useI18n();
const details = ref<string>("");
const isSubmitted = ref<boolean>(false);

const rules = computed(() => {
  return {
    // carModel: {
    //   required: helpers.withMessage("required", required),
    // },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, {});

interface Props {
  details: any;
}

const props = defineProps<Props>();
const showModal = inject("showModal");

const onModalChange = (newVal) => {
  if (newVal) {
    details.value = props.details;
  }
};

watch(showModal, onModalChange);

const clearModal = () => {
  details.value = "";
};

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  isSubmitted.value = true;
  UIkit.modal("#splash").hide();
  toast.success(t("updated_successfully"));
  setTimeout(() => {
    clearModal();
    isSubmitted.value = false;
  }, 500);
};
</script>

<template>
  <div id="splash" class="uk-flex-top" uk-modal>
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("edit_car") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <form>
          <label class="mt-5 block" for="file">File</label>
          <input id="file" type="file" class="form-file-input" />

          <span class="block mt-4">Is active</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
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
        <button uk-toggle="target: #splash" class="btn-secondary">
          {{ $t("cancel2") }}
        </button>

        <button class="btn-success" @click="updateDeal" :disabled="isSubmitted">
          <img
            src="@/assets/image/loading.svg"
            alt="loading.svg"
            class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted"
          />
          <span>{{ $t("Change") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
