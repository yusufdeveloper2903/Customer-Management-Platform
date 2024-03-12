<script lang="ts" setup>
const emit = defineEmits(['deleteAction'])
const props = defineProps(['id'])
</script>


<template>
  <div :id="props.id" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical uk-border-rounded overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("delete") }}
        </h2>
      </div>
      <div class="uk-modal-body">
        <p>{{ $t("are_you_really_going_to_delete_this_user") }}</p>
      </div>
      <div
          class="uk-modal-footer flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button class="btn-secondary uk-modal-close">
          {{ $t("Cancel") }}
        </button>
        <button
            class="rounded-md btn-danger px-6 py-2 text-white duration-100 hover:opacity-90"
            @click="emit('deleteAction')"
        >
          {{ $t("delete") }}
        </button>
      </div>
    </div>
  </div>
</template>
