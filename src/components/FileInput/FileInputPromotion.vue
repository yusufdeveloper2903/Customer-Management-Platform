<script lang="ts" setup>

//IMPORTED FILES
import {nextTick, ref, watch} from "vue";
import {ReturnValue, FileInput} from '@/interface'
import {useSidebarStore} from '@/stores/layoutConfig'

//Interfaces Type
interface Emits {
  (event: "update:modelValue", value: File | File[]): void;

  (event: "remove", value: ReturnValue | string);

  (event: "show", value: ReturnValue | string): void;
}

const general = useSidebarStore()

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

const getFile = (event: any) => {
  let input = event.target;
  if (input.files && input.files[0]) {
    pictureName.value = input.files[0].name;
    let reader = new FileReader();
    reader.onload = (e) => {
      changePhoto.value = e?.target?.result;
      if(props.name === 'promotion-modal'){
        general.imageDetail = e?.target?.result;
      }
      if(props.name === 'second-promotion'){
        general.imageBackground = e?.target?.result;
      }


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
        style="margin-bottom:0 !important;"
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
      {{ $t('format_photo') }}: (png / jpg / 1080x1920)
    </span>
  </div>


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