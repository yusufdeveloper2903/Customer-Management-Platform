<template>
  <div class="flex gap-3 justify-between mb-3">
    <progressBar :time="interval" :data="data" :current="currentSlide"/>
  </div>
  <carousel ref="myCarousel" :items-to-show="1" :autoplay="interval" :transition="1000" @init="onSlideChange"
            :wrap-around="true"
            v-model="currentSlide">
    <slide v-for="slide in data" :key="slide">
      <div style="position:relative"
           class="mb-5 flex h-[450px] w-[240px] mx-auto items-center justify-center overflow-hidden rounded bg-slate-200 dark:bg-darkLayoutMain">
        <span v-if="!slide['background_'+ $i18n.locale]" class="font-medium dark:text-white">{{ $t("no_photo") }}</span>
        <div v-else>
          <img
              class="h-[450px] w-[240px]"
              :src="slide['background_'+ $i18n.locale].full_size"
              alt="preview photo"
              style="aspect-ratio: 1/1"
          />
        </div>

      </div>
    </slide>

    <template #addons>
      <navigation/>
      <pagination/>
    </template>
  </carousel>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel'
import StoriesDetail from '../store'
import {ref} from 'vue';
import progressBar from './progresBar.vue'

const myCarousel = ref(null);
const store = StoriesDetail()

export default {
  data() {
    return {
      interval: 5000,
      currentSlide: 0,
      options: {
        text: {
          color: '#FFFFFF',
          shadowEnable: true,
          shadowColor: '#000000',
          fontSize: 14,
          fontFamily: 'Helvetica',
          dynamicPosition: false,
          hideText: false
        },
        progress: {
          color: '#2dbd2d',
          backgroundColor: '#333333',
          inverted: false
        },
        layout: {
          height: 35,
          width: 140,
          verticalTextAlign: 61,
          horizontalTextAlign: 43,
          zeroOffset: 0,
          strokeWidth: 30,
          progressPadding: 0,
          type: 'line'
        }
      }
    }
  },
  props: ['data'],
  watch: {

    currentSlide(val) {

      this.data.forEach((item, index) => {
        if (index === val) {
          this.interval = item.duration * 1000
        }
      })
    }
  },


  methods: {
    onSlideChange(slideNumber) {
      console.log(slideNumber, 'slideNumber')
      alert()
    }
  },
  name: 'App',
  components: {
    progressBar,
    myCarousel,
    Carousel,
    Slide,
    Pagination,
    store,
    Navigation,

  },
}
</script>
<style lang="scss">
.carousel__prev {
  background: green !important
}

.carousel__next {
  background: green !important

}

.carousel__pagination-button {
  background: lightgreen !important
}

.carousel__pagination-button--active {
  background: green !important
}

</style>
