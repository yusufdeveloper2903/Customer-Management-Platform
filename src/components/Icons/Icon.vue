<template>
  <li
      :style="`mask-image: url('/icons/${props.icon}.svg');
        background: ${props.color || '#000'};
        color: ${props.color || '#000'};
        width: ${props.size || 20}px;
        height: ${props.size || 20}px;
        mask-size: ${props.size || 20}px;`"
      style="mask-position: center; mask-repeat: no-repeat"
  ></li>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string;
  color?: string;
  size?: string;
}>();
</script>
