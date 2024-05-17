<script lang="ts" setup>

//IMPORTED FILES
import {nextTick, ref, watch} from "vue";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";
import UIkit from "uikit";


//DECLARED VARIABLES
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
  typeModal: number | string | null | undefined;
  eye?: boolean;
  minus?: boolean;
  class?: string;
  multiple?: boolean;
  name: string
  id: string | number | null
}

const props = withDefaults(defineProps<Props>(), {
  eye: true,
  minus: true,
  multiple: false,
  typeModal: null,
  name: '',
  id: null
});
const data = ref<any>('')
const emit = defineEmits<Emits>();
const inputValue = ref<string | string[] | null>();
const input = ref<boolean>(true);
const image = ref<string>("");
const imageCard = ref();
const onShowFile = (item) => {
  image.value = item;
  nextTick(() => {
    UIkit.modal(`#${props.name}`).show();
    emit("show", item);
  });
};


//WATCHERS
watch(
    () => props.modelValue,
    () => {
      if (!props.modelValue) {
        data.value = ''

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
  data.value = value.target.files[0];
  if (valueSize.length === 1) emit("update:modelValue", value.target.files[0]);
  else {
    emit("update:modelValue", valueSize);
  }
};
const clearData = () => {
  data.value = ''
  emit('remove', inputValue.value)
  (document.getElementById(`${props.name}`) as HTMLInputElement).value = ''
}
</script>

<template>
  <div class="file_data">
    <input
        v-if="input"
        :id="props.id"
        class="form-file-input "
        :class="props.class"
        @input="onInputFile"
        v-on="emit"
        v-bind="props"
        type="file"
        :multiple="multiple"
    />
    <button v-if="data" @click.prevent="clearData" class="ml-3 btn-danger btn-action button_cancel"
    >
      <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
    </button>
  </div>

  <template v-if="typeof inputValue === 'string'">
    <div v-if="props.typeModal" class="flex justify-between items-center mt-3 mx-5" @click.prevent>
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{
          inputValue.length < 15
              ? inputValue.split("/").at(-1)
              : inputValue.split("/").at(-1)?.slice(0, 15) + "..."
        }}</span>
      <div class="flex justify-end gap-3 ml-3">
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
          item.length < 15
              ? item.split("/").at(-1)
              : item.split("/").at(-1)?.slice(0, 15) + "..."
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
  <ShowFileModal :id="props.name" :image="image" ref="imageCard" />
</template>
<style lang="scss" scoped>
.file_data {
  position: relative;
}

.button_cancel {
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 7px

}
</style>