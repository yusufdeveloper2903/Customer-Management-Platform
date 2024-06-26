<script lang="ts" setup>
// imported files
import { Ref, ref, computed, watch } from 'vue';
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import recipeStore from "../../store/index"
import { Retsept } from "../../interfaces/index"
import knowledgeBase from '@/modules/KnowledgeBase/store/index';
import {useSidebarStore} from '@/stores/layoutConfig'



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
const general = useSidebarStore()
const isSubmitted = ref<boolean>(false);
const store = recipeStore()
const emits = defineEmits(["saveData"]);
const propData = defineProps<{ editData: Retsept }>();
const knowledgeStore = knowledgeBase()
const themeDataPicker = ref<boolean>(false)
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
    category: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, recipes);



// Functions
async function openModal() {
  await knowledgeStore.getRetseptCategory()
  if (propData.editData.id) {
    recipes.value.id = propData.editData.id
    recipes.value.title_ru = propData.editData.title_ru
    recipes.value.title_uz = propData.editData.title_uz
    recipes.value.title_kr = propData.editData.title_kr
    recipes.value.calorie = propData.editData.calorie
    recipes.value.preparation_time = propData.editData.preparation_time
    recipes.value.is_active = propData.editData.is_active
    recipes.value.category = propData.editData.category.id
  } else {
    recipes.value.id = null
    recipes.value.title_ru = ""
    recipes.value.title_uz = ""
    recipes.value.title_kr = ""
    recipes.value.calorie = 0
    recipes.value.preparation_time = ""
    recipes.value.is_active = false
    recipes.value.category = null
  }
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
  if (!recipes.value.title_uz) {
    general.tabs = 'UZ'
  } else if (!recipes.value.title_kr) {
    general.tabs = 'KR'
  } else if (!recipes.value.title_ru) {
    general.tabs = 'RU'
  }



  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      recipes.value.title = recipes.value.title_uz
      
      await store.updateRetsept(recipes.value).then(() => {
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
      await store.create_retsept(recipes.value).then(() => {
        propData.editData.id = recipes.value.id
        emits("saveData");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        UIkit.modal("#edit_recipes").hide();
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

// watch(() => localStorage.getItem('currentTheme'),
//     () => {
//       if(localStorage.getItem('currentTheme') == 'dark') {
//         themeDataPicker.value = true
//       } else {
//         themeDataPicker.value = false
//       }
//     }
// );



</script>

<template>
  <div id="edit_recipes" class="uk-flex-top" uk-modal @shown="openModal" @hidden="clearData">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg ">
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("edit_recipe") : t('add_recipe') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <form>
              <label for="nameUz">{{ t('name') }} O'z
                <input id="nameUz" type="text" class="form-input" :placeholder="t('name')" v-model="recipes.title_uz"
                  :class="validate.title_uz.$errors.length ? 'required-input' : ''" @input="getTitle" />
                <p v-for="error in validate.title_uz.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="KR">
            <form>
              <label for="nameRu">{{ t('name') }} Ўз
                <input id="nameRu" type="text" class="form-input" :placeholder="t('name')" v-model="recipes.title_kr" :class="validate.title_kr.$errors.length ? 'required-input' : ''"/>
                <p v-for="error in validate.title_kr.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu">{{ t('name') }} Ру
                <input id="nameRu" type="text" class="form-input" :placeholder="t('name')" v-model="recipes.title_ru" :class="validate.title_ru.$errors.length ? 'required-input' : ''"/>
                <p v-for="error in validate.title_ru.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>
        <form>

          <label for="category" class="mt-4 block">{{ t('category') }}
            <VSelect v-model="recipes.category"
              :options="knowledgeStore.retseptCategoryList && knowledgeStore.retseptCategoryList.results"
              :getOptionLabel="(name: any) => name.name" :reduce="(item: any) => item.id"
              :placeholder="t('select_category')" 
              :class="validate.category.$errors.length ? 'required-input' : ''"/>
              <p v-for="error in validate.category.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
          </label>

          <div class="flex mt-4 gap-4">
            <label for="calorie" class="block w-full">{{ t('calorie') }}
              <input id="calorie" type="text" class="form-input" :placeholder="t('calorie')" v-model="recipes.calorie" />
            </label>
  
            <label for="preparation_time" class="block w-full">{{ t('preparation_time') }}
              {{ themeDataPicker }}
              <VueDatePicker :dark="themeDataPicker" v-model="recipes.preparation_time" :placeholder="t('preparation_time')" model-type="hh:mm:ss" time-picker enable-seconds></VueDatePicker>
            </label>
          </div>

          
          <div class="flex items-center mt-5" v-if="propData.editData.id">
        <p class="mr-2">{{ t("Status") }}:</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                v-model="recipes.is_active"
                class="sr-only peer"
            />
            <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
            ></div>
          </label>
        </div>

        </form>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #edit_recipes" class="btn-secondary" @click="clearData">
          {{ t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'"  @click="updateDeal" :disabled="isSubmitted">
         <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
           v-if="isSubmitted" />
          <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dp__menu  {
  background-color: black !important; 
}
</style>
