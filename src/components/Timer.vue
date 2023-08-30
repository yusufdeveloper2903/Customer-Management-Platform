<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { registration } from "@/stores/registration";
const store = registration();


interface Emits {
  (event: "timerStopped"): void;
}
interface Props {
  breakOnMount?: boolean;
  noSaveTime?: boolean;
  defaultTime?: number;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const initialTime = props.defaultTime ? Math.round(props.defaultTime) : 60; // 2 minutes in seconds


let testIntervalId = ref()
let countDownDate = ref()
let time = ref(60)
let contdownEl = ref()


onMounted(() => {
  if(sessionStorage.getItem("isTimerStopped")){
    store.isTimerStopped = JSON.parse(sessionStorage.getItem("isTimerStopped") || 'true')
  }
  // console.log(isTimerStopped.value)
  if(!store.isTimerStopped){ //&& !props.breakOnMount
    if(sessionStorage.getItem("testTimerID")){
      testIntervalId.value = JSON.parse(sessionStorage.getItem("testTimerID") || '');
    }
    clearInterval(testIntervalId.value);
    
  
    startTimer()
  }else{
    contdownEl.value = document.getElementById("testCountDown");
    contdownEl.value.innerHTML = `00:00`
  }
})



watch(() => store.startTimerCountDown, (newValue) => {
  if(newValue){
    if(sessionStorage.getItem("testTimerID")){
      testIntervalId.value = JSON.parse(sessionStorage.getItem("testTimerID") || '');
    }
    clearInterval(testIntervalId.value);

    startTimer()
    store.startTimerCountDown = false
  }
});



let startTimer = () => {
  if(sessionStorage.getItem("testTimerTime")){
    countDownDate.value = JSON.parse(sessionStorage.getItem("testTimerTime") || '');
  }else{
    time.value = initialTime
  }
  console.log(initialTime)
  countDown();
}



const resetTimer = () => {
  
};



let countDown = () => {
  if(sessionStorage.getItem("testTimerTime")){
    countDownDate.value = JSON.parse(sessionStorage.getItem("testTimerTime") || '');
  }else{
    if(!props.noSaveTime){
      countDownDate.value = new Date();
      countDownDate.value.setSeconds(countDownDate.value.getSeconds() + time.value);
      countDownDate.value = countDownDate.value.getTime();
      sessionStorage.setItem("testTimerTime", JSON.stringify(countDownDate.value));
    }
  }

  testIntervalId.value = setInterval(() => {updateCountdown()}, 1000);
}


let updateCountdown = () => {
    var now = new Date().getTime();
      
    var distance = 0
    if (countDownDate.value > now) {
      distance = countDownDate.value - now;
    }

    // Time calculations for days, hours, minutes and seconds
    // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours:string|number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes:string|number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds:string|number = Math.floor((distance % (1000 * 60)) / 1000);
    
    minutes = minutes == 0 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if(route.name == 'sms-confirmation'){
      contdownEl.value = document.getElementById("testCountDown");
      contdownEl.value.innerHTML = (hours != 0) ? (`${hours}:'` + `${minutes}:${seconds}`) : (`${minutes}:${seconds}`)
    }
    sessionStorage.setItem("testTimerID", JSON.stringify(testIntervalId.value));
      
    if (countDownDate.value <= now) {
        contdownEl.value = document.getElementById("testCountDown");
        // contdownEl.value.innerHTML = ``;
        
        countDownDate.value = null;
        sessionStorage.removeItem("testTimerTime");

        clearInterval(testIntervalId.value);
        sessionStorage.removeItem("testTimerID");


        emit("timerStopped");
        store.isTimerStopped = true
        sessionStorage.setItem("isTimerStopped", store.isTimerStopped.toString());
    }
}




const clearTimeout = () => {
  contdownEl.value = document.getElementById("testCountDown");
  
  countDownDate.value = null;
  sessionStorage.removeItem("testTimerTime");

  clearInterval(testIntervalId.value);
  sessionStorage.removeItem("testTimerID");
};






defineExpose({ resetTimer, startTimer, clearTimeout })






</script>

<template>
  <span id="testCountDown"></span>
</template>
