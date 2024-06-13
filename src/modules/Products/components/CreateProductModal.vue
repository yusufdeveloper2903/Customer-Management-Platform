<script lang="ts" setup>

//IMPORTED FILES
import productStore from '../store/index'
import {Ref, ref, computed, reactive} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import {useI18n} from 'vue-i18n'
import {toast} from "vue3-toastify";
import UIkit from "uikit";
import {EditDataFirst} from '../Interfaces/index'
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const propData = defineProps<{
  editData: EditDataFirst
}>();
const general = useSidebarStore()
const emits = defineEmits(["saveProducts"]);
const productStorage = productStore()
const {t} = useI18n()
const isSubmitted = ref<boolean>(false);
let productsCategory = ref({
  title_uz: '',
  title_ru: '',
  title_kr: '',
  title: '',
  id: '',
  status: 'DRAFT'
})
const Status = reactive([
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

//FUNCTIONS
const saveData = async () => {
  if (!productsCategory.value.title_uz) {
    general.tabs = 'UZ'
  } else if (!productsCategory.value.title_kr) {
    general.tabs = 'KR'
  } else if (!productsCategory.value.title_ru) {
    general.tabs = 'RU'
  }
  const success = await validate.value.$validate();
  if (!success) return;
  productsCategory.value.title = productsCategory.value.title_uz;
  isSubmitted.value = true
  if (propData.editData.id) {
    try {
      await productStorage.updateProductCategory(productsCategory.value)
      UIkit.modal("#create_and_edit_category").hide();
      emits("saveProducts");
      toast.success(t('updated_successfully'))
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
    productsCategory.value.title_uz = propData.editData.title_uz
    productsCategory.value.title_ru = propData.editData.title_ru
    productsCategory.value.title_kr = propData.editData.title_kr
    productsCategory.value.status = propData.editData.status
    productsCategory.value.id = String(propData.editData.id)
  }
}


const onHide = () => {
  general.tabs = 'UZ'
  productsCategory.value.title_uz = ""
  productsCategory.value.title_ru = ""
  productsCategory.value.title_kr = ""
  productsCategory.value.id = ''
  productsCategory.value.status = 'DRAFT'
  validate.value.$reset()

}


//COMPUTED
const rules = computed(() => {
  return {
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
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
          {{ propData.editData.id ? $t("ChangeCategoryProduct") : $t('AddCategoryProduct') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <ModalTabs>
          <ModalTab title="UZ">
            <form>
              <label>{{ t('name') + ' ' + t('UZ') }} </label>
              <input
                  type="text"
                  class="form-input"
                  v-model="productsCategory.title_uz"
                  :class="validate.title_uz.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>


            </form>
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label>{{ t('name') + ' ' + t('KR') }}</label>
              <input
                  type="text"
                  class="form-input"
                  v-model="productsCategory.title_kr"
                  :class="validate.title_kr.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_kr.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>


            </form>
          </ModalTab>


          <ModalTab title="RU">
            <form>
              <label for="nameRu">{{ t('name') + ' ' + t('RU') }}</label>
              <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  v-model="productsCategory.title_ru"
                  :class="validate.title_ru.$errors.length ? 'required-input' : ''"
              />
              <p
                  v-for="error in validate.title_ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </form>
          </ModalTab>
        </ModalTabs>
        <p class=" mt-4 ">{{ $t("Status") }}</p>
        <v-select
            class="category_product_select"
            :options="Status"
            :getOptionLabel="(role:any) => $t(`${role.title}`)"
            :reduce="(role:any) => role.value"
            v-model="productsCategory.status"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>


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
<style  lang="scss">
.category_product_select .vs__dropdown-menu {
  position: fixed;
  z-index: 9999; /* Set a high z-index value */
  left: 30px;
  top: 85px;
  width: 90%;
  height: 40%;
  overflow: auto;
  background-color: white;

}

.dark .category_product_select .vs__dropdown-menu {
  background-color: rgb(40 48 70 / var(--tw-bg-opacity));
}
</style>
