<script setup lang="ts">
//Imported files

import {ref} from "vue";
defineProps({
  title: {
    type: String,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['openEditModal'])
let isOpen = ref();

const openEditModal = () => {
  emit('openEditModal')
};

</script>

<template>
  <div class="border-b">
    <button @click="isOpen = !isOpen" class="p-4 w-full text-left flex justify-between font-semibold text-[#17183B]">
      <div class="flex items-center gap-2">
        <button
            class="bg-transparent hover:bg-[#17183B] text-[#17183B] font-semibold hover:text-white h-[20px] w-[20px] border border-[#17183B] hover:border-transparent rounded"
            v-if="isOpen">
          <span uk-icon="chevron-up" style="transform: scale(.7);"></span>
        </button>
        <button
            class="bg-transparent hover:bg-[#17183B] text-[#17183B] font-semibold hover:text-white h-[20px] w-[20px] border border-[#17183B] hover:border-transparent rounded"
            v-else>
          <span uk-icon="chevron-down" style="transform: scale(.7);"></span>
        </button>
        {{ $t(title) }}
      </div>
      <div class="text-[#FFCC00]">
        <span v-if="editable" uk-icon="file-edit" @click.stop="openEditModal"></span>
      </div>
      <div class="flex gap-x-4">
        <slot name="edit"/>
        <slot name="add"/>
        <slot name="select"/>
      </div>

    </button>
    <div v-if="isOpen" class="p-4 py-2">
      <slot></slot>
    </div>
  </div>
</template>