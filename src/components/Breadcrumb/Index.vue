<script setup lang="ts">

//IMPORTED FILES
import {useSidebarStore} from "@/stores/layoutConfig";
import {useRouter} from "vue-router";
import {ListInterface} from '@/interface/index'


//DECLARED VARIABLES
const store = useSidebarStore();
const router = useRouter();
defineProps<{ list: ListInterface[] }>();



//FUNCTIONS
const onBefore = (item: ListInterface) => {
  if (!item.active) {
    router.go(-1);
  }
};

</script>
<template>
  <div>
    <nav class="mb-5 mt-1 flex card">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <Icon
            icon="Home"
            :color="store.currentTheme == 'light' ? '#356c2d' : '#356c2d'"
            size="20"
            class="mb-1"
            style="cursor: pointer"
        />
        <svg
            fill="none"
            height="17"
            viewBox="0 0 24 24"
            width="24"
            style="margin-left: 7px"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              clip-rule="evenodd"
              d="m8.51192 4.43057c.31449-.26957.78797-.23314 1.05754.08135l6.00004 6.99998c.2407.2809.2407.6953 0 .9762l-6.00004 7c-.26957.3145-.74305.3509-1.05754.0814-.31449-.2696-.35092-.7431-.08135-1.0576l5.58163-6.5119-5.58163-6.51189c-.26957-.3145-.23314-.78797.08135-1.05754z"
              fill="#1a4b75"
              fill-rule="evenodd"
          />
        </svg>
        <li
            class="inline-flex items-center !ml-0"
            v-for="(item, index) in list"
            :key="index"
        >
          <a
              @click="onBefore(item)"
              style="margin-top: 2px"
              :class="
              item && !item.active
                ? 'inline-flex items-center breadcolor hover:text-secondary hover:no-underline ml-1 '
                : 'ml-1 text-gray-500        hover:no-underline hover:text-gray-500'
            "
          >
            <div style="display: flex; align-items: center">
              <span v-if="index > 0" class="mr-2">
                <svg
                    fill="none"
                    height="17"
                    viewBox="0 0 24 24"
                    width="24"
                    style="margin-left: 7px"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      clip-rule="evenodd"
                      d="m8.51192 4.43057c.31449-.26957.78797-.23314 1.05754.08135l6.00004 6.99998c.2407.2809.2407.6953 0 .9762l-6.00004 7c-.26957.3145-.74305.3509-1.05754.0814-.31449-.2696-.35092-.7431-.08135-1.0576l5.58163-6.5119-5.58163-6.51189c-.26957-.3145-.23314-.78797.08135-1.05754z"
                      fill="#1a4b75"
                      fill-rule="evenodd"
                  />
                </svg>
              </span>
              <span>{{ $t(item.title) }}</span>
            </div>
          </a>
        </li>
      </ol>
    </nav>
  </div>
</template>
<style>
.breadcolor {
  color: #356c2d
}
</style>
