<script setup lang="ts">

interface Props {
  image: string;
  id: string;
}

const props = defineProps<Props>();

// const hideModal = () => {
//   UIkit.modal(`${props.id || '#file-modal'}`).hide()
// }
</script>

<template>
  <div :id="id" class="uk-flex-top" uk-modal>
    <div
        class="uk-modal-dialog uk-margin-auto-vertical rounded-md overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <div class="uk-modal-body ">
        <img :src="props.image" alt="" class="w-full"/>
      </div>

    </div>
  </div>
</template>
