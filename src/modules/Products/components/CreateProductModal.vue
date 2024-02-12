<script lang="ts" setup>

//Imported files
import productStore from '../store/index'
import {Ref, ref, computed} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
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
  title: {
    uz: string,
    ru: string
  },
  is_active: boolean

}

let productsCategory = ref({
  title: {
    uz: "",
    ru: ""
  },
  id: null,
  is_active: false
})


const saveData = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  isSubmitted.value = true
  if (propData.editData.id) {
    try {
      await productStorage.updateProductCategory(productsCategory.value)
      emits("saveProducts");
      UIkit.modal("#create_and_edit_category").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'))
    }

  } else {
    try {
      await productStorage.createProductCategory(productsCategory.value)
      UIkit.modal("#create_and_edit_category").hide();
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
    productsCategory.value.title.uz = propData.editData.title?.uz
    productsCategory.value.title.ru = propData.editData.title?.ru
    productsCategory.value.is_active = propData.editData.is_active
    productsCategory.value.id = propData.editData.id
  } else {
    productsCategory.value.title.uz = ""
    productsCategory.value.title.ru = ""
    productsCategory.value.id = null
    productsCategory.value.is_active = false

  }
}


const onHide = () => {
  productsCategory.value.title.uz = ""
  productsCategory.value.title.ru = ""
  productsCategory.value.id = null
  productsCategory.value.is_active = false
  validate.value.$reset()

}

const rules = computed(() => {
  return {
    title: {
      uz: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      },
      ru: {
        required: helpers.withMessage("validation.this_field_is_required", required),
      }
    },


  };

});

const validate: Ref<Validation> = useVuelidate(rules, productsCategory);

</script>

<template>
  <div id="create_and_edit_category" class="uk-flex-top" uk-modal @shown="openModal" @hidden="onHide">
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
            <form>
              <label>{{ t('name') }}
                <input
                    type="text"
                    class="form-input"
                    v-model="productsCategory.title.uz"
                    :class="validate.title.uz.$errors.length ? 'required-input' : ''"
                />

                <p
                    v-for="error in validate.title.uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </Tab>

          <Tab title="RU">
            <form>
              <label for="nameRu">{{ t('name') }}
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    v-model="productsCategory.title.ru"
                    :class="validate.title.ru.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title.ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

            </form>
          </Tab>
        </Tabs>
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
        <button uk-toggle="target: #create_and_edit_category" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button class="btn-success" @click="saveData">

          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          {{ $t('Add') }}
        </button>
      </div>
    </div>
  </div>
</template>
