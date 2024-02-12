<script lang="ts" setup>

//Imported files
import productStore from '../store/index'
import {Ref, ref, computed, watch, reactive} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import {useI18n} from 'vue-i18n'
import {toast} from "vue3-toastify";
import UIkit from "uikit";

//Props and Emits


const propData = defineProps<{
  editData: EditData
}>();
const emits = defineEmits(["saveProducts"]);


//Declared variables
const productStorage = productStore()
const {t} = useI18n()
const isSubmitted = ref<boolean>(false);

interface EditData {
  id: number | null,

  is_active: boolean,
  category: number | null,
  product: number | null,
  has_discount: boolean,
  discount_percentage: number | null,
  price: number | null

}

let productsCategory = ref({
  product: null,
  id: null,
  is_active: false,
  category: null,
  has_discount: null,
  discount_percentage: 0,
  price: null
})

let discountList = reactive([
  {
    title: 'Discount available',
    value: true
  },
  {
    title: 'No discount available',
    value: false
  }
])

watch(() => productsCategory.value.has_discount, function (val) {
  if (!val) {
    productsCategory.value.discount_percentage = 0
  }
})
const saveData = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  isSubmitted.value = true
  if (propData.editData.id) {
    try {
      await productStorage.updateProductCard(productsCategory.value)
      emits("saveProducts");
      UIkit.modal("#create_and_edit_product_detail").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await productStorage.createProductCard(productsCategory.value)
      UIkit.modal("#create_and_edit_product_detail").hide();
      emits("saveProducts");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }
  }
};


function openModal() {
  if (propData.editData.id) {
    productsCategory.value.is_active = propData.editData.is_active
    productsCategory.value.product = propData.editData.product?.id
    productsCategory.value.category = propData.editData.category
    productsCategory.value.price = propData.editData.price
    productsCategory.value.has_discount = propData.editData.has_discount
    productsCategory.value.discount_percentage = propData.editData.discount_percentage
    productsCategory.value.id = propData.editData.id
  }
}


const onHide = () => {
  productsCategory.value.id = null
  productsCategory.value.is_active = false
  productsCategory.value.product = null
  productsCategory.value.has_discount = null
  productsCategory.value.discount_percentage = null
  productsCategory.value.price = null
  productsCategory.value.category = null
  validate.value.$reset()
}

const rules = computed(() => {
  return {
    product: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },


  };

});

const validate: Ref<Validation> = useVuelidate(rules, productsCategory);

</script>

<template>
  <div id="create_and_edit_product_detail" class="uk-flex-top" uk-modal @shown="openModal" @hidden="onHide">
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
        <label>
          <p class=" mt-5 mb-1">{{ $t("Products") }}:</p>
          <v-select
              :options="productStorage.productFromKnowledgeBase.results"
              v-model="productsCategory.product"
              :getOptionLabel="(name) => name.title[$i18n.locale]"
              :reduce="(name) => name.id"
          >
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
          <p
              v-for="error in validate.product.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </label>

        <p class=" mt-5 mb-1">{{ $t("Category") }}:</p>
        <v-select
            :options="productStorage.productListCategory.results"
            v-model="productsCategory.category"
            :getOptionLabel="(name) => name.title[$i18n.locale]"
            :reduce="(name) => name.id"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>
        <p class=" mt-5 mb-1">{{ $t("Discount") }}:</p>
        <v-select
            :options="discountList"
            v-model="productsCategory.has_discount"
            :getOptionLabel="(name) => name.title"
            :reduce="(name) => name.value"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>
        <div
            v-if="productsCategory.has_discount"

        >
          <p class=" mt-5 mb-1">{{ $t("Discount percentage") }}:</p>
          <input
              type="text"
              class="form-input"
              v-model="productsCategory.discount_percentage"
          />
        </div>

        <p class=" mt-5 mb-1">{{ $t("Price") }}:</p>
        <input
            type="text"
            class="form-input"
            v-model="productsCategory.price"
        />

        <p class=" mt-5 mb-1">{{ $t("Status") }}:</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="productsCategory.is_active"
              class="sr-only peer"
          />
          <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #create_and_edit_product_detail" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button class="btn-success" @click="saveData">
          {{ $t('Add') }}

          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
        </button>
      </div>
    </div>
  </div>
</template>
