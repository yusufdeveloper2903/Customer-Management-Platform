<template>
  <div v-show="t(title) == t(selectedTitle)">
    <slot />
  </div>
</template>

<script>
import { inject } from "vue";
import { useI18n } from "vue-i18n";

export default {
  props: ["title"],
  setup() {
    const { locale, t } = useI18n();

    const selectedTitle = inject("selectedTitle");

    return {
      t,
      selectedTitle,
    };
  },
};
</script>
