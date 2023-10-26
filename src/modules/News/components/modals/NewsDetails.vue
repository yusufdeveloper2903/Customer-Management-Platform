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

const handleFileUpload = () => { }
const deleteImage = () => { }

const clearModal = () => {
  details.value = "";
};

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  isSubmitted.value = true;
  UIkit.modal("#news-detail").hide();
  toast.success(t("updated_successfully"));
  setTimeout(() => {
    clearModal();
    isSubmitted.value = false;
  }, 500);
};
</script>

<template>
  <div id="news-detail" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden w-[800px]">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("Modal") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
          <div class="flex items-start gap-5">
            <div class="w-[40%]">
              <label>Photo</label>
              <div
                class="mb-5 mt-1 flex h-56 w-full mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
                <span v-if="true" class="font-medium dark:text-white">{{
                  $t("no_photo")
                }}</span>
                <img v-else class="w-full h-full object-cover" :src="'imageUrl'" alt="" />
              </div>
              <div class="flex gap-3 mb-0.5">
                <div class="w-full" :class="true && 'w-10/12'">
                  <input id="upload" class="form-file-input" type="file" @change="handleFileUpload" />
                </div>
                <button type="button" v-if="true" class="btn-outline-danger btn-action float-right w-2/12 mt-1" @click="deleteImage">
                  <Icon icon="Trash Bin Trash" color="#ea5455" size="20" />
                </button>
              </div>
            </div>
            <div class="w-[60%]">
              <label>
                Title
                <input type="text" class="form-input" placeholder="Title">
              </label>

              <label class="mt-3 block">
                Description
                <input type="text" class="form-input" placeholder="Description">
              </label>

              <label class="mt-3 block">
                Schedule time
                <input type="text" class="form-input" placeholder="Schedule time">
              </label>

              <label class="mt-3 block">
                Push time
                <input type="text" class="form-input" placeholder="Push time">
              </label>

              <label class="mt-3 block">
                Group
                <input type="text" class="form-input" placeholder="Group">
              </label>
            </div>
          </div>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #news-detail" class="btn-secondary">
          {{ $t("cancel2") }}
        </button>

        <button class="btn-success" @click="updateDeal" :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted" />
          <span>{{ $t("Change") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
