<script setup lang="ts">

//INTERFACE
interface PropsShowImage {
  image: string;
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
      <div class="uk-modal-body flex justify-center">
        <img :src="props.image" alt="image" style="aspect-ratio: 1/1"/>
      </div>

    </div>
  </div>
</template>
