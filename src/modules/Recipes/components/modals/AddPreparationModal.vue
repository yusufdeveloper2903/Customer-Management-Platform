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
// import { Retsept } from "../../interfaces/index"
import knowledgeBase from '@/modules/KnowledgeBase/store/index';


// declared type
interface RecipesData {
  id: number | null
  title: string,
  title_uz: string,
  title_ru: string,
  title_kr: string,
  calorie: number,
  preparation_time: string,
  is_active: boolean,
  category: number | null
}


// Declared variables
const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = recipeStore()
// const emits = defineEmits(["saveRecipes"]);
// const propData = defineProps<{ editData: Retsept }>();
const knowledgeStore = knowledgeBase()
let recipes = ref<RecipesData>({
  id: null,
  title: "",
  title_uz: "",
  title_ru: "",
  title_kr: "",
  calorie: 0,
  preparation_time: "",
  is_active: false,
  category: null
})


// validations
const rules = computed(() => {
  return {
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, recipes);



// Functions
async function openModal() {
  await knowledgeStore.getRetseptCategory()
  // if (propData.editData.id) {
  //   recipes.value.id = propData.editData.id
  //   recipes.value.title_ru = propData.editData.title_ru
  //   recipes.value.title_uz = propData.editData.title_uz
  //   recipes.value.title_kr = propData.editData.title_kr
  //   recipes.value.calorie = propData.editData.calorie
  //   recipes.value.preparation_time = propData.editData.preparation_time
  //   recipes.value.is_active = propData.editData.is_active
  //   recipes.value.category = propData.editData.category
  // } else {
  //   recipes.value.id = null
  //   recipes.value.title_ru = ""
  //   recipes.value.title_uz = ""
  //   recipes.value.title_kr = ""
  //   recipes.value.calorie = 0
  //   recipes.value.preparation_time = ""
  //   recipes.value.is_active = false
  //   recipes.value.category = null
  // }
}

function clearData() {
  recipes.value.id = null
  recipes.value.title = ""
  recipes.value.title_ru = ""
  recipes.value.title_uz = ""
  recipes.value.title_kr = ""
  recipes.value.calorie = 0
  recipes.value.preparation_time = ""
  recipes.value.is_active = false
  recipes.value.category = null
  validate.value.$reset()
}


function getTitle() {
  recipes.value.title = recipes.value.title_uz
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  // if (propData.editData.id) {
  //   try {
  //     await store.updateRetsept(recipes.value).then(() => {
  //       // emits("saveRecipes");
  //       setTimeout(() => {
  //         toast.success(t("updated_successfully"));
  //       }, 200);
  //       UIkit.modal("#edit_recipes").hide();
  //     });

  //     isSubmitted.value = false;

  //   } catch (error: any) {
  //     isSubmitted.value = false;
  //     toast.error(
  //       error.response.message || error.response.data.msg || error.response.data.error || t('error')
  //     );
  //   }

  // } else {
    try {
      await store.create_retsept(recipes.value).then(() => {
        // emits("saveRecipes");
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
  // }
};
</script>

<template>
  <div id="preparation_modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="clearData">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          <!-- {{ propData.editData.id ? t("Change") : t('Add') }} -->
          {{ t("Добавление шага приготовления") }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <form>
              <label for="nameUz">{{ t('description') }} O'z
                <textarea id="nameUz" type="text" class="form-input" :placeholder="t('description')" v-model="recipes.title_uz"
                  :class="validate.title_uz.$errors.length ? 'required-input' : ''" @input="getTitle" />
                <p v-for="error in validate.title_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="KR">
            <form>
              <label for="nameRu">{{ t('description') }} Ру
                <textarea
                id="descriptionUz"
                type="text"
                class="form-input"
                :placeholder="t('description')" 
            />
                <p v-for="error in validate.title_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu">{{ t('description') }} Ўз
                <textarea
                id="descriptionUz"
                type="text"
                class="form-input"
                :placeholder="t('description')" 
            />
                <p v-for="error in validate.title_kr.$errors" :key="error.$uid" class="text-danger text-sm">
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

        <!-- :class="propData.editData.id ? 'btn-warning' : 'btn-success'" -->
        <button class="btn-success" @click="updateDeal" :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted" />
          <!-- <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span> -->
          <span>{{ t("Add")  }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
