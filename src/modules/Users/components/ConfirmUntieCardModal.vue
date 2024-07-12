<template>
  <div id="untie-card-confirm-modal" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical uk-border-rounded overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close/>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ $t("Unlinking the card") }}
        </h2>
      </div>
      <div class="uk-modal-body">
        <p>{{ $t("Do you really want to unlink this card?") }}</p>
      </div>
      <div
          class="uk-modal-footer flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #untie-card-confirm-modal" class="btn-secondary">
          {{ $t("Cancel") }}
        </button>
<!--        <button-->
<!--            uk-toggle="target: #untie-card-confirm-modal"-->
<!--            class="rounded-md btn-danger px-6 py-2 text-white duration-100 hover:opacity-90"-->
<!--        >-->
<!--          {{ $t("Отвязать") }}-->
<!--        </button>-->
      </div>
    </div>
  </div>
</template>
