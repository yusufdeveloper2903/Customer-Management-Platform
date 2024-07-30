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
  discount_price: ''
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


//WATCHER
watch(() => productsCategory.value.has_discount, function (val) {
  if (!val) {
    productsCategory.value.discount_percentage = 0

  } else if (!productsCategory.value.discount_percentage) {
    productsCategory.value.discount_price = productsCategory.value.product.price
  }
})

const discountPercentageInput = (val) => {
  let discountAmount = (val.target.value / 100) * productsCategory.value.product.price;
  let result = productsCategory.value.product.price - discountAmount
  productsCategory.value.discount_price = result.toFixed(2)
}
const discountPriceInput = (val) => {
  let discountPercentage = ((Number(val.target.value) / productsCategory.value.product.price)) * 100
  console.log((Number(val.target.value) / productsCategory.value.product.price))
  productsCategory.value.discount_percentage = 100 - Number(discountPercentage.toFixed(0))
}
const productChange = (val) => {
  productsCategory.value.discount_price = val.price
}


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
const formatNumber = (val) => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
const formattedPrice = (val) => {
  const parts = val.toString().split('').reverse().join('').match(/.{1,3}/g).map(part => part.split('').reverse().join('')).reverse();
  const main = parts.shift();
  const thousands = parts.join('');
  return {
    main,
    thousands
  };
}

function openModal() {
  if (propData.editData.id) {
    productsCategory.value.discount_price = propData.editData.discount_price
    productsCategory.value.status = propData.editData.status
    productsCategory.value.product = propData.editData.product
    productsCategory.value.category = propData.editData.category
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
  productsCategory.value.discount_price = ''
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
        style="width:1000px"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("ChangeProduct") : $t('AddProduct') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4 flex items-center">
        <div class="w-2/3">

          <label>
            <p class=" mt-5 mb-1">{{ $t("products") }}:</p>
            <LazySelect
                id="model"
                v-model="productsCategory.product"
                :options="productStorage.productFromKnowledgeBase"
                :reduce="(name) => name"
                :getOptionLabel="(name) => name['title_'+$i18n.locale]"
                :fetch="productStorage.getProductFromKnowledgeBase"
                @update:modelValue="productChange"
                class="mt-1"
            />
            <!--            <v-select-->
            <!--                @update:modelValue="productChange"-->
            <!--                :options="productStorage.productFromKnowledgeBase.results"-->
            <!--                v-model="productsCategory.product"-->
            <!--                :getOptionLabel="(name) => name['title_'+$i18n.locale]"-->
            <!--                :reduce="(name) => name"-->
            <!--            >-->
            <!--              <template #no-options> {{ $t("no_matching_options") }}</template>-->
            <!--            </v-select>-->
            <p
                v-for="error in validate.product.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
          </label>

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
              <p style="margin-top:22px" class=" mt-4">{{ $t("category") }}:</p>
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
                  @input="discountPercentageInput"
                  v-model="productsCategory.discount_percentage"
              />
            </div>
            <div class="w-1/2">

              <p class=" mt-5 mb-1">{{ $t("Discounted_price") }}:</p>
              <input
                  type="number"
                  class="form-input"
                  @input="discountPriceInput"
                  v-model="productsCategory.discount_price"
              />

            </div>
          </div>
        </div>
        <div class="w-1/3 flex justify-center">

          <div v-if="productsCategory.product && productsCategory.product.image" class="card w-[200px]"
               style="position:relative;margin-top:40px;border-radius:12px">
            <p v-if="productsCategory.has_discount" class="productDiscount">
              {{ '- ' + productsCategory.discount_percentage + '%' }}</p>
            <img
                class="w-[200px]"
                :src="productsCategory.product.image"
                alt="image"
                style="aspect-ratio: 1/1 ;border-radius:12px"
            />
            <p style="font-size:15px;" class="mt-1 ">
              {{ productsCategory.product['title_' + $i18n.locale] }}
            </p>
            <p style="font-size:12px;color:#999999;margin-bottom:40px">{{ productsCategory.product.quantity }}
              {{ productsCategory.product.measurement_type['title_' + $i18n.locale] }}</p>
            <p class="priceProduct price-container" v-if="!productsCategory.has_discount">

              <span class="price-main dark:text-dark">{{ formattedPrice(productsCategory.product.price).main }}</span>
              <span style="display:flex ; flex-direction:column">
              <span class="price-thousands dark:text-dark">{{
                  formattedPrice(productsCategory.product.price).thousands
                }}</span>
              <span class="currency-symbol dark:text-dark">{{ $t('som') }}</span>
              </span>
            </p>
            <p class="priceProduct price-container" v-else>
              <span class="price-main dark:text-dark" v-if="productsCategory.discount_price">{{
                  formattedPrice(productsCategory.discount_price).main
                }}</span>
              <span style="display:flex ; flex-direction:column">
              <span class="price-thousands dark:text-dark" v-if="productsCategory.discount_price">{{
                  formattedPrice(productsCategory.discount_price).thousands
                }}</span>
              <span class="currency-symbol dark:text-dark" v-if="productsCategory.discount_price">{{ $t('som') }}</span>
              </span>
            </p>
            <p class="oldPrice dark:text-dark" v-if="productsCategory.has_discount">
              {{ formatNumber(productsCategory.product.price) }}
              <svg class="RectanglePrice" width="46" height="14" viewBox="0 0 46 14" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <rect y="12.3438" width="47" height="0.8" rx="0.4" transform="rotate(-15 0 12.3438)" fill="#1F1F1F"/>
              </svg>
            </p>
          </div>

          <div v-else
               class="card w-[200px] h-[285px] mt-2 flex  mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
            <div
                class=" mt-2 flex h-56 w-full mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
              <span class="font-medium dark:text-white">{{ $t("no_photo") }}</span>

            </div>
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

<style>
.price-container {
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
}

.price-main {
  font-size: 30px;
  font-weight: bold;
  color: black;
}

.price-thousands {
  position: absolute;
  top: 7px;
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin-left: 2px;
}

.currency-symbol {
  position: absolute;
  top: 28px;
  font-size: 13px;
  color: gray;
  margin-left: 8px;
}

.priceProduct {
  font-size: 20px;
  background-color: #FFDE00;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  padding: 5px 0 5px 18px;
}

.productDiscount {
  position: absolute;
  background-color: #009933;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 9px;
  color: white;
  left: 0;
  top: 0
}

.oldPrice {
  position: absolute;
  background-color: #FF7200;
  border-radius: 12px 0 12px 0;
  padding: 6px;
  bottom: 35px;
  right: 15px;
  color: white;
}

.RectanglePrice {
  position: absolute;
  bottom: 10px;
  width: 50px;
  color: black
}
</style>

