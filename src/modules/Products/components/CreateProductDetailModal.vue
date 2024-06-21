<script lang="ts" setup>

//IMPORTED FILES
import productStore from '../store/index'
import {Ref, ref, computed, watch, reactive} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import {useI18n} from 'vue-i18n'
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {useRoute} from "vue-router";
import {EditDataSecond} from '../Interfaces/index'

//DECLARED VARIABLES
const route = useRoute();
const propData = defineProps<{
  editData: EditDataSecond
}>();
const emits = defineEmits(["saveProducts"]);
const productStorage = productStore()
const {t} = useI18n()
const isSubmitted = ref<boolean>(false);
let productsCategory = ref({
  product: '',
  id: '',
  status: 'DRAFT',
  category: '',
  has_discount: false,
  discount_percentage: 0,
  price: ''
})
const listStatus = ref([
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Draft',
    value: 'DRAFT'
  },
  {
    title: 'Finished',
    value: 'FINISHED'
  }
])
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


//WATCHERS
watch(() => productsCategory.value.has_discount, function (val) {
  if (!val) {
    productsCategory.value.discount_percentage = 0
  }
})


//FUNCTIONS
const saveData = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  isSubmitted.value = true
  productsCategory.value.product = productsCategory.value.product?.id
  if (propData.editData.id) {
    try {
      await productStorage.updateProductCard(productsCategory.value)
      await UIkit.modal("#create_and_edit_product_detail").hide();
      emits("saveProducts");
      toast.success(t('updated_successfully'))
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await productStorage.createProductCard(productsCategory.value)
      await UIkit.modal("#create_and_edit_product_detail").hide();
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
    productsCategory.value.status = propData.editData.status
    productsCategory.value.product = propData.editData.product
    productsCategory.value.category = propData.editData.category
    productsCategory.value.price = propData.editData.price
    productsCategory.value.has_discount = propData.editData.has_discount
    productsCategory.value.discount_percentage = propData.editData.discount_percentage
    productsCategory.value.id = String(propData.editData.id)
  } else {
    productsCategory.value.category = String(route.params.id)
  }
}


const onHide = () => {
  productsCategory.value.id = ''
  productsCategory.value.status = 'DRAFT'
  productsCategory.value.product = ''
  productsCategory.value.has_discount = false
  productsCategory.value.discount_percentage = 0
  productsCategory.value.price = ''
  productsCategory.value.category = ''
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
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg "
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("ChangeProduct") : $t('AddProduct') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <label>
          <p class=" mt-5 mb-1">{{ $t("products") }}:</p>
          <v-select

              :options="productStorage.productFromKnowledgeBase.results"
              v-model="productsCategory.product"
              :getOptionLabel="(name) => name['title_'+$i18n.locale]"
              :reduce="(name) => name"
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
        <div v-if="productsCategory.product && productsCategory.product.image">
          <img
              class="w-[200px] mt-3"
              :src="productsCategory.product.image"
              alt="image"
              style="aspect-ratio: 1/1 "
          />

        </div>
        <div class="mt-5 flex justify-center gap-3">
          <div class="w-1/2">
            <p>{{ $t("Discount") }}:</p>
            <v-select
                :options="discountList"
                v-model="productsCategory.has_discount"
                :getOptionLabel="(name) => t(`${name.title}`)"
                :reduce="(name) => name.value"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
          <div class="w-1/2">
            <p>{{ $t("Status") }}</p>
            <v-select
                :options="listStatus"
                v-model="productsCategory.status"
                :getOptionLabel="(name:any) => t(name.title)"
                :reduce="(item:any) => item.value"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>
        </div>
        <div class="flex gap-3">

          <div v-if="propData.editData.id" class="w-1/2">
            <p style="margin-top:17px" class=" mt-4">{{ $t("category") }}:</p>
            <v-select
                :options="productStorage.productListCategory.results"
                v-model="productsCategory.category"
                :getOptionLabel="(name) => name['title_'+$i18n.locale]"
                :reduce="(name) => name.id"
            >
              <template #no-options> {{ $t("no_matching_options") }}</template>
            </v-select>
          </div>


          <div
              v-if="productsCategory.has_discount"
              class="w-1/2"

          >
            <p class=" mt-5 mb-1">{{ $t("Discount percentage") }}:</p>
            <input
                type="number"
                class="form-input"
                v-model="productsCategory.discount_percentage"
            />
          </div>
          <div class="w-1/2">

            <p class=" mt-5 mb-1">{{ $t("price") }}:</p>
            <input
                type="number"
                class="form-input"
                v-model="productsCategory.price"
            />

          </div>
        </div>

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

