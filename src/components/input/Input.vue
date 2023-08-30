<template>
  <form>
    <div class="relative">
      <input
        id="goodInput"
        class="input bg-transparent w-full dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 p-3 py-2 focus:border-priring-primary focus:outline-none focus:ring-1 focus:ring-primary active:outline-none"
        type="text"
        v-model="inputValue"
        @input="onChageInput"
      />
      <label
        :id="goodLabel"
        for="goodInput"
        class="label bg-white dark:bg-darkLayoutMain leading-tighter absolute ml-3 mt-0.5 cursor-text text-base dark:text-gray-600"
        >{{ placeholder }}</label
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from "vue";  

// types
interface Emits {
  (event: "update:modelValue", value: string): string;
}
interface Props {
  placeholder?: string;
  modelValue: string;
}

// variables
const inputValue = ref("");

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

let goodLabel = ref<string>();

// methods
const onChageInput = () => {
  const label = document.getElementById(goodLabel.value || "goodLabel-0");

  if (inputValue.value) {
    label?.classList.add("fixedLabel");
  } else {
    label?.classList.remove("fixedLabel");
  }
  emit("update:modelValue", inputValue.value);
};

// hooks
onMounted(() => {
  goodLabel.value = `goodLabel-${getCurrentInstance()?.uid || 0}`;
  onChageInput();

  inputValue.value = props.modelValue;
});

watch(
  () => props.modelValue,
  () => {
    inputValue.value = props.modelValue;
    onChageInput();
  }
);
</script>

<style scoped>
.input:focus + .label,
.input:active + .label,
.input.filled + .label {
  font-size: 0.75rem;
  transition: all 0.2s ease-out;
  top: -1.2rem;
  color: #7367f0;
  padding: 0 5px 0 5px;
  margin: 0 5px 0 5px;
}
.label {
  pointer-events: none !important;
  transition: all 0.2s ease-out;
  left: 0;
  margin-top: 8px;
  color: #9ca3af;
}

.fixedLabel {
  font-size: 0.75rem;
  transition: all 0.2s ease-out;
  padding: 0 5px 0 5px;
  margin: 0 5px 0 5px;
  top: -1.2rem !important;
}
</style>
