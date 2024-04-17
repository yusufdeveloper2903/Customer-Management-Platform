<script lang="ts" setup>
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";

const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveSmsTemplate"]);

interface EditData {
  id: number | null,
  name: {
    ru: string | null
    uz: string | null
  },
}

let smsTemplateData = ref({
  name: {
    ru: '',
    uz: ''
  },

})

const rules = computed(() => {
  return {
    name: {
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),

      },
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, smsTemplateData);

const propData = defineProps<{ editData: EditData }>();


function openModal() {
  if (propData.editData.id) {
    smsTemplateData.value.name.uz = propData.editData.name.uz
    smsTemplateData.value.name.ru = propData.editData.name.ru

  } else {
    smsTemplateData.value.name.uz = ""
    smsTemplateData.value.name.ru = ""
  }
}

function clearData() {
  smsTemplateData.value.name.ru = ""
  smsTemplateData.value.name.uz = ""
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateRegions({id: propData.editData.id, ...smsTemplateData.value})
      emits("saveSmsTemplate");
      toast.success(t("updated_successfully"));
      UIkit.modal("#regions").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(
          error.response || "Error"
      );
    }

  } else {
    try {
      await store.createRegions(smsTemplateData.value).then(() => {
        emits("saveSmsTemplate");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        UIkit.modal("#regions").hide();

      });
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
            error.response || "Error"
        );
      }
    }
  }
};
</script>

<template>
  <div id="regions" class="uk-flex-top" uk-modal @shown="openModal" @hidden="validate.$reset()">
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
        <Tabs class="mb-4">
          <Tab title="UZ">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="smsTemplateData.name.uz"
                    :class="validate.name.uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name.uz.$errors"
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
                    v-model="smsTemplateData.name.ru"
                    :class="validate.name.ru.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name.ru.$errors"
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
        <button uk-toggle="target: #regions" class="btn-secondary" @click="clearData">
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
