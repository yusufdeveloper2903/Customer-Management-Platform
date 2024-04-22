<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";
import {editRegionModal} from '../../interfaces/index'


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveSmsTemplate"]);
const propData = defineProps<{
  editData: editRegionModal
}>();
let smsTemplateData = ref({
  name: '',
  name_ru: '',
  name_uz: '',
  name_kr: '',
})


function openModal() {
  if (propData.editData.id) {
    smsTemplateData.value.name_uz = propData.editData.name_uz
    smsTemplateData.value.name_ru = propData.editData.name_ru
    smsTemplateData.value.name_kr = propData.editData.name_kr
  }
}

function hideModal() {
  validate.value.$reset()
  smsTemplateData.value.name_uz = ''
  smsTemplateData.value.name_ru = ''
  smsTemplateData.value.name_kr = ''
}

const updateDeal = async () => {
  smsTemplateData.value.name = smsTemplateData.value.name_uz
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateRegions({id: propData.editData.id, ...smsTemplateData.value})
      await UIkit.modal("#regions").hide();
      emits("saveSmsTemplate");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }

  } else {
    try {
      await store.createRegions(smsTemplateData.value)
      await UIkit.modal("#regions").hide();
      emits("saveSmsTemplate");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(t("error"));
      }
    }
  }
};


//COMPUTED
const rules = computed(() => {
  return {
    name_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },

  };

});

const validate: Ref<Validation> = useVuelidate(rules, smsTemplateData);
</script>

<template>
  <div id="regions" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
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
        <Tabs class="mb-4">
          <Tab title="UZ">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="smsTemplateData.name_uz"
                    :class="validate.name_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </Tab>
          <Tab title="KR">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="smsTemplateData.name_kr"
                    :class="validate.name_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </Tab>
          <Tab title="RU">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('RU') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="smsTemplateData.name_ru"
                    :class="validate.name_ru.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </Tab>
        </Tabs>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #regions" class="btn-secondary">
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
