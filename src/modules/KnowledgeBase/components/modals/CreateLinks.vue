<script lang="ts" setup>
import { Ref, ref, computed, watch } from "vue";
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import knowledgeBase from "../../store/index";

const { t } = useI18n();
const store = knowledgeBase()
const isSubmitted = ref<boolean>(false);
const emits = defineEmits(["saveContact"]);

const linktype = [
  {
    id: 1,
    type: "website",
    name: "Website"
  },
  {
    id: 2,
    type: "telegram",
    name: "Telegram"
  },
  {
    id: 3,
    type: "instagram",
    name: "Instagram"
  },
  {
    id: 4,
    type: "facebook",
    name: "Facebook"
  },
  {
    id: 5,
    type: "twitter",
    name: "Twitter"
  },
  {
    id: 6,
    type: "tiktok",
    name: "TikTok"
  },
]

const rules = computed(() => {
  return {
    type: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    url: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
  };
});


interface EditLink {
  id: null | number,
  type: string | number,
  url: string
}

const editData = ref({
  type: "",
  url: ""
})

const propData = defineProps<{ editData: EditLink }>();
const validate: Ref<Validation> = useVuelidate(rules, editData);


const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  if (propData.editData.id) {
    try {
      await store.updateSocialMediaLinks({ id: propData.editData.id, data: editData.value }).then(() => {
        emits("saveContact");
        UIkit.modal("#links").hide();
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
      await store.createSocialMediaLinks(editData.value).then(() => {

        UIkit.modal("#links").hide();
        emits("saveContact");
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

function openModal() {
  if (propData.editData.id) {
    editData.value.type = propData.editData.id
    editData.value.url = propData.editData.url
  } else {
    editData.value.type = ""
    editData.value.url = ""
  }
}
</script>

<template>
  <div id="links" class="uk-flex-top" uk-modal @shown="openModal" @hidden="validate.$reset()">
    <div class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden">
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">

        <!-- <form> -->
        <label>
          <p class=" mt-5 mb-1">{{ $t("type") }}:</p>
          <v-select id="type" :options="linktype" :get-option-label="(name) => name.name" :placeholder="$t('type')"
            class="mb-4" :class="validate.type.$errors.length ? 'required-input' : ''" :reduce="name => name.type"
            v-model="editData.type">
            <template #no-options> {{ $t("no_matching_options") }}</template>
          </v-select>
          <p v-for="error in validate.type.$errors" :key="error.$uid" class="text-danger text-sm">
            {{ $t(error.$message) }}
          </p>
        </label>


        <label for="url">{{ $t('url') }}:</label>
        <input id="url" type="text" class="form-input" :placeholder="$t('url')"
          :class="validate.url.$errors.length ? 'required-input' : ''" v-model="editData.url" />
        <p v-for="error in validate.url.$errors" :key="error.$uid" class="text-danger text-sm">
          {{ $t(error.$message) }}
        </p>
        <!-- </form> -->
      </div>

      <div class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white">
        <button uk-toggle="target: #links" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning mr-2' : 'btn-success mr-2'" @click="updateDeal"
          :disabled="isSubmitted">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted" />
          <span>{{ propData.editData.id ? $t("Change") : $t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.vs__dropdown-menu {
  max-height: 150px;
}

</style>
