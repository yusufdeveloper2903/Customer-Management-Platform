<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import knowledgeBase from "../../store/index";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import {EditDataProductModal} from '../../interfaces/index'


//DECLARED VARIABLES
const propData = defineProps<{
  editData: EditDataProductModal
}>();
const imageDiv = ref<string | undefined | null | object>('')
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveProducts"]);
let productsData = ref({
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  quantity: "",
  price: '',
  photo: '',
  code: "",
  measurement_type: ''
})


//FUNCTIONS
const getFile = (event: any) => {
  productsData.value.photo = event.target.files[0]
  let input = event.target;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      imageDiv.value = e?.target?.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  const formData = new FormData()
  formData.append('title', productsData.value.title_uz)
  formData.append('title_uz', productsData.value.title_uz)
  formData.append('title_kr', productsData.value.title_kr)
  formData.append('title_ru', productsData.value.title_ru)
  formData.append('code', productsData.value.code)
  formData.append('quantity', productsData.value.quantity)
  formData.append('measurement_type', productsData.value.measurement_type)
  formData.append('price', productsData.value.price)
  formData.append('description', productsData.value.description_uz)
  formData.append('description_uz', productsData.value.description_uz)
  formData.append('description_kr', productsData.value.description_kr)
  formData.append('description_ru', productsData.value.description_ru)
  if (imageDiv.value) {
    formData.append('image', productsData.value.photo)
  }
  if (propData.editData.id) {
    try {
      formData.append('id', propData.editData.id)
      await store.updateProducts(formData)
      await UIkit.modal("#create_products").hide();
      emits("saveProducts");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await store.createProducts(formData)
      await UIkit.modal("#create_products").hide();
      toast.success(t("created_successfully"));
      emits("saveProducts");
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }
  }
};


function openModal() {
  if (propData.editData.id) {
    productsData.value.title_uz = propData.editData.title_uz
    productsData.value.title_ru = propData.editData.title_ru
    productsData.value.title_kr = propData.editData.title_kr
    productsData.value.description_ru = propData.editData.description_ru
    productsData.value.description_uz = propData.editData.description_uz
    productsData.value.description_kr = propData.editData.description_kr
    productsData.value.measurement_type = propData.editData.measurement_type
    productsData.value.quantity = propData.editData.quantity
    productsData.value.price = propData.editData.price
    productsData.value.code = propData.editData.code
    productsData.value.photo = propData.editData.image
  }
}


const onHide = () => {
  validate.value.$reset()
  productsData.value.title_uz = ""
  productsData.value.description_uz = ''
  productsData.value.description_ru = ''
  productsData.value.description_kr = ''
  productsData.value.measurement_type = ''
  productsData.value.quantity = ''
  productsData.value.title_ru = ""
  productsData.value.title_kr = ""
  productsData.value.price = ''
  productsData.value.photo = ""
  imageDiv.value = ""
  productsData.value.code = ""
  imageDiv.value = ''
  productsData.value.photo = ""
}


//COMPUTED
const rules = computed(() => {
  return {
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    code: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    price: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    photo: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    quantity: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    measurement_type: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    }

  };

});

const validate: Ref<Validation> = useVuelidate(rules, productsData);
</script>

<template>

  <div id="create_products" class="uk-flex-top" uk-modal @shown="openModal" @hidden="onHide">
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
        <Tabs>
          <Tab title="UZ">
            <label>{{ $t('name') + ' ' + $t('UZ') }}</label>
            <input
                type="text"
                class="form-input"
                :placeholder="$t('name')"
                v-model="productsData.title_uz"
                :class="validate.title_uz.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title_uz.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('UZ') }}
              <textarea
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('description')"
                  v-model="productsData.description_uz"
              />

            </label>
          </Tab>
          <Tab title="KR">
            <label>{{ $t('name') + ' ' + $t('KR') }}</label>
            <input
                type="text"
                class="form-input"
                :placeholder="$t('name')"
                v-model="productsData.title_kr"
                :class="validate.title_kr.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title_kr.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('KR') }}
              <textarea
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('description')"
                  v-model="productsData.description_kr"
              />

            </label>
          </Tab>
          <Tab title="RU">
            <label>{{ $t('name') + ' ' + $t('RU') }}</label>
            <input
                type="text"
                class="form-input"
                :placeholder="$t('name')"
                v-model="productsData.title_ru"
                :class="validate.title_ru.$errors.length ? 'required-input' : ''"
            />
            <p
                v-for="error in validate.title_ru.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            <label for="number" class="block mt-4">{{ $t('description') + ' ' + $t('RU') }}
              <textarea
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('description')"
                  v-model="productsData.description_ru"
              />

            </label>

          </Tab>
        </Tabs>
        <form>
          <div class="flex gap-4">
            <label class="w-full mt-4">{{ $t('Number (multi-digit-code)') }}
              <input
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('Number (multi-digit-code)')"
                  v-model="productsData.code"
                  :class="validate.code.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.code.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>

          </div>

          <div class="flex gap-4">

            <label class="mt-4  w-full">{{ $t('Quantity') }}
              <input
                  id="quantity"
                  type="number"
                  class="form-input"
                  :placeholder="$t('Quantity')"
                  v-model="productsData.quantity"
                  :class="validate.quantity.$errors.length ? 'required-input' : ''"
              />

            </label>
            <label class="w-full mt-4">{{ $t('Measurement_type') }}
              <input
                  id="number"
                  type="text"
                  class="form-input"
                  :placeholder="$t('Measurement_type')"
                  v-model="productsData.measurement_type"
                  :class="validate.measurement_type.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.measurement_type.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
            <label class="mt-4 w-full ">{{ $t('price') }}
              <input
                  id="price"
                  type="number"
                  class="form-input"
                  :placeholder="$t('price')"
                  v-model="productsData.price"
                  :class="validate.price.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.price.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
          </div>

        </form>
        <label class="mt-4 block" for="photo">{{ $t('photo') }}
          <input @change="getFile" id="fileInput" type="file"
                 class="form-file-input p-1"
                 :class="validate.photo.$errors.length  ? 'required-input' : ''"/>

        </label>
        <div v-if="propData.editData.image || imageDiv">
          <img v-if="propData.editData.image && !imageDiv"
               class="w-[100%] h-[200px] rounded object-contain mt-3"
               :src="propData.editData.image "
               alt="Rounded avatar"
          />
          <img v-else
               class="w-[100%] h-[200px] rounded object-contain mt-3"
               :src="imageDiv"
               alt="Rounded avatar"
          />

        </div>

      </div>

      <div
          class=" uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #create_products" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal"
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
