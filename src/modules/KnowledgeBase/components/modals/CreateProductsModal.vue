label
<script lang="ts" setup>
//IMPORTED FILES
import { Ref, ref, computed, watch } from 'vue'
import UIkit from 'uikit'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue3-toastify'
import { helpers, minLength, maxLength, required } from '@vuelidate/validators'
import useVuelidate, { Validation } from '@vuelidate/core'
import knowledgeBase from '../../store/index'
import ModalTabs from '@/components/Tab/ModalTabs.vue'
import ModalTab from '@/components/Tab/ModalTab.vue'
import { EditDataProductModal } from '../../interfaces/index'
import { objectToFormData } from '@/mixins/formmatter'
import { useSidebarStore } from '@/stores/layoutConfig'
import FileInput from '@/components/FileInput/FileInput.vue'

//DECLARED VARIABLES
const propData = defineProps<{
  editData: EditDataProductModal
}>()
const general = useSidebarStore()
const imageDiv = ref<string | undefined | null | object>('')
const { t } = useI18n()
const isSubmitted = ref<boolean>(false)
const store = knowledgeBase()
const emits = defineEmits(['saveProducts'])
const savedImage = ref('')
let productsData = ref({
  id: '',
  title: '',
  title_uz: '',
  title_kr: '',
  title_ru: '',
  description: '',
  description_uz: '',
  description_kr: '',
  description_ru: '',
  quantity: '',
  price: '',
  image: '',
  code: '',
  measurement_type: '',
  category: null,
})

//FUNCTIONS
store.getQuantityType({ page_size: 1000 })
const getFile = (event: any) => {
  productsData.value.image = event.target.files[0]
  let input = event.target

  if (event.target.files[0]) {
    savedImage.value = event.target.files[0]
  }
  if (input.files && input.files[0]) {
    let reader = new FileReader()
    reader.onload = (e) => {
      imageDiv.value = e?.target?.result
    }
    reader.readAsDataURL(input.files[0])
  }
}
const updateDeal = async () => {
  if (!productsData.value.title_uz && !productsData.value.description_uz) {
    general.tabs = 'UZ'
  } else if (
    !productsData.value.title_kr &&
    !productsData.value.description_kr
  ) {
    general.tabs = 'KR'
  } else if (
    !productsData.value.title_ru &&
    !productsData.value.description_ru
  ) {
    general.tabs = 'RU'
  }
  if (
    productsData.value.measurement_type &&
    productsData.value.measurement_type.id
  ) {
    productsData.value.measurement_type = productsData.value.measurement_type.id
  }

  if (
    typeof productsData.value.category === 'object' &&
    productsData.value.category !== null
  ) {
    productsData.value.category = productsData.value.category.id
  }

  const success = await validate.value.$validate()
  if (!success) return
  const fd = objectToFormData(['image'], productsData.value)
  if (propData.editData.id) {
    try {
      await store.updateProducts(fd)
      await UIkit.modal('#create_products').hide()
      emits('saveProducts')
      toast.success(t('updated_successfully'))
      isSubmitted.value = false
    } catch (error: any) {
      isSubmitted.value = false
      toast.error(t('error'))
    }
  } else {
    try {
      await store.createProducts(fd)
      await UIkit.modal('#create_products').hide()
      toast.success(t('created_successfully'))
      emits('saveProducts')
      isSubmitted.value = false
    } catch (error: any) {
      isSubmitted.value = false
      toast.error(t('error'))
    }
  }
}

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
    productsData.value.image = propData.editData.image
    productsData.value.id = propData.editData.id
    productsData.value.category = propData.editData.category
  }
}

const onHide = () => {
  validate.value.$reset()
  general.tabs = 'UZ'
  productsData.value.title_uz = ''
  productsData.value.description_uz = ''
  productsData.value.description_ru = ''
  productsData.value.description_kr = ''
  productsData.value.measurement_type = ''
  productsData.value.quantity = ''
  productsData.value.title_ru = ''
  productsData.value.title_kr = ''
  productsData.value.price = ''
  productsData.value.image = ''
  productsData.value.id = ''
  productsData.value.code = ''
  productsData.value.category = null
  imageDiv.value = ''
  ;(document.getElementById(`fileInput`) as HTMLInputElement).value = ''
}

watch(
  () => productsData.value.image,
  (val) => {
    if (!val) {
      productsData.value.image = savedImage.value
    }
  }
)

//COMPUTED
const rules = computed(() => {
  return {
    title_uz: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    title_kr: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    title_ru: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    code: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
      minLength: helpers.withMessage('codeCountSmall', minLength(13)),
      maxLength: helpers.withMessage('codeCountBigger', maxLength(13)),
    },
    price: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    image: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    quantity: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    category: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    measurement_type: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
  }
})

const validate: Ref<Validation> = useVuelidate(rules, productsData)
</script>

<template>
  <div
    id="create_products"
    class="uk-flex-top"
    uk-modal
    @shown="openModal"
    @hidden="onHide">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t('ChangeProduct') : $t('AddProduct') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <label>{{ $t('name') + ' ' + $t('UZ') }}</label>
            <input
              type="text"
              class="form-input"
              v-model="productsData.title_uz"
              :class="
                validate.title_uz.$errors.length ? 'required-input' : ''
              " />
            <p
              v-for="error in validate.title_uz.$errors"
              :key="error.$uid"
              class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
            <label for="number" class="block mt-4"
              >{{ t('description') + ' ' + t('UZ') }}
              <textarea
                id="number"
                type="text"
                class="form-input"
                v-model="productsData.description_uz" />
            </label>
          </ModalTab>
          <ModalTab title="KR">
            <label>{{ $t('name') + ' ' + $t('KR') }}</label>
            <input
              type="text"
              class="form-input"
              v-model="productsData.title_kr"
              :class="
                validate.title_kr.$errors.length ? 'required-input' : ''
              " />
            <p
              v-for="error in validate.title_kr.$errors"
              :key="error.$uid"
              class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
            <label for="number" class="block mt-4"
              >{{ t('description') + ' ' + t('KR') }}
              <textarea
                id="number"
                type="text"
                class="form-input"
                v-model="productsData.description_kr" />
            </label>
          </ModalTab>
          <ModalTab title="RU">
            <label>{{ $t('name') + ' ' + $t('RU') }}</label>
            <input
              type="text"
              class="form-input"
              v-model="productsData.title_ru"
              :class="
                validate.title_ru.$errors.length ? 'required-input' : ''
              " />
            <p
              v-for="error in validate.title_ru.$errors"
              :key="error.$uid"
              class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
            <label for="number" class="block mt-4"
              >{{ t('description') + ' ' + t('RU') }}
              <textarea
                id="number"
                type="text"
                class="form-input"
                v-model="productsData.description_ru"></textarea>
            </label>
          </ModalTab>
        </ModalTabs>
        <form>
          <label class="block mt-4 w-full">
            {{ $t('product_categories') }}
            <LazySelect
              id="model"
              v-model="productsData.category"
              :options="store.productCategories"
              :reduce="(el) => el"
              :getOptionLabel="(v) => v.name || ''"
              :fetch="store.getProductsCategories"
              class="mt-1" />
            <p
              v-for="error in validate.category.$errors"
              :key="error.$uid"
              class="text-danger text-sm">
              {{ t(error.$message) }}
            </p>
          </label>

          <div class="flex gap-4">
            <label class="w-full mt-4"
              >{{ t('Number (multi-digit-code)') }}
              <input
                v-maska
                data-maska="#############"
                id="number"
                type="number"
                class="form-input"
                v-model="productsData.code"
                :class="validate.code.$errors.length ? 'required-input' : ''" />
              <p
                v-for="error in validate.code.$errors"
                :key="error.$uid"
                class="text-danger text-sm">
                {{ t(error.$message) }}
              </p>
            </label>
          </div>

          <div class="flex gap-4">
            <label class="mt-4 w-full"
              >{{ t('Quantity') }}
              <input
                id="quantity"
                type="number"
                class="form-input"
                v-model="productsData.quantity"
                :class="
                  validate.quantity.$errors.length ? 'required-input' : ''
                " />
              <p
                v-for="error in validate.quantity.$errors"
                :key="error.$uid"
                class="text-danger text-sm">
                {{ t(error.$message) }}
              </p>
            </label>
            <label class="w-full mt-4"
              >{{ t('Measurement_type') }}
              <v-select
                id="type"
                :options="store.quantityTypeList.results"
                :get-option-label="(item:any) => item.title"
                class="mb-4"
                :class="
                  validate.measurement_type.$errors.length
                    ? 'required-input'
                    : ''
                "
                :reduce="(item:any)=>item.id"
                v-model="productsData.measurement_type">
                <template #no-options>
                  {{ $t('no_matching_options') }}</template
                >
              </v-select>
              <p
                v-for="error in validate.measurement_type.$errors"
                :key="error.$uid"
                class="text-danger text-sm">
                {{ $t(error.$message) }}
              </p>
            </label>
            <label class="mt-4 w-full"
              >{{ t('price') }}
              <input
                id="price"
                type="number"
                class="form-input"
                v-model="productsData.price"
                :class="
                  validate.price.$errors.length ? 'required-input' : ''
                " />
              <p
                v-for="error in validate.price.$errors"
                :key="error.$uid"
                class="text-danger text-sm">
                {{ t(error.$message) }}
              </p>
            </label>
          </div>
        </form>
        <div class="mt-4">
          <label> {{ $t('photo') }}</label>
          <FileInput
            v-model="productsData.image"
            @remove="productsData.image = null"
            :typeModal="propData.editData.id"
            name="stories-modal-input" />
          <p
            v-for="error in validate.image.$errors"
            :key="error.$uid"
            class="text-danger text-sm">
            {{ $t(error.$message) }}
          </p>
        </div>
      </div>

      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #create_products" class="btn-secondary">
          {{ t('Cancel') }}
        </button>

        <button
          :class="
            propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'
          "
          @click="updateDeal"
          :disabled="isSubmitted">
          <img
            src="@/assets/image/loading.svg"
            alt="loading.svg"
            class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted" />
          <span>{{ propData.editData.id ? t('Change') : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
