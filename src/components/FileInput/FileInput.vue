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

const textFileInput = (val: any, second: any) => {
  if (second === 'inputValue') {
    const lastDotIndex = val.lastIndexOf(".");
    const extension = lastDotIndex !== -1 ? val.slice(lastDotIndex) : "";
    return val.length < 20
        ? val.split("/").at(-1)
        : val.split("/").at(-1)?.slice(0, 20) + extension;
  }
  if (second === 'changePhoto') {
    const lastDotIndex = inputValue.value.name.lastIndexOf(".");
    const extension = lastDotIndex !== -1 ? inputValue.value.name.slice(lastDotIndex) : "";
    const truncatedStr = inputValue.value.name.slice(0, 20 - extension.length);

    return truncatedStr + extension;
  }
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
        style="margin-bottom:0 !important;"
        class="form-file-input"
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
    <span style="font-size:14px;color:#999999" class="ml-1">
      {{ $t('format_photo') }}: (png / jpg / 672 x 368)
    </span>
  </div>

  <template v-if="typeof inputValue === 'string'">
    <div v-if="props.typeModal" class="flex justify-between items-center mt-3 " @click.prevent>
      <div class="flex items-center">
        <img
            v-if="props.name === 'stories-template-section'"
            :src="inputValue"
            class="rounded-lg w-[60px] h-[120px] "
            style="aspect-ratio: 1/1 "
            alt="image"
        />
        <img
            v-else
            :src="inputValue"
            class="rounded-lg w-[90px] h-[90px] "
            style="aspect-ratio: 1/1 "
            alt="image"
        />
        <div class="ml-3">
          <div class="rounded text-success   ">{{ textFileInput(inputValue, 'inputValue') }}</div>
        </div>


      </div>

      <div class="flex justify-end gap-3 ml-3 mt-2">
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
      <div class="flex items-center">
        <img
            v-if="props.name === 'stories-template-section'"
            :src="changePhoto"
            class="rounded-lg w-[60px] h-[120px] "
            style="aspect-ratio: 1/1 "
            alt="image"
        />
        <img
            v-else
            :src="changePhoto"
            class="rounded-lg w-[90px] h-[90px] "
            style="aspect-ratio: 1/1 "
            alt="image"
        />
        <div class="ml-3">
          <div class="rounded text-success mt-2  ">{{ textFileInput(changePhoto, 'changePhoto') }}</div>
        </div>


      </div>

      <div class="flex justify-end gap-3 ml-3">
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