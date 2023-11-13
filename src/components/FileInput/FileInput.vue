<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import ShowFileModal from "./showFileModal.vue";
import UIkit from "uikit";
interface ReturnValue {
  item: string;
  index: number;
}
interface Emits {
  (event: "update:modelValue", value: File | File[]): void;
  (event: "remove", value: ReturnValue | string): void;
  (event: "show", value: ReturnValue | string): void;
}

interface Props {
  modelValue: string | string[] | null;
  eye?: boolean;
  minus?: boolean;
  class?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  eye: true,
  minus: true,
  multiple: false,
});
const emit = defineEmits<Emits>();
const inputValue = ref<string | string[] | null>();
const input = ref<boolean>(true);
const image = ref<string>("");
const imageCard = ref();
const onShowFile = (item) => {
  console.log(item);
  image.value = item;
  console.log(image.value);
  nextTick(() => {
    UIkit.modal("#file-modal").show();
    emit("show", item);
  });
};
watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      input.value = false;
      nextTick(() => {
        input.value = true;
        inputValue.value = props.modelValue;
      });
    } else {
      inputValue.value = props.modelValue;
    }
  }
);

const onInputFile = (value) => {
  const valueSize: File[] = Object.values(value.target.files);
  if (valueSize.length === 1) emit("update:modelValue", value.target.files[0]);
  else {
    emit("update:modelValue", valueSize);
  }
};
</script>

<template>
  <input
    v-if="input"
    class="form-file-input"
    :class="props.class"
    v-bind="props"
    @input="onInputFile"
    v-on="emit"
    type="file"
    :multiple="multiple"
  />
  <template v-if="typeof inputValue === 'string'">
    <div class="flex justify-between items-center mt-3 mx-5">
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{
        inputValue.length < 26
          ? inputValue.split("/").at(-1)
          : inputValue.split("/").at(-1)?.slice(0, 25) + "..."
      }}</span>

      <div class="flex justify-end gap-3">
        <Icon
          v-if="props.eye"
          icon="Eye"
          @click="onShowFile(inputValue)"
          class="cursor-pointer"
          color="#909498"
        /><Icon
          v-if="props.minus"
          icon="Minus Circle"
          @click="emit('remove', inputValue)"
          class="cursor-pointer"
          color="#ea5455"
        />
      </div>
    </div>
  </template>
  <template v-else-if="Array.isArray(inputValue)">
    <div
      class="flex justify-between items-center mt-3 mx-5"
      v-for="(item, index) in inputValue"
    >
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{
        item.length < 26
          ? item.split("/").at(-1)
          : item.split("/").at(-1)?.slice(0, 25) + "..."
      }}</span>

      <div class="flex justify-end gap-3">
        <Icon
          v-if="props.eye"
          icon="Eye"
          @click="onShowFile(item)"
          class="cursor-pointer"
          color="#909498"
        /><Icon
          v-if="props.minus"
          icon="Minus Circle"
          @click="emit('remove', { item, index })"
          class="cursor-pointer"
          color="#ea5455"
        />
      </div>
    </div>
  </template>
  <ShowFileModal :image="image" ref="imageCard" />
</template>
