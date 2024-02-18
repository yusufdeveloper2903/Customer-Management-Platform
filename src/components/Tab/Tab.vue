<template>
  <div v-show="(title) == (selectedTitle) ">
    <slot/>
  </div>
</template>

<script>
import {inject, ref} from "vue";
import {useI18n} from "vue-i18n";

export default {
  props: ["title"],
  emits: ['refresh'],
  setup() {
    const {locale, t} = useI18n();
    const timer = ref(false)
    setTimeout(() => {
      timer.value = true
    }, 100)

    const selectedTitle = inject("selectedTitle");

    return {
      t,
      selectedTitle,
    };
  },
};
</script>
