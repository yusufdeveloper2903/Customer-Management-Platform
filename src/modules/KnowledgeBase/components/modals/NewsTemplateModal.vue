<script lang="ts" setup>
import { Ref, ref, computed } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import Tabs from "@/components/Tab/Tabs.vue";
import Tab from "@/components/Tab/Tab.vue";
import knowledgeBase from "../../store/index";
import { NewsTemplate } from "../../interfaces";
import FileInput from "@/components/FileInput/FileInput.vue";
import { objectToFormData } from "@/mixins/formmatter";

const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase();
const emit = defineEmits(["refresh"]);

var newsTemplateData = ref<NewsTemplate>({
  title: {
    uz: null,
    ru: null,
  },
  description: {
    uz: null,
    ru: null,
  },
  file: null,
  url: "",
});

const rules = computed(() => {
  return {
    title: {
      ru: {
        required: helpers.withMessage("required", required),
      },
      uz: {
        required: helpers.withMessage("required", required),
      },
    },
    description: {
      ru: {
        required: helpers.withMessage("required", required),
      },
      uz: {
        required: helpers.withMessage("required", required),
      },
    },
  };
});

const validate: Ref<Validation> = useVuelidate(rules, newsTemplateData);

const propData = defineProps<{ editData: NewsTemplate }>();
// const showModal = inject("showModal");

function openModal() {
  // это не правильный код !!!!
  if (propData.editData.id) {
    newsTemplateData.value = propData.editData;
  } else {
    newsTemplateData.value = {
      title: {
        uz: null,
        ru: null,
      },
      description: {
        uz: null,
        ru: null,
      },
      file: null,
      url: "",
    };
  }
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

  const { title, description, file, ...rest } = newsTemplateData.value;
  if (propData.editData.id) {
    try {
      const fd = objectToFormData({
        title: JSON.stringify(title),
        description: JSON.stringify(description),
        file: file || "",
        ...rest,
      });
      await store.updateProducts(fd).then(() => {
        setTimeout(() => {
          toast.success(t("updated_successfully"));
        }, 200);
        emit("refresh");
        UIkit.modal("#news_template").hide();
      });
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      if (error) {
        toast.error(
          // error.response.data.msg || error.response.data.error || "Error"
          error.response || "Error"
        );
      }
    }
  } else {
    try {
      const fd = objectToFormData({
        title: JSON.stringify(title),
        description: JSON.stringify(description),
        file: file || "",
        ...rest,
      });

      await store.createNewsTemplate(fd).then(() => {
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
        emit("refresh");
        UIkit.modal("#news_template").hide();
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
  <div
    id="news_template"
    class="uk-flex-top"
    uk-modal
    @shown="openModal"
    @hidden="validate.$reset()"
  >
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("edit") : $t("Add") }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
        <Tabs class="mb-4">
          <Tab title="Uz">
            <form>
              <label for="nameUz"
                >Nomi
                <input
                  id="nameUz"
                  type="text"
                  class="form-input"
                  placeholder="Nomi"
                  v-model="newsTemplateData.title.uz"
                  :class="
                    validate.title.uz.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                  v-for="error in validate.title.uz.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionUz"
                >Tavsif
                <input
                  id="descriptionUz"
                  type="text"
                  class="form-input"
                  placeholder="Tavsif"
                  v-model="newsTemplateData.description.uz"
                  :class="
                    validate.description.uz.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                  v-for="error in validate.description.uz.$errors"
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
                >Заголовок
                <input
                  id="nameRu"
                  type="text"
                  class="form-input"
                  placeholder="Заголовок"
                  v-model="newsTemplateData.title.ru"
                  :class="
                    validate.title.ru.$errors.length ? 'required-input' : ''
                  "
                />
                <p
                  v-for="error in validate.title.ru.$errors"
                  :key="error.$uid"
                  class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>

              <label class="mt-4 block" for="descriptionRu"
                >Описание
                <input
                  id="descriptionRu"
                  type="text"
                  class="form-input"
                  placeholder="Описание"
                  v-model="newsTemplateData.description.ru"
                  :class="
                    validate.description.ru.$errors.length
                      ? 'required-input'
                      : ''
                  "
                />
                <p
                  v-for="error in validate.description.ru.$errors"
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
            placeholder="Nomi"
            v-model="newsTemplateData.url"
          />
        </label>

        <label
          >{{ $t('photo') }}
          <FileInput
            v-model="newsTemplateData.file"
            @remove="newsTemplateData.file = null"
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
          :class="propData.editData.id ? 'btn-warning' : 'btn-success'"
          @click="updateDeal"
        >
          <img
            src="@/assets/image/loading.svg"
            alt="loading.svg"
            class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted"
          />
          <span>{{
            propData.editData.id ? $t("edit") : $t("Add")
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
