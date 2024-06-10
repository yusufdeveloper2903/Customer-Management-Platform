<script lang="ts" setup>

//IMPORTED FILES
import {nextTick, ref, watch} from "vue";
import ShowFileModal from "@/components/ShowPhotoGlobal.vue";
import UIkit from "uikit";
import {ReturnValue, FileInput} from '@/interface'


//Interfaces Type
interface Emits {
  (event: "update:modelValue", value: File | File[]): void;

  (event: "remove", value: ReturnValue | string);

  (event: "show", value: ReturnValue | string): void;
}

interface Props {
  modelValue: string | string[] | null;
  typeModal: number | string | null | undefined;
  eye?: boolean;
  minus?: boolean;
  class?: string;
  multiple?: boolean;
  name: string;
  empty: boolean;
  id: number | null | string
}


//DECLARED VARIABLES
const props = withDefaults(defineProps<Props>(), {
  eye: true,
  minus: true,
  multiple: false,
  empty: false,
  typeModal: null,
  name: '',
  id: null
});
const pictureName = ref('')
const changePhoto = ref<any>();
const data = ref<FileInput | ''>()
const emit = defineEmits<Emits>();
const inputValue = ref<any>();
const input = ref<boolean>(true);
const image = ref<string>('');
const onShowFile = (item: string) => {
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
watch(() => props.empty, (val) => {
  if (!val) {
    data.value = '';
    changePhoto.value = '';
    (document.getElementById(`${props.name}`) as HTMLInputElement).value = '';
  }
})
const onInputFile = (value: any) => {
  const valueSize: File[] = Object.values(value.target.files);
  data.value = value.target.files[0];
  if (valueSize.length === 1) {
    emit("update:modelValue", value.target.files[0]);
  } else {
    emit("update:modelValue", valueSize);
  }
};

const clearData = () => {
  data.value = ''
  changePhoto.value = ''
  emit('remove', inputValue.value)
  (document.getElementById(`${props.name}`) as HTMLInputElement).value = ''
}
const textFileInput = (val: any) => {
  return val.length < 15
      ? val.split("/").at(-1)
      : val.split("/").at(-1)?.slice(0, 15) + "..."
}
const getFile = (event: any) => {
  let input = event.target;
  if (input.files && input.files[0]) {
    pictureName.value = input.files[0].name;
    let reader = new FileReader();
    reader.onload = (e) => {
      changePhoto.value = e?.target?.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

</script>

<template>
  <div class="file_data">
    <input
        @change="getFile"
        title=""
        v-if="input "
        :id="props.id"
        class="form-file-input "
        :class="input && data ? `fileUpload ${props.class}` :'fileEmpty'"
        @input="onInputFile"
        v-on="emit"
        v-bind="props"
        type="file"
        :multiple="multiple"
        accept="image/png,image/jpeg"

    />
    <button v-if="data" @click.prevent="clearData" class="ml-3 btn-danger btn-action button_cancel"
    >
      <Icon icon="Trash Bin Trash" color="#fff" size="16"/>
    </button>
  </div>

  <template v-if="typeof inputValue === 'string'">
    <div v-if="props.typeModal" class="flex justify-between items-center mt-3 mx-5" @click.prevent>
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{ textFileInput(inputValue) }}</span>
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
  <template v-else-if="changePhoto">
    <div
        class="flex justify-between items-center mt-3 mx-5"

    >
      <span class="rounded bg-primary px-4 pb-0.5 text-white">{{ pictureName }}</span>

      <div class="flex justify-end gap-3">
        <Icon
            v-if="props.eye"
            icon="Eye"
            @click.prevent="onShowFile(changePhoto)"
            class="cursor-pointer"
            color="#909498"
        />

      </div>
    </div>
  </template>
  <ShowFileModal :id="props.name" :image="image"/>
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

.fileEmpty {
  color: transparent !important;
}

//.fileUpload {
//  color: black !important;
//}


input[type=file]::before {
  content: "📁";
  color: black;
  margin-right: 10px;
}

[type="file"]::file-selector-button {
  width: 0;
  margin-inline-end: 0;
  padding: 0;
  border: none;
}


</style>