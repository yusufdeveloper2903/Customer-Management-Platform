<script setup lang="ts">
interface Props {
  title: string;
  cancel: string;
  ok: string;
  id?: string;
}
interface Emits {
  (event: "ok"): void;
  (event: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div :id="props.id || 'confirm-modal'" class="uk-flex-top" uk-modal>
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-md overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl text-[#4b4b4b] font-normal">
          {{ props.title }}
        </h2>
      </div>
      <div class="uk-modal-body">
        <slot />
      </div>
      <div
        class="uk-modal-footer px-5 py-3 uk-text-right bg-white flex justify-end"
      >
        <button
          :uk-toggle="`target: #${props.id || 'confirm-modal'}`"
          class="btn-small btn-danger mr-2"
          @click="emit('cancel')"
        >
          {{ props.cancel }}
        </button>
        <button class="btn-small btn-success" @click="emit('ok')">
          {{ props.ok }}
        </button>
      </div>
    </div>
  </div>
</template>
