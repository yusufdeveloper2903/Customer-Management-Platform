<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed, inject, watch} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";


//DECLARED VARIABLES
const {t} = useI18n();
const details = ref<string>("");
const isSubmitted = ref<boolean>(false);
const props = defineProps<any>();
const showModal = inject("showModal");
const onModalChange = (newVal: any) => {
  if (newVal) {
    details.value = props.details;
  }
};
const clearModal = () => {
  details.value = "";
};


//WATCHERS
watch(showModal, onModalChange);


//FUNCTIONS
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  await UIkit.modal("#categories").hide();
  isSubmitted.value = true;
  clearModal();
  isSubmitted.value = false;
  toast.success(t("updated_successfully"));

};


const rules = computed(() => {
  return {};
});

const validate: Ref<Validation> = useVuelidate(rules, {});
</script>

<template>
  <div id="categories" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("Edit") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <Tabs>
          <Tab title="Uz">
            <form>
              <label for="nameUz">Nomi</label>
              <input
                  id="nameUz"
                  type="text"
                  class="form-input"
              />

              <label class="mt-5 block" for="fileUz">Fayl</label>
              <input accept="image/png,image/jpeg" id="fileUz" type="file" class="form-file-input"/>
            </form>
          </Tab>
          <Tab title="Ru">
            <form>
              <label for="nameRu">{{ $t('name') }}</label>
              <input
                  id="nameRu"
                  type="text"
                  class="form-input"
              />

              <label class="mt-4 block" for="fileRu">Файл</label>
              <input accept="image/png,image/jpeg" id="fileRu" type="file" class="form-file-input"/>
            </form>
          </Tab>
        </Tabs>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #categories" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button class="btn-success mr-2" @click="updateDeal" :disabled="isSubmitted">
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
