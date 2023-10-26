<template>
  <div :class="openShowModal ? 'openCatalog menu dark:bg-darkLayoutStorm' : 'defaultCatalog menu'">
    <div class="modal-title dark:bg-darkLayoutStorm">
      <h5>{{ $t('Add') }} баннер</h5>
      <button uk-icon="close" class="dark:bg-darkLayoutStorm" @click="$emit('openModal')"/>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="modal-body">
        <div class="uk-margin">
          <label for="form-stacked-text">{{ $t('title') }}</label>
          <div class="uk-form-controls">
            <input class="form-input"/>
          </div>
        </div>

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
          <label for="form-stacked-text">{{ $t('Фото') }}</label>
          <div class="uk-form-controls">
            <input type="file" class="form-file-input p-1" />
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
import VueDatePicker from '@vuepic/vue-datepicker';
import {ref} from "vue";
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/modal.css'

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
