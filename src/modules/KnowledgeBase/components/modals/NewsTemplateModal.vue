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

const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase();
const emits = defineEmits(["saveSmsTemplate"]);

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
      required: helpers.withMessage("required", required),
    },
    // title_ru: {
    //   required: helpers.withMessage("required", required),
    // },
    description: {
      required: helpers.withMessage("required", required),
    },
    url: {
      required: helpers.withMessage("required", required),
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

  if (propData.editData.id) {
    try {
      await store
        .updateSmsTemplate({
          id: propData.editData.id,
          ...newsTemplateData.value,
        })
        .then(() => {
          emits("saveSmsTemplate");
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
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
      await store.createNewsTemplate(newsTemplateData.value).then(() => {
        emits("saveSmsTemplate");
        setTimeout(() => {
          toast.success(t("created_successfully"));
        }, 200);
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
  <div id="news_template" class="uk-flex-top" uk-modal @shown="openModal">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Изменения") : $t("Добавления") }}
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

              <label class="mt-4 block" for="descriptionUz"
                >Tavsif
                <input
                  id="descriptionUz"
                  type="text"
                  class="form-input"
                  placeholder="Tavsif"
                  v-model="newsTemplateData.description.uz"
                  :class="
                    validate.description.$errors.length ? 'required-input' : ''
                  "
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

              <label class="mt-4 block" for="descriptionRu"
                >Описание
                <input
                  id="descriptionRu"
                  type="text"
                  class="form-input"
                  placeholder="Описание"
                  v-model="newsTemplateData.description.ru"
                  :class="
                    validate.description.$errors.length ? 'required-input' : ''
                  "
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
        <label for="nameUz"
          >Линк
          <input
            id="nameUz"
            type="text"
            class="form-input"
            placeholder="Nomi"
            v-model="newsTemplateData.url"
            :class="validate.url.$errors.length ? 'required-input' : ''"
          />
          <p
            v-for="error in validate.url.$errors"
            :key="error.$uid"
            class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
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
            propData.editData.id ? $t("Изменить") : $t("Добавить")
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
