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
          (title) === (selectedTitle)
            ? !pill
              ? 'border-b-[3px] border-primary text-primary'
              : 'bg-primary active shadow shadow-primary text-white rounded'
            : ''
        "
          @click="onTitleSelected(title)"
      >
        <span class="dark:text-gray-400">{{ $t(title) }}</span>
      </li>
    </ul>
    <div :class="vertical && 'w-5/6'" class="tabs__main__body">
      <slot/>
    </div>
  </div>
</template>

<script>
import {provide, ref} from "vue";
import {useI18n} from "vue-i18n";
import knowledgeBase from "@/modules/KnowledgeBase/store/index";

export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    vertical: {
      type: Boolean,
      required: false,
    },
    unique: {
      type: String,
      required: false
    },
    pill: {
      type: Boolean,
      required: false,
      default: () => {
        false;
      },
    },
  },
  setup(props, {slots, emit}) {
    const {t} = useI18n();
    const store = knowledgeBase();
    const tabTitles = ref(slots.default().map((tab) => tab.props && tab.props.title));
    const selectedTitle = ref(tabTitles.value[0]);
    const storeData = localStorage.getItem('knowledgeBase')
    const storeData2 = localStorage.getItem('sms')
    const storeData3 = localStorage.getItem('administration')
    const storedModule = localStorage.getItem('sidebar')
    if (storeData && storedModule === 'knowledgeBase' && props.unique === 'unique') {
      selectedTitle.value = storeData
    }
    if (storeData2 && storedModule === 'sms-template' && props.unique === 'unique') {
      selectedTitle.value = storeData2
    }
    if (storeData3 && storedModule === 'Logging' && props.unique === 'unique') {
      selectedTitle.value = storeData3
    }
    provide("selectedTitle", selectedTitle);
    function onTitleSelected(title) {
      selectedTitle.value = title;
      emit("selectedTitle", selectedTitle.value);
    }

    return {
      store,
      t,
      selectedTitle,
      onTitleSelected,
      tabTitles,
    };
  },
};
</script>

<style lang="scss" scoped>
.active {
  box-shadow: 0 4px 18px -4px rgba(70, 171, 70, 0.65);

  span {
    color: white !important;
  }
}

@media (min-width: 0px) and (max-width: 480px) {
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
