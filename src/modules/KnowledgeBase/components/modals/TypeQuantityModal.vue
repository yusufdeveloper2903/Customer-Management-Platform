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



//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const propData = defineProps<{ editData: QuantityType }>();
const emits = defineEmits(["savetype"]);
const store = KnowledgeBase()
const productData = ref<QuantityType>({
id: null,
title: ""
})


// validations
const rules = computed(() => {
  return {
    title: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };

});

const validate: Ref<Validation> = useVuelidate(rules, productData);

//FUNCTIONS
async function openModal() {
  if (propData.editData.id) {
    productData.value.id = propData.editData.id
    productData.value.title = propData.editData.title


  } else {
    productData.value.id = null
    productData.value.title = ""

  }
}

function hideModal() {
  productData.value.id = null
  productData.value.title = ""
  validate.value.$reset()
}

const updateDeal = async () => {
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
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? t("Edit quantity type") : t('Add quantity type') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
            <form>
              <label for="nameRu">{{ t('name') }} 
                <input id="nameRu" type="text" class="form-input" :placeholder="t('name')" v-model="productData.title" :class="validate.title.$errors.length ? 'required-input' : ''"/>
                <p v-for="error in validate.title.$errors" :key="error.$uid" class="text-danger text-sm">
                  {{ t(error.$message) }}
                </p>
              </label>
            </form>

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
