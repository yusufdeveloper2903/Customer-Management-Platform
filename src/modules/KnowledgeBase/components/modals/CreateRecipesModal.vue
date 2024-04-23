<script lang="ts" setup>
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";

const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveRecipes"]);

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  },

}

let recipes = ref({
  title: {
    uz: "",
    ru: ""
  },
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
  };

});

const validate: Ref<Validation> = useVuelidate(rules, recipes);

const propData = defineProps<{ editData: EditData }>();


function openModal() {
  if (propData.editData.id) {
    recipes.value.title.uz = propData.editData.title.uz
    recipes.value.title.ru = propData.editData.title.ru
  }
}

function clearData() {
    recipes.value.title.uz = ""
    recipes.value.title.ru = ""
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateSmsTemplate({id: propData.editData.id, ...recipes.value})
      emits("saveRecipes");
      toast.success(t("updated_successfully"));
      UIkit.modal("#create_recipes").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(
          error.response || "Error"
      );
    }

  } else {
    try {
      await store.createSmsTemplate(recipes.value).then(() => {
        emits("saveRecipes");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        UIkit.modal("#create_recipes").hide();
      });
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
            // error.response || error.response.data.msg || error.response.data.error || "Error"
            error.response || "Error"
        );
      }
    }
  }
};
</script>

<template>
  <div id="create_recipes" class="uk-flex-top" uk-modal @shown="openModal">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" @click="clearData" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
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
                    v-model="recipes.title.uz"
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

          <Tab title="Ru">
            <form>
              <label for="nameRu">Заголовок
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    placeholder="Заголовок"
                    v-model="recipes.title.ru"
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
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #create_recipes" class="btn-secondary" @click="clearData">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal"
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
