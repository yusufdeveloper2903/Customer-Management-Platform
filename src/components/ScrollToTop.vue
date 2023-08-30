<template>
  <button
    class="fixed bg-primary text-white p-2.5 hover:-translate-y-9 hover:shadow-buttonShadow hover:shadow-primary active:shadow-none rounded duration-300"
    :class="
      isVisible
        ? 'opacity-100 pointer-events-auto -bottom-1 right-7 -translate-y-7'
        : 'opacity-0 pointer-events-none -bottom-1 right-7 translate-y-7'
    "
    @click="scrollToTop"
  >
    <Icon icon="Round Double Alt Arrow Up" color="#fff" size="25" />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "ScrollToTop",
  setup() {
    const isVisible = ref(false);

    const checkScroll = () => {
      if (window.pageYOffset > 200) {
        isVisible.value = true;
      } else {
        isVisible.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", checkScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", checkScroll);
    });

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return {
      isVisible,
      scrollToTop,
    };
  },
});
</script>

<style scoped></style>
