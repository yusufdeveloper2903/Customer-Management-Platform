<script lang="ts" setup>


//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";
import {NewsTemplate} from "../../interfaces";
import FileInput from "@/components/FileInput/FileInput.vue";
import {objectToFormData} from "@/mixins/formmatter";


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: NewsTemplate }>();
let newsTemplateData = ref<NewsTemplate>({
  id: null,
  title: '',
  title_ru: '',
  title_uz: '',
  title_kr: '',
  description: '',
  description_ru: '',
  description_kr: '',
  description_uz: '',
  file: null,
  url: "",
});


//FUNCTIONS
function openModal() {
  if (propData.editData.id) {
    newsTemplateData.value = propData.editData;
  }
}

const hideModal = () => {
  validate.value.$reset()
  newsTemplateData.value.title = ''
  newsTemplateData.value.title_ru = ''
  newsTemplateData.value.title_uz = ''
  newsTemplateData.value.title_kr = ''
  newsTemplateData.value.description = ''
  newsTemplateData.value.description_ru = ''
  newsTemplateData.value.description_kr = ''
  newsTemplateData.value.description_uz = ''
  newsTemplateData.value.file = null
  newsTemplateData.value.url = ""
}
const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  const {file, ...rest} = newsTemplateData.value;
  if (propData.editData.id) {
    try {
      const fd = objectToFormData({
        file: file || "",
        ...rest,
      });
      await store.updateNewsTemplate(fd)
      toast.success(t("updated_successfully"));
      emit("refresh");
      UIkit.modal("#news_template").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
            error.response || "Error"
        );
      }
    }
  } else {
    try {
      const fd = objectToFormData({
        file: file || "",
        ...rest,
      });
      await store.createNewsTemplate(fd)
      toast.success(t("created_successfully"));
      emit("refresh");
      UIkit.modal("#news_template").hide();
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
            error.response || "Error"
        );
      }
    }
  }
};

//COMPUTED
const rules = computed(() => {
  return {
    title_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    title_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    description_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, newsTemplateData);

</script>

<template>
  <div
      id="news_template"
      class="uk-flex-top"
      uk-modal
      @shown="openModal"
      @hidden="hideModal"
  >
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Edit") : $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <Tabs class="mb-4">
          <Tab title="UZ">
            <form>
              <label for="nameUz"
              >{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="newsTemplateData.title_uz"
                    :class="validate.title_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionUz"
              >{{ $t('description') + ' ' + $t('UZ') }}
                <input
                    id="descriptionUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('description')"
                    v-model="newsTemplateData.description_uz"
                    :class="validate.description_uz.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>
            </form>
          </Tab>
          <Tab title="KR">
            <form>
              <label for="nameUz"
              >{{ $t('name') + ' ' + $t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="newsTemplateData.title_kr"
                    :class="validate.title_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.title_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionUz"
              >{{ $t('description') + ' ' + $t('KR') }}
                <input
                    id="descriptionUz"
                    type="text"
                    class="form-input"
                    :placeholder="$t('description')"
                    v-model="newsTemplateData.description_kr"
                    :class="validate.description_kr.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_kr.$errors"
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
              <label for="nameRu"
              >{{ $t('name') + ' ' + $t('RU') }}
                <input
                    id="nameRu"
                    type="text"
                    class="form-input"
                    :placeholder="$t('name')"
                    v-model="newsTemplateData.title_ru"
                    :class="validate.title_ru.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                    v-for="error in validate.title_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionRu"
              >{{ $t('description') + ' ' + $t('RU') }}
                <input
                    id="descriptionRu"
                    type="text"
                    class="form-input"
                    :placeholder="$t('description')"
                    v-model="newsTemplateData.description_ru"
                    :class=" validate.description_ru.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                    v-for="error in validate.description_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>
            </form>
          </Tab>
        </Tabs>
        <label for="nameUz"
        >{{ $t('Link') }}
          <input
              id="nameUz"
              type="text"
              class="form-input mb-4"
              :placeholder="$t('Link')"
              v-model="newsTemplateData.url"
          />
        </label>

        <label
        >{{ $t('photo') }}
          <FileInput
              v-model="newsTemplateData.file"
              @remove="newsTemplateData.file = null"
              :typeModal="propData.editData.id"
              name="news-template"
          />
        </label>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #news_template" class="btn-secondary">
          {{ $t("Отмена") }}
        </button>

        <button
            :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'"
            @click="updateDeal"
        >
          <img
              src="@/assets/image/loading.svg"
              alt="loading.svg"
              class="inline w-4 h-4 text-white animate-spin mr-2"
              v-if="isSubmitted"
          />
          <span>{{
              propData.editData.id ? $t("Edit") : $t("Add")
            }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
