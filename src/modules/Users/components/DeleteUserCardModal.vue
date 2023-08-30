<script setup lang="ts">
import { toast } from "vue3-toastify";
import { useI18n } from 'vue-i18n';
import users from "../store/index";

const store = users();
const { locale, t } = useI18n()

interface PropsCard {
  cardId: any;
}

const props = defineProps<PropsCard>();
const emits = defineEmits(["deleteUserCard"]);
const deleteUserCard = () => {
  store.deleteUserCard(props.cardId).then(() => {
    emits("deleteUserCard");
    toast.success(t('deleted_successfully'));
  });
};
</script>

<template>
  <div id="card-delete-modal" class="uk-flex-top" uk-modal>
    <div
      class="uk-modal-dialog uk-margin-auto-vertical uk-border-rounded overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t('deletion') }}
        </h2>
      </div>
      <div class="uk-modal-body">
        <p>Do you realy want to delete this card</p>
      </div>
      <div
        class="uk-modal-footer flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #card-delete-modal" class="btn-secondary">
          {{ $t('Cancel') }}
        </button>
        <button
          uk-toggle="target: #card-delete-modal"
          class="rounded-md btn-danger px-6 py-2 text-white duration-100 hover:opacity-90"
          @click="deleteUserCard"
        >
          {{ $t('delete') }}
        </button>
      </div>
    </div>
  </div>
</template>
