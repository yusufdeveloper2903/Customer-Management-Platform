<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import useVuelidate, {Validation} from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { QuantityType } from "@/modules/KnowledgeBase/interfaces/index"
import KnowledgeBase from "@/modules/KnowledgeBase/store/index";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const general = useSidebarStore()
const propData = defineProps<{ editData: QuantityType }>();
const emits = defineEmits(["savetype"]);
const store = KnowledgeBase()
const productData = ref<QuantityType>({
id: null,
title: "",
title_uz: "",
title_ru: "",
title_kr: "",
unique_name: ""
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

const validate: Ref<Validation> = useVuelidate(rules, productData);

//FUNCTIONS
async function openModal() {
  if (propData.editData.id) {
    productData.value.id = propData.editData.id
    productData.value.title_uz = propData.editData.title_uz
    productData.value.title_ru = propData.editData.title_ru
    productData.value.title_kr = propData.editData.title_kr


  } else {
    productData.value.id = null
    productData.value.title_uz = ""
    productData.value.title_ru = ""
    productData.value.title_kr = ""

  }
}

function hideModal() {
  productData.value.id = null
  productData.value.title_uz = ""
    productData.value.title_ru = ""
    productData.value.title_kr = ""
  validate.value.$reset()
}

const updateDeal = async () => {
  if (!productData.value.title_uz) {
    general.tabs = 'UZ'
  } else if (!productData.value.title_kr) {
    general.tabs = 'KR'
  } else if (!productData.value.title_ru) {
    general.tabs = 'RU'
  }

  productData.value.title = productData.value.title_uz
  productData.value.unique_name = productData.value.title_uz

  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateQuantityType(productData.value).then(() => {
        emits("savetype");
        setTimeout(() => {
          toast.success(t("updated_successfully"));
        }, 200);
        UIkit.modal("#type_modal").hide();
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
      await store.createQuantityType(productData.value).then(() => {
        emits("savetype");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        UIkit.modal("#type_modal").hide();
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
  <div id="type_modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal" >
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg "
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("Edit quantity type") : t('Add quantity type') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz"
              >{{ t('name') + ' ' + t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="productData.title_uz"
                    :class="validate.title_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label for="nameUz"
              >{{ t('name') + ' ' + t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="productData.title_kr"
                    :class="validate.title_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>

            </form>
          </ModalTab>

          <ModalTab title="RU">
            <form>
              <label for="nameRu"
              >{{ t('name') + ' ' + t('RU') }}
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    v-model="productData.title_ru"
                    :class="validate.title_ru.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                    v-for="error in validate.title_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>
          </ModalTab>
        </ModalTabs>

      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #type_modal" class="btn-secondary">
          {{ t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal" :disabled="isSubmitted">
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{ propData.editData.id ? t("Change") : t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
