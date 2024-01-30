<script lang="ts" setup>
import { Ref, ref, computed } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";

const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveSmsTemplate"]);

interface EditData {
  id: number | null,
  title: {
      uz: string,
      ru: string
    },
    description: {
      uz: string,
      ru: string
    },
}

var smsTemplateData = ref({
    title: {
      uz: "",
      ru: ""
    },
    description: {
      uz: "",
      ru: ""
    },

})

const rules = computed(() => {
  return {   
    title: {
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      },
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },
    description: {
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      },
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },
  };
  
});

const validate: Ref<Validation> = useVuelidate(rules, smsTemplateData);

const propData = defineProps<{editData: EditData}>();


function openModal(){
  if(propData.editData.id){
    smsTemplateData.value.title.uz = propData.editData.title.uz
    smsTemplateData.value.title.ru = propData.editData.title.ru
    smsTemplateData.value.description.uz = propData.editData.description.uz
    smsTemplateData.value.description.ru = propData.editData.description.ru
  } else {
     smsTemplateData.value.title.uz = ""
     smsTemplateData.value.title.ru = ""
     smsTemplateData.value.description.uz = ""
     smsTemplateData.value.description.ru = ""
  }
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
      try {
        await store.updateSmsTemplate({id: propData.editData.id, ...smsTemplateData.value}).then(() => {
          emits("saveSmsTemplate");
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
          UIkit.modal("#sms_template").hide();
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            // error.response.data.msg || error.response.data.error || "Error"
            error.response || "Error"
          );
        }
      }
    
  } else {
      try {
        await store.createSmsTemplate(smsTemplateData.value).then(() => {
          emits("saveSmsTemplate");
          setTimeout(() => {
            toast.success(t("created_successfully"));
          }, 200);
          UIkit.modal("#sms_template").hide();
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            // error.response || error.response.data.msg || error.response.data.error || "Error"
            error.response || "Error"

          );
        }
      }
  }
};
</script>

<template>
  <div id="sms_template" class="uk-flex-top" uk-modal @shown="openModal">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <Tabs>
          <Tab title="Uz">
            <form>
              <label for="nameUz">Nomi
              <input
                id="nameUz"
                type="text"
                class="form-input"
                placeholder="Nomi"
                v-model="smsTemplateData.title.uz"
                :class="validate.title.uz.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.title.uz.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>


              <label class="mt-4 block" for="descriptionUz">Tavsif
              <input
                id="descriptionUz"
                type="text"
                class="form-input"
                placeholder="Tavsif"
                v-model="smsTemplateData.description.uz"
                :class="validate.description.uz.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.description.uz.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            </label>
            </form>
          </Tab>

          <Tab title="Ru">
            <form>
              <label for="nameRu">Заголовок
              <input
                id="nameRu"
                type="text"
                class="form-input"
                placeholder="Заголовок"
                v-model="smsTemplateData.title.ru"
                :class="validate.title.ru.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.title.ru.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            </label>

              <label class="mt-4 block" for="descriptionRu">Описание
              <input
                id="descriptionRu"
                type="text"
                class="form-input"
                :placeholder="$t('description')"
                v-model="smsTemplateData.description.ru"
                :class="validate.description.ru.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.description.ru.$errors"
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
        <button uk-toggle="target: #sms_template" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal" :disabled="isSubmitted">
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
