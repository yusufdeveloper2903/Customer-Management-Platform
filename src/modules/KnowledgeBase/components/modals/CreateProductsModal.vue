<script lang="ts" setup>
import { Ref, ref, computed } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import knowledgeBase from "../../store/index";

const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const file = ref<string | null>(null)
const emits = defineEmits(["saveProducts"]);

interface EditData {
  id: number | null,
  title: {
      uz: string,
      ru: string
    },
    image: null | string,
    code: string
}

var productsData = ref({
    title: {
      uz: "",
      ru: ""
    },
    photo: null,
    code: ""
})

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
    code: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    photo: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    }
  };
  
});

const propData = defineProps<{editData: EditData}>();
const validate: Ref<Validation> = useVuelidate(rules, productsData);

  const getFile = (e: any) => {
    productsData.value.photo = e.target.files[0]
    file.value = e.target.files[0]
  }

  const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  const formData = new FormData()
  if(file.value){
    formData.append('title', JSON.stringify(productsData.value.title))
    formData.append('code', productsData.value.code)
    formData.append('image', productsData.value.photo)
  } else {
    formData.append('title', JSON.stringify(productsData.value.title))
    formData.append('code', productsData.value.code)
  }


  if (propData.editData.id) {    
    try {
        formData.append('id', propData.editData.id)
        await store.updateProducts(formData).then(() => {
          emits("saveProducts");
          UIkit.modal("#create_products").hide();
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            error.response.message || "Error"

          );
        }
      }
    
  } else {
      try {
        await store.createProducts(formData).then(() => {

          UIkit.modal("#create_products").hide();
          emits("saveProducts");
          setTimeout(() => {
            toast.success(t("created_successfully"));
          }, 200);
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            error.response.message || "Error"
          );
        }
      }
  }
};


function openModal(){
  if(propData.editData.id){
    productsData.value.title.uz = propData.editData.title.uz
    productsData.value.title.ru = propData.editData.title.ru
    productsData.value.photo = propData.editData.image
    productsData.value.code = propData.editData.code
  } else {
    productsData.value.title.uz = ""
    productsData.value.title.ru = ""
    productsData.value.photo = null
    productsData.value.code = ""
  }
}

</script>

<template>
    
  <div id="create_products" class="uk-flex-top" uk-modal @shown="openModal" @hidden="validate.$reset()">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
            <form>
              <label for="number" class="block">{{ $t('Number (multi-digit-code)') }}
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

          <div class="flex items-center gap-4 mt-4">
                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") }} RU</label>
                    <div class="uk-form-controls">
                        <input
                id="name_ru"
                type="text"
                class="form-input"
                :placeholder="$t('name') + ' RU'"
                v-model="productsData.title.ru"
                :class="validate.title.ru.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.title.ru.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
                    </div>
                  </div>

                  <div class="w-full">
                    <label for="form-stacked-text">{{ $t("name") }} UZ</label>
                    <div class="uk-form-controls">
                        <input
                id="name_uz"
                type="text"
                class="form-input"
                :placeholder="$t('name') + ' UZ'"
                v-model="productsData.title.uz"
                :class="validate.title.uz.$errors.length ? 'required-input' : ''"
              />
              <p
              v-for="error in validate.title.uz.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
                    </div>
                  </div>
                </div>

            <label class="mt-4 block" for="photo">{{ $t('photo') }}
              <input
                id="photo"
                type="file"
                class="form-file-input"
                @input="getFile"
                @remove="productsData.photo = null, file = null"
          />
              <p
              v-for="error in validate.photo.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
            >
              {{ $t(error.$message) }}
            </p>
            </label>
            </form>
      </div>

      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #create_products" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal" :disabled="isSubmitted">
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
