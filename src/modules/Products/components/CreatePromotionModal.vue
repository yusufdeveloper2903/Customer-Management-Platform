<script lang="ts" setup>

//Imported files

import {Ref, ref, computed} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";

defineEmits(["saveSmsTemplate"]);
defineProps<{ editData: EditData }>();

//Declared variables

const isSubmitted = ref<boolean>(false);

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },
  description: {
    uz: string,
    ru: string
  },
}

let smsTemplateData = ref({
  title: {
    uz: "",
    ru: ""
  },
  description: {
    uz: "",
    ru: ""
  },

})

const rules = computed(() => {
  return {
    title: {
      required: helpers.withMessage("required", required),
    },

    description: {
      required: helpers.withMessage("required", required),
    },

  };

});

const validate: Ref<Validation> = useVuelidate(rules, smsTemplateData);

</script>

<template>
  <div id="discounts" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <Tabs>
          <Tab title="Uz">
            <form>
              <label for="nameUz">Nomi
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    placeholder="Nomi"
                    :class="validate.title.$errors.length ? 'required-input' : ''"
                />

                <p
                    class="text-danger text-sm"
                >
                </p>
              </label>


              <label class="mt-4 block" for="descriptionUz">Tavsif
                <input
                    id="descriptionUz"
                    type="text"
                    class="form-input"
                    placeholder="Tavsif"
                    :class="validate.description.$errors.length ? 'required-input' : ''"
                />

                <p
                    class="text-danger text-sm"
                >
                </p>
              </label>
            </form>
          </Tab>

          <Tab title="Ru">
            <form>
              <label for="nameRu">Заголовок
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    placeholder="Заголовок"
                    :class="validate.title.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionRu">Описание
                <input
                    id="descriptionRu"
                    type="text"
                    class="form-input"
                    :placeholder="$t('description')"
                    :class="validate.description.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.description.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>
            </form>
          </Tab>
        </Tabs>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #discounts" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button class="btn-success">

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
