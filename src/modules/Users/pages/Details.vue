<script setup lang="ts">
import { onMounted, ref } from "vue"
import users from "../store/index"
import { useRoute } from "vue-router";
import UIkit from "uikit";
import TerminateSessionModal from "../components/TerminateSessionModal.vue"

const store = users()
const route = useRoute()
const userItem = ref<object>({});
const userId = ref(null)


onMounted(async() => {
  await store.getUserById(Number(route.params.id))
  userItem.value = store.user
  
})

const showTerminateModal = (item) => {
  UIkit.modal("#terminate-session-modal").show();
  userId.value = item.id
};
</script>

<template>
  <div class="md:flex sm:block items-start gap-5 dark:text-white h-fit">
    <div class="md:w-3/12 sm:w-full">

      <!-- user info -->
      <div class="card">
        <div>{{ userItem.full_name }}</div>
        <div>
          <small v-if="userItem.phone"> + {{ userItem.phone }}</small>
        </div>
        <div>
          <small>Registered: {{ userItem.created_date }}</small>
        </div>
      </div>


      <!-- device info -->
      <div class="card mt-4">
        <ul class="uk-list uk-list-divider" v-if="store.user && store.user.sessions && store.user.sessions.length">
          <li  v-for="(item, index) in store.user.sessions" :key="index" >
            <div class="flex justify-between">
          <div>
            <div>Device: </div>
            <div>IP address: </div>
            <div>Last visit: </div>
          </div>
          <div>
            <div><small>{{ item.device_type }}</small></div>
            <div><small>{{ item.ip_address }}</small></div>
            <div><small>{{ item.last_visit }}</small></div>
          </div>
        </div>
        <div class="uk-flex uk-flex-center mt-2">
          <span class="rounded-md bg-secondary px-4 pb-0.5 text-white" @click="showTerminateModal(item)"><small>Terminate session</small> </span>
        </div>
          </li>
        </ul>
        <h2 v-else class="text-center">{{ $t('no_data') }}</h2>
      </div>
    </div>
    <div class="md:w-9/12 sm:w-full card">

    </div>
  </div>

  <TerminateSessionModal  :userId="userId"/>
</template>