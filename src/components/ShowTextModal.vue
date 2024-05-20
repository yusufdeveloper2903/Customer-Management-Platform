<script setup lang="ts">

//INTERFACE
interface PropsShowImage {
  url: string;
  id: string;
}


//DECLARED VARIABLES
const props = defineProps<PropsShowImage>();

</script>

<template>
  <div :id="props.id" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-md overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-body" style="word-wrap: break-word;">
        {{ props.url }}
      </div>

    </div>
  </div>
</template>
