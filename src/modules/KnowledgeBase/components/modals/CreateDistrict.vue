<script lang="ts" setup>

//IMPORTED FILES
import {Ref, ref, computed} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";
import ModalTabs from "@/components/Tab/ModalTabs.vue";
import ModalTab from "@/components/Tab/ModalTab.vue";
import knowledgeBase from "../../store/index";
import {EditDistrict} from '../../interfaces/index'
import {useSidebarStore} from '@/stores/layoutConfig'

//DECLARED VARIABLES
const {t} = useI18n();
const general = useSidebarStore()
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveDistrict"]);
const propData = defineProps<{
  editData: EditDistrict
}>();
let districtData = ref({
  name: '',
  name_ru: '',
  name_uz: '',
  name_kr: '',
  parent: null
})


async function openModal () {
    await store.getRegions()
  if (propData.editData.id) {
    districtData.value.name_uz = propData.editData.name_uz
    districtData.value.name_ru = propData.editData.name_ru
    districtData.value.name_kr = propData.editData.name_kr
    districtData.value.parent = propData.editData.parent.id
  }
}

function hideModal() {
  validate.value.$reset()
  general.tabs = 'UZ'
  districtData.value.name_uz = ''
  districtData.value.name_ru = ''
  districtData.value.name_kr = ''
  districtData.value.parent = null
}

const updateDeal = async () => {
  if (!districtData.value.name_uz) {
    general.tabs = 'UZ'
  } else if (!districtData.value.name_kr) {
    general.tabs = 'KR'
  } else if (!districtData.value.name_ru) {
    general.tabs = 'RU'
  }
  districtData.value.name = districtData.value.name_uz
  const success = await validate.value.$validate();
  if (!success) return;

  if (propData.editData.id) {
    try {
      await store.updateRegions({id: propData.editData.id, ...districtData.value})
      await UIkit.modal("#district").hide();
      emits("saveDistrict");
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }

  } else {
    try {
      await store.createRegions(districtData.value)
      await UIkit.modal("#district").hide();
      emits("saveDistrict");
      toast.success(t("created_successfully"));
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  }
};


//COMPUTED
const rules = computed(() => {
  return {
    name_uz: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name_kr: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    name_ru: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    parent: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },

  };

});

const validate: Ref<Validation> = useVuelidate(rules, districtData);
</script>

<template>
  <div id="district" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("edit_district") : $t('add_district') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <ModalTabs class="mb-4">
          <ModalTab title="UZ">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('UZ') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="districtData.name_uz"
                    :class="validate.name_uz.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_uz.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </ModalTab>
          <ModalTab title="KR">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('KR') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="districtData.name_kr"
                    :class="validate.name_kr.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_kr.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </ModalTab>
          <ModalTab title="RU">
            <form>
              <label for="nameUz">{{ $t('name') + ' ' + $t('RU') }}
                <input
                    id="nameUz"
                    type="text"
                    class="form-input"
                    v-model="districtData.name_ru"
                    :class="validate.name_ru.$errors.length ? 'required-input' : ''"
                />
                <p
                    v-for="error in validate.name_ru.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>
              </label>


            </form>
          </ModalTab>
        </ModalTabs>

        <div class="w-full mt-4">
                <p class="mt-5">{{ $t("region") }}</p>
                <v-select
                v-model="districtData.parent"
                    :options="store.regionsList.results"
                    :getOptionLabel="(name:any) => name.name"
                    :reduce="(name:any) => name.id"

                >
                  <template #no-options> {{ $t("no_matching_options") }}</template>
                </v-select>
                <p
                    v-for="error in validate.parent.$errors"
                    :key="error.$uid"
                    class="text-danger text-sm"
                >
                  {{ $t(error.$message) }}
                </p>

              </div>
      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #district" class="btn-secondary">
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
