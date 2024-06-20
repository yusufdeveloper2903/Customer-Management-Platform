<script lang="ts" setup>
// imported files
import { Ref, ref, computed } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import recipeStore from "../../store/index"
import { Ingredient } from "../../interfaces/index"
import knowledgeBase from '@/modules/KnowledgeBase/store/index';
import { useRoute } from "vue-router";



// Declared variables
const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = recipeStore()
const route = useRoute()
const emits = defineEmits(["saveData"]);
const propData = defineProps<{ editData: Ingredient }>();
const knowledgeStore = knowledgeBase()
let recipes = ref<Ingredient>({
  id: null,
  product: null,
  unit_of_measure: null,
  food: null,
  discount: null
})


// validations
const rules = computed(() => {
  return {
    product: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    unit_of_measure: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    discount: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, recipes);



// Functions
async function openModal() {
  await knowledgeStore.getProducts()
  await knowledgeStore.getQuantityType()

  if (propData.editData.id) {
    recipes.value.id = propData.editData.id
    recipes.value.product = propData.editData.product.id
    recipes.value.unit_of_measure = propData.editData.unit_of_measure.id
    recipes.value.discount = propData.editData.discount
    recipes.value.food = propData.editData.food
  } else {
    recipes.value.id = null
    recipes.value.food = null
    recipes.value.discount = null
    recipes.value.product = null
    recipes.value.unit_of_measure = null
  }
}

function clearData() {
  recipes.value.id = null
  recipes.value.food = null
  recipes.value.discount = null
  recipes.value.product = null
  recipes.value.unit_of_measure = null
  validate.value.$reset()
}



const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  recipes.value.food = Number(route.params.id)

  if (propData.editData.id) {
    try {
      await store.updateIngredient(recipes.value.id, recipes.value).then(() => {
        emits("saveData");
        setTimeout(() => {
          toast.success(t("updated_successfully"));
        }, 200);
        UIkit.modal("#ingredient_modal").hide();
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
    await store.createIngredient(recipes.value).then(() => {
      emits("saveData");
      setTimeout(() => {
        toast.success(t("created_successfully"));
      }, 200);
      UIkit.modal("#ingredient_modal").hide();
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
  <div id="ingredient_modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="clearData">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("edit_ingredient") : t('add_ingredient') }}

        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <form>
          <label for="product" class="mt-4 block">{{ t('product') }}
            <VSelect v-model="recipes.product"
              :options="knowledgeStore.productsList && knowledgeStore.productsList.results"
              :getOptionLabel="(name: any) => name.title" :reduce="(item: any) => item.id"
              :placeholder="t('select_product')" :class="validate.product.$errors.length ? 'required-input' : ''" />
            <p v-for="error in validate.product.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </label>


          <label for="type_quantity" class="my-4 block">{{ t('type_quantity') }}
            <VSelect v-model="recipes.unit_of_measure" :options="knowledgeStore.quantityTypeList"
              :getOptionLabel="(name: any) => name.title" :reduce="(item: any) => item.id" :placeholder="t('select_type')"
              :class="validate.unit_of_measure.$errors.length ? 'required-input' : ''" />
            <p v-for="error in validate.unit_of_measure.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </label>

          <label for="quantity" class="block w-full">{{ t('Quantity') }}
            <input id="quantity" type="number" class="form-input" :placeholder="t('Quantity')" v-model="recipes.discount"
              :class="validate.discount.$errors.length ? 'required-input' : ''" />
            <p v-for="error in validate.discount.$errors" :key="error.$uid" class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </label>

        </form>
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #ingredient_modal" class="btn-secondary" @click="clearData">
          {{ t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal" :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
           v-if="isSubmitted" />
          <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
