<script lang="ts" setup>
//IMPORTED FILES
import { Ref, ref, computed } from 'vue'
import UIkit from 'uikit'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue3-toastify'
import useVuelidate, { Validation } from '@vuelidate/core'
import ModalTabs from '@/components/Tab/ModalTabs.vue'
import ModalTab from '@/components/Tab/ModalTab.vue'
import { helpers, required } from '@vuelidate/validators'
import { RetseptCategory } from '@/modules/KnowledgeBase/interfaces/index'
import KnowledgeBase from '@/modules/KnowledgeBase/store/index'
import { useSidebarStore } from '@/stores/layoutConfig'

//DECLARED VARIABLES
const { t } = useI18n()
const general = useSidebarStore()
const isSubmitted = ref<boolean>(false)
const propData = defineProps<{ editData: RetseptCategory }>()
const emits = defineEmits(['saveCategory'])
const store = KnowledgeBase()
const categoryData = ref<RetseptCategory>({
  id: null,
  name: '',
  name_uz: '',
  name_ru: '',
  name_kr: '',
})

// validations
const rules = computed(() => {
  return {
    name_uz: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    name_ru: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
    name_kr: {
      required: helpers.withMessage(
        'validation.this_field_is_required',
        required
      ),
    },
  }
})

const validate: Ref<Validation> = useVuelidate(rules, categoryData)

//FUNCTIONS
async function openModal() {
  if (propData.editData.id) {
    categoryData.value.id = propData.editData.id
    categoryData.value.name_ru = propData.editData.name_ru
    categoryData.value.name_uz = propData.editData.name_uz
    categoryData.value.name_kr = propData.editData.name_kr
  } else {
    categoryData.value.id = null
    categoryData.value.name_ru = ''
    categoryData.value.name_uz = ''
    categoryData.value.name_kr = ''
  }
}

function hideModal() {
  categoryData.value.id = null
  categoryData.value.name_ru = ''
  categoryData.value.name_uz = ''
  categoryData.value.name_kr = ''
  validate.value.$reset()
}

const updateDeal = async () => {
  if (!categoryData.value.name_uz) {
    general.tabs = 'UZ'
  } else if (!categoryData.value.name_kr) {
    general.tabs = 'KR'
  } else if (!categoryData.value.name_ru) {
    general.tabs = 'RU'
  }

  const success = await validate.value.$validate()
  if (!success) return

  categoryData.value.name = categoryData.value.name_uz

  if (propData.editData.id) {
    try {
      await store.updateProductCategory(categoryData.value).then(() => {
        emits('saveCategory')
        setTimeout(() => {
          toast.success(t('updated_successfully'))
        }, 200)
        UIkit.modal('#products-categories-modal').hide()
      })

      isSubmitted.value = false
    } catch (error: any) {
      isSubmitted.value = false
      toast.error(
        error.response.message ||
          error.response.data.msg ||
          error.response.data.error ||
          t('error')
      )
    }
  } else {
    try {
      await store.createProductCategory(categoryData.value).then(() => {
        emits('saveCategory')
        setTimeout(() => {
          toast.success(t('created_successfully'))
        }, 200)
        UIkit.modal('#products-categories-modal').hide()
      })

      isSubmitted.value = false
    } catch (error: any) {
      if (error) {
        toast.error(
          error.response.message ||
            error.response.data.message ||
            error.response.data.error ||
            t('error')
        )
      }
      isSubmitted.value = false
    }
  }
}
</script>

<template>
  <div
    id="products-categories-modal"
    class="uk-flex-top"
    uk-modal
    @shown="openModal"
    @hidden="hideModal">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{
            propData.editData.id
              ? t('edit_recipe_category')
              : t('add_recipe_category')
          }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <form>
              <label for="nameUz"
                >{{ t('name') }} O'z
                <input
                  id="nameUz"
                  type="text"
                  class="form-input"
                  :placeholder="t('name')"
                  v-model="categoryData.name_uz"
                  :class="
                    validate.name_uz.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.name_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="KR">
            <form>
              <label for="nameRu"
                >{{ t('name') }} Ўз
                <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  :placeholder="t('name')"
                  v-model="categoryData.name_kr"
                  :class="
                    validate.name_kr.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.name_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu"
                >{{ t('name') }} Ру
                <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  :placeholder="t('name')"
                  v-model="categoryData.name_ru"
                  :class="
                    validate.name_ru.$errors.length ? 'required-input' : ''
                  " />
                <p
                  v-for="error in validate.name_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>
      </div>

      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button
          uk-toggle="target: #products-categories-modal"
          class="btn-secondary">
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
