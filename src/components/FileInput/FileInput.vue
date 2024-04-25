<script lang="ts" setup>

//IMPORTED FILES
import {nextTick, ref, watch} from "vue";
import ShowFileModal from "./showFileModal.vue";
import UIkit from "uikit";
const emit = defineEmits(['remove'])


//DECLARED VARIABLES
const props = ref<any>({
  eye: true,
  minus: true,
  multiple: false,
  typeModal: null,
  name: ''
});
const inputValue = ref<string | string[] | null>();
const input = ref<boolean>(true);
const image = ref<string>("");
const imageCard = ref();
const onShowFile = (item) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal(`#${props.name}`).show();
  });
};


//WATCHERS
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

</script>

<template>
  <input
      v-if="input"
      class="form-file-input"
      :class="props.class"
      v-bind="props"
      type="file"
  />
  <template v-if="typeof inputValue === 'string'">
    <div v-if="props.typeModal" class="flex justify-between items-center mt-3 mx-5" @click.prevent>
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{
          inputValue.length < 26
              ? inputValue.split("/").at(-1)
              : inputValue.split("/").at(-1)?.slice(0, 25) + "..."
        }}</span>
      <div class="flex justify-end gap-3">
        <Icon
            v-if="props.eye"
            icon="Eye"
            @click.prevent="onShowFile(inputValue)"
            class="cursor-pointer"
            color="#909498"
        />
        <Icon
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
        />
        <Icon
            v-if="props.minus"
            icon="Minus Circle"
            @click="emit('remove', { item, index })"
            class="cursor-pointer"
            color="#ea5455"
        />
      </div>
    </div>
  </template>
  <ShowFileModal :name="props.name" :image="image" ref="imageCard"/>
</template>
