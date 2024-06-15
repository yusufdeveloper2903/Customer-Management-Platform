<template>
  <div v-for="(item,index) in data" :key="item.id" style="width:90%" class="custom">
    <progress bg-color="#009933" :value="progress" max="100" v-if="current === index"></progress>
    <progress bg-color="#009933" value="0" max="100" v-else></progress>
  </div>
</template>
<script>
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    time: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      progress: 0,
      totalTime: 0,
      remainingTime: 0,
      intervalId: null
    };
  },
  watch: {
    time(newValue) {
      this.stopTimer();
      this.totalTime = newValue;
      this.remainingTime = newValue;
      this.startTimer();
    }
  },
  mounted() {
    this.totalTime = this.time;
    this.remainingTime = this.time;
    this.startTimer();
  },
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.intervalId = setInterval(() => {
        this.remainingTime -= 1000;
        this.progress = Math.round(((this.totalTime - this.remainingTime) / this.totalTime) * 100);

        if (this.remainingTime <= 0) {
          this.progress = 1;
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.intervalId);
    }
  }
});
</script>
<style>
progress {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 10px;
  border: none;
  width: 100% !important;
  transition: width 0.5s ease;
}


progress::-webkit-progress-bar {
  background-color: #f3f3f3;
  border-radius: 10px;

}

progress::-webkit-progress-value {
  background-color: #4CAF50; /* Green color */
  border-radius: 10px;
  transition: width 0.5s ease;

}

progress::-moz-progress-bar {
  background-color: #4CAF50; /* Green color */
  border-radius: 10px;
  transition: width 0.5s ease;
}
</style>