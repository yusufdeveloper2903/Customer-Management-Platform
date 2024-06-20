<script lang="ts" setup>
// imported files
import { Ref, ref, computed } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import recipeStore from "../../store/index"
import { Preparation } from "../../interfaces/index"
import {useSidebarStore} from '@/stores/layoutConfig'
import { useRoute } from "vue-router";

// Declared variables
const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const route = useRoute()
const store = recipeStore()
const emits = defineEmits(["saveData"]);
const propData = defineProps<{ editData: Preparation }>();
const general = useSidebarStore()
const preparationData = ref<Preparation>({
  id: null,
  index: null,
  description: "",
  description_uz: "",
  description_ru: "",
  description_kr: "",
  food: null
})


// validations
const rules = computed(() => {
  return {
    description_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, preparationData);



// Functions
async function openModal() {
  if (propData.editData.id) {
    preparationData.value.id = propData.editData.id
    preparationData.value.description = propData.editData.description_uz
    preparationData.value.description_uz = propData.editData.description_uz
    preparationData.value.description_ru = propData.editData.description_ru
    preparationData.value.description_kr = propData.editData.description_kr
    preparationData.value.food = propData.editData.food
  } 
}

function clearData() {
  preparationData.value.id = null
    preparationData.value.description = ""
    preparationData.value.description_uz = ""
    preparationData.value.description_ru = ""
    preparationData.value.description_kr = ""
    preparationData.value.food = null
    validate.value.$reset()
}


const updateDeal = async () => {
  if (!preparationData.value.description_uz) {
    general.tabs = 'UZ'
  } else if (!preparationData.value.description_kr) {
    general.tabs = 'KR'
  } else if (!preparationData.value.description_ru) {
    general.tabs = 'RU'
  }


  const success = await validate.value.$validate();
  if (!success) return;

  preparationData.value.description = preparationData.value.description_uz
  preparationData.value.food = Number(route.params.id)

  if (propData.editData.id) {
    try {
      await store.updateRetsept(preparationData.value).then(() => {
        emits("saveData");
        setTimeout(() => {
          toast.success(t("updated_successfully"));
        }, 200);
        UIkit.modal("#edit_recipes").hide();
      });

      isSubmitted.value = false;

    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(
        error.response.message || error.response.data.msg || error.response.data.error || t('error')
      );
    }

  } else {
    try {
      await store.create_retsept(preparationData.value).then(() => {
        emits("saveData");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        UIkit.modal("#preparation_modal").hide();
      });

      isSubmitted.value = false;

    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
          error.response.message || error.response.data.msg || error.response.data.error || t('error')
        );
      }
    }
  }
};
</script>

<template>
  <div id="preparation_modal" class="uk-modal-container" uk-modal @shown="openModal" @hidden="clearData">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("edit_cooking_step") : t('add_cooking_step') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <form>
              <label for="nameUz">{{ t('description') }} O'z
                <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="preparationData.description_uz"
          >
          </Editor>
                <p v-for="error in validate.description_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="KR">
            <form>
              <label for="nameRu">{{ t('description') }} Ўз
                <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="preparationData.description_kr"
          >
          </Editor>
                <p v-for="error in validate.description_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu">{{ t('description') }} Ру
                <Editor
              :placeholder="$t('enter_information')"
              content-type="html"
              toolbar="full"
              class="scrollbar rounded border"
              style="height: 45vh; overflow-y: auto;"
              v-model:content="preparationData.description_ru"
          >
          </Editor>
                <p v-for="error in validate.description_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #preparation_modal" class="btn-secondary" @click="clearData">
          {{ t("Cancel") }}
        </button>

       
        <button  :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal" :disabled="isSubmitted">
          <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
