<script setup lang="ts">

//IMPORTED FILES
import {onMounted, ref} from "vue"
import users from "../store/index"
import {useRoute} from "vue-router";
import UIkit from "uikit";
import TerminateSessionModal from "../components/TerminateSessionModal.vue"
import ConfirmUntieCardModal from "../components/ConfirmUntieCardModal.vue"
import {fieldsUserDetail} from "../constants/index"


//DECLARED VARIABLES
const store = users()
const route = useRoute()
const userItem = ref<object>({});
const userId = ref<null | number>(null)


//MOUNTED LIFE CYCLE
onMounted(async () => {
  let id = +route.params.id
  await store.getUserById(id)
  userItem.value = store.user

})

// FUNCTION
const refreshPage = () => {
  let id = +route.params.id
  store.getUserById(id)
}
const showTerminateModal = (item) => {
  UIkit.modal("#terminate-session-modal").show();
  userId.value = item.id
};

</script>

<template>
  <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
    <div class="md:w-3/12 sm:w-full">
      <div class="card">
        <h2 class="text-success mb-3"><b>{{ $t('Profile') }}</b></h2>
        <div class="flex justify-between mb-2">
          <div>{{ $t('Surname') }}</div>
          <div v-if="userItem.first_name"><small><b>{{ userItem.full_name }}</b></small></div>
          <div v-else>-</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ $t('First Name') }}</div>
          <div v-if="userItem.last_name"><small><b>{{ userItem.first_name }}</b></small></div>
          <div v-else>-</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ $t('Father_name') }}</div>
          <div v-if="userItem.full_name"><small><b>{{ userItem.last_name }}</b></small></div>
          <div v-else>-</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ $t('gender') }}</div>
          <div v-if="userItem.gender"><small><b>{{ userItem.gender === 'M' ? $t('Male') : $t('Female') }}</b></small>
          </div>
          <div v-else>-</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ $t('date_birth') }}</div>
          <div v-if="userItem.date_of_birth"><small><b>{{ userItem.date_of_birth }}</b></small></div>
          <div v-else>-</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ $t('phone_number') }}</div>
          <div v-if="userItem.phone"><small><b>+{{ userItem.phone }}</b></small></div>
          <div v-else>-</div>
        </div>

        <div class="flex justify-between mb-2">
          <div>{{ $t('Created') }}</div>
          <div v-if="userItem.created_date"><small><b>{{ userItem.created_date }}</b></small></div>
          <div v-else>-</div>
        </div>
      </div>


      <div class="card mt-4">
        <h2 class="text-success mb-3"><b>{{ $t('active_session') }}</b></h2>
        <ul class="uk-list uk-list-divider" v-if="store.user && store.user.sessions && store.user.sessions.length">
          <li v-for="(item, index) in store.user.sessions" :key="index"
              class="dark:bg-secondary card-bg p-3 rounded-md">

            <div class="flex justify-between">
              <div>{{ $t('Device') }}</div>
              <div><small><b>{{ item.device_model }}</b></small></div>
            </div>

            <div class="flex justify-between mt-2">
              <div>{{ $t('version_app') }}</div>
              <div><small><b>{{ item.device_type }}</b></small></div>
            </div>

            <div class="flex justify-between mt-2">
              <div>{{ $t('ip_address') }}</div>
              <div><small><b>{{ item.ip_address }}</b></small></div>
            </div>

            <div class="flex justify-between my-2">
              <div>{{ $t('date_created') }}</div>
              <div><small><b>{{ item.created_date }}</b></small></div>
            </div>

            <div class="flex justify-between">
              <div>{{ $t('coming') }}</div>
              <div><small><b>{{ item.last_visit }}</b></small></div>
            </div>

            <button class="mt-2 w-full rounded-md bg-danger text-white" @click="showTerminateModal(item)">
              <small>{{ $t('finishing') }}</small>

            </button>

          </li>
        </ul>
        <h2 v-else class="text-center">{{ $t('no_available_data') }}</h2>
      </div>
    </div>


    <div class="md:w-6/12 sm:w-full card">
      <EasyDataTable
          theme-color="#7367f0"
          hide-footer
          :headers="fieldsUserDetail"
          :items="[]"
      >
        <template #empty-message>
          <div class="dark:text-white">{{ $t("no_available_data") }}</div>
        </template>
        <template #header="header">
          {{ $t(header.text) }}
        </template>
        <template #item-created="item">
          {{ item.created_date }}
        </template>

        <template #item-device="item">
          {{ item.device_model }}
        </template>
      </EasyDataTable>
    </div>


    <div class="md:w-3/12 sm:w-full card">
      <h2 class="text-success mb-3"><b>{{ $t('cards') }}</b></h2>
      <ul class="uk-list uk-list-divider">
        <li class="card-bg p-3 rounded-md dark:bg-secondary">
          <div class="flex justify-between ">
            <div>{{ $t('First Name') }}</div>
            <div><small><b>-</b></small></div>
          </div>

          <div class="flex justify-between my-2">
            <div>{{ $t('number_card') }}</div>
            <div><small><b>-</b></small></div>
          </div>

          <div class="flex justify-between">
            <div>{{ $t('added') }}</div>
            <div><small><b>-</b></small></div>
          </div>


        </li>
      </ul>
    </div>
  </div>

  <TerminateSessionModal :userId="userId" @deleteUser="refreshPage"/>
  <!--  <ConfirmUntieCardModal/>-->
</template>

<style lang="scss">
.card-bg {
  background-color: #F2F2F2;
}
</style>