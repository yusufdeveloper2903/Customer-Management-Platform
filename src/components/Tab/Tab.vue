<template>
  <div v-show="(title) === (selectedTitle)">
      <slot/>
  </div>
</template>

<script>
import {inject} from "vue";
import {useI18n} from "vue-i18n";

export default {
  props: ["title"],
  emits: ['refresh'],
  setup() {
    const {t} = useI18n();
    const selectedTitle = inject('selectedTitle')

    return {
      t,
      selectedTitle,
    };
  },
};
</script>
