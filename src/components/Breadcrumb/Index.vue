<template>
<div>
  <nav class="mb-5 mt-1 flex">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center !ml-0" v-for="(item, index) in list" :key="index">
        <a href="#" :class="item && !item.active ? 'inline-flex items-center text-primary hover:text-primary hover:no-underline ml-1 md:ml-2' 
        : 'ml-1 text-gray-500 md:ml-2       hover:no-underline hover:text-gray-500'">
          <span v-if="index > 0" class="mr-2">&frasl;</span>
          <span>{{ $t(item.title) }}</span>
        </a>
      </li>
    </ol>
  </nav>
</div>
</template>

<script setup lang="ts">
interface Props {
  list: any;
}

const props = defineProps<Props>();
</script>