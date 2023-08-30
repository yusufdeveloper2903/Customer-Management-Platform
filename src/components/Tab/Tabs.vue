<template>
  <div :class="vertical && 'flex gap-5'" class="tabs__main">
    <ul
      class="font-base mb-5 border-0 text-sm text-gray-500"
      :class="vertical ? 'w-1/6' : 'flex flex-wrap'"
    >
      <li
        v-for="title in tabTitles"
        :key="title"
        class="mr-2 cursor-pointer px-5 py-2"
        :class="
          t(title) == t(selectedTitle)
            ? !pill
              ? 'border-b-[3px] border-primary text-primary'
              : 'bg-primary active text-white rounded'
            : ''
        "
        @click="onTitleSelected(title)"
      >
        {{ t(title) }}
      </li>
    </ul>
    <div :class="vertical && 'w-5/6'" class="tabs__main__body">
      <slot />
    </div>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  props: {
    vertical: {
      type: Boolean,
      required: false,
    },
    pill: {
      type: Boolean,
      required: false,
      default: () => {
        false;
      },
    },
  },
  setup(props, { slots, emit }) {
    const { locale, t } = useI18n();

    const tabTitles = ref(
      slots.default().map((tab) => tab.props && tab.props.title)
    );
    const selectedTitle = ref(tabTitles.value[0]);

    provide("selectedTitle", selectedTitle);

    function onTitleSelected(title){
      selectedTitle.value = title
      emit("selectedTitle", selectedTitle.value)
    }

    return {
      t,
      selectedTitle,
      onTitleSelected,
      tabTitles,
    };
  },
};
</script>

<style lang="scss">
.active {
  box-shadow: 0 4px 18px -4px rgba(115, 103, 240, 0.65);
}

@media (min-width: 0px) and (max-width: 480px) {
  /* .tw-pagination > section > div{
      flex-wrap: wrap !important;
    } */
  .tabs__main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    ul {
      width: 100% !important;
    }

    &__body {
      width: 100% !important;
    }
  }
}
</style>
