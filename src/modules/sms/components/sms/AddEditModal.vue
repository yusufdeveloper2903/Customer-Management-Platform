<template>
  <div :class="openShowModal ? 'openCatalog menu dark:bg-darkLayoutStorm' : 'defaultCatalog menu'">
    <div class="modal-title dark:bg-darkLayoutStorm">
      <h5>{{ $t('Add') }} смс</h5>
      <button uk-icon="close" class="dark:bg-darkLayoutStorm" @click="$emit('openModal')"/>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="modal-body">
        <div class="uk-margin">
          <label for="form-stacked-text">{{ $t('Запланировать время') }}</label>
          <div class="uk-form-controls">
            <VueDatePicker v-model="date"></VueDatePicker>
          </div>
        </div>

        <div class="uk-margin">
          <label for="form-stacked-text">{{ $t('Группа') }}</label>
          <div class="uk-form-controls">
            <VSelect/>
          </div>
        </div>

        <div class="uk-margin">
          <label for="form-stacked-text">{{ $t('Описание') }}</label>
          <div class="uk-form-controls">
            <textarea class="form-input"/>
          </div>
        </div>

        <div class="uk-margin mb-0">
          <label for="form-stacked-text">{{ $t('Статус') }}</label>
          <div class="uk-form-controls">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                  type="checkbox"
                  :checked="is_active"
                  class="sr-only peer"
              />
              <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"/>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('openModal')" class="btn-danger">
          Отменить
        </button>
        <button type="submit" class="btn-primary" @click="$emit('openModal')">
          Сохранить
        </button>
      </div>
    </form>
  </div>
  <div :class="openShowModal ? 'black__shadow' : ''" @click="$emit('openModal')"/>
</template>

<script setup>
// import {Textarea} from "flowbite-vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import {ref} from "vue";
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/modal.css'


const is_active = ref(true)
const date = ref(null)
const props = defineProps({
  openShowModal: {
    type: Boolean,
    default: () => false
  },
})
const emit = defineEmits(['refresh', 'openModal'])

const onSubmit = () => {

}
</script>
