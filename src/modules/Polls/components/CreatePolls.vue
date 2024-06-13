<script lang="ts" setup>


//IMPORTED FILES
import {computed, Ref, ref} from "vue";
import UIkit from "uikit";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";
import storagePolls from "../store";
import {EditData} from "../interfaces";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate, {Validation} from "@vuelidate/core";


//DECLARED VARIABLES
const {t} = useI18n();
const isSubmitted = ref<boolean>(false);
const store = storagePolls();
const emit = defineEmits(["refresh"]);
const propData = defineProps<{ editData: EditData | null }>();
let sectionStories = ref<EditData>({
  id: null,
  name: '',
  status: 'DRAFT',
});
const listStatus = ref([
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
function openModal() {
  if (propData.editData && propData.editData.id) {
    sectionStories.value.id = propData.editData?.id
    sectionStories.value.name = propData.editData?.name
    sectionStories.value.status = propData.editData?.status
  }
}

const hideModal = () => {
  validate.value.$reset()
  sectionStories.value.id = ''
  sectionStories.value.name = ''
  sectionStories.value.status = 'DRAFT'

}


const saveEdit = async () => {
  const success = await validate.value.$validate();
  if (!success) return;
  if (propData.editData && propData.editData.id) {
    try {
      await store.updatePolls(sectionStories.value)
      await UIkit.modal("#polls-modal").hide();
      toast.success(t("updated_successfully"));
      isSubmitted.value = false;
      emit("refresh");
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t("error"));
    }
  } else {
    try {
      await store.createPolls(sectionStories.value)
      await UIkit.modal("#polls-modal").hide();
      toast.success(t("created_successfully"));
      emit("refresh");
      isSubmitted.value = false;
    } catch (error: any) {
      isSubmitted.value = false;
      toast.error(t('error'));
    }
  }
};

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    },
    status: {
      required: helpers.withMessage("validation.this_field_is_required", required),
    }


  };

});

const validate: Ref<Validation> = useVuelidate(rules, sectionStories);
</script>

<template>
  <div id="polls-modal" class="uk-flex-top" uk-modal @shown="openModal" @hidden="hideModal">
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData && propData.editData.id ? $t("ChangePoll") : $t('AddPoll') }}
        </h2>
      </div>
      <div class="uk-modal-body py-4">
        <div>
          <label>{{ $t('name') }}</label>
          <input
              type="text"
              class="form-input"
              v-model="sectionStories.name"
              :class="validate.name.$errors.length ? 'required-input' : ''"
          />
          <p
              v-for="error in validate.name.$errors"
              :key="error.$uid"
              class="text-danger text-sm"
          >
            {{ $t(error.$message) }}
          </p>
        </div>
        <p class="mt-5">{{ $t("Status") }}</p>
        <v-select
            class="poll_select_chooser"
            :options="listStatus"
            v-model="sectionStories.status"
            :getOptionLabel="(name:any) => t(name.title)"
            :reduce="(item:any) => item.value"
            :class="validate.status.$errors.length ? 'required-input' : ''"
        >
          <template #no-options> {{ $t("no_matching_options") }}</template>
        </v-select>
        <p
            v-for="error in validate.status.$errors"
            :key="error.$uid"
            class="text-danger text-sm"
        >
          {{ $t(error.$message) }}
        </p>


      </div>

      <div
          class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #polls-modal" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>

        <button :class=" propData.editData  && propData.editData.id ? 'btn-warning' : 'btn-success'" @click="saveEdit"
                :disabled="isSubmitted">

          <span>{{ propData.editData && propData.editData.id ? $t("Change") : $t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style  lang="scss" >

.poll_select_chooser .vs__dropdown-menu {
  position: fixed;
  z-index: 9999; /* Set a high z-index value */
  left: 30px;
  top:53px;
  width: 90%;
  height: 40%;
  overflow: auto;
  background-color: white;

}

.dark .poll_select_chooser .vs__dropdown-menu {
  background-color: rgb(40 48 70 / var(--tw-bg-opacity));
}
</style>
