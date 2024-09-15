<script lang="ts">
//IMPORTED FILES
import {defineComponent} from "vue";


//EXPORTED FILES
export default defineComponent({
  name: "Vue Tailwind Pagination",
  props: {
    story: {
      type: String
    },
    restart: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    pageRange: {
      type: Number,
      default: 2,
    },
    textBeforeInput: {
      type: String,
      default: "Go to page",
    },
    textAfterInput: {
      type: String,
      default: "Go",
    },

  },

  data() {
    return {
      input: '',
      perPageOptions: [5, 10, 15],
    };
  },

  methods: {
    enteredInput: function (val: any) {
      if (val.keyCode === 13 && val.target.value > 0 && val.target.value <= this.totalPages) {
        this.$emit("page-changed", val.target.value);
      }
    },
    toPage: function () {
      if (this.input > 0 && this.input <= this.totalPages) {
        return this.$emit('page-changed', this.input)
      }
    },
    hasFirst: function () {
      return this.rangeStart !== 1;
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages;
    },

    changePage: function (page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit("page-changed", page);
      }
    },
    changePerPage: function (val: any) {
      this.$emit("per-page-changed", val.target.value);
    },
  },
  watch: {
    restart(val) {
      if (val) {
        this.input = null
      }
    }
  },
  computed: {
    pages: function () {
      let pages = [];

      for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i);
      }
      return pages;
    },
    rangeStart: function () {
      let start = this.current - this.pageRange;
      return start > 0 ? start : 1;
    },
    rangeEnd: function () {
      let end = this.current + this.pageRange;

      return end < this.totalPages ? end : this.totalPages;
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage);
    },
    nextPage: function () {
      return this.current + 1;
    },
    prevPage: function () {
      return this.current - 1;
    },
  },
});
</script>

<template>
  <div class="min-w-max">
    <section
        class="flex justify-between bg-white rounded-lg border border-gray-200 px-10 py-3 text-gray-700 font-montserrat"
        style="padding-left: 25px"
    >
      <ul class="flex items-center gap-x-4" :class="story == 'story' ? 'w-[100%] justify-between': ''">
        <div class="flex items-center gap-x-4">

          <span class="text-gray-400"> {{ $t("pagination.show_from") }} </span>

          <div class="relative">
            <select
                @change="changePerPage"
                class="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                v-model="perPage"
                style="border: 1px solid rgb(53 108 45 ) ;font-weight: bold ;  border-radius: 0.375rem"
            >
              <option
                  v-for="(page_size, index) in perPageOptions"
                  :value="page_size"
                  :key="index"
              >
                {{ page_size }}
              </option>
            </select>
            <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-1"
                style="color: rgb(53 108 45 )"
            >
              <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M10 12l-6-6 1.5-1.5L10 9.828 14.5 4.5 16 6z"
                />
              </svg>
            </div>
          </div>
          <span class="text-gray-400">
          {{ $t("pagination.column") }}
        </span>
        </div>


      </ul>
      <ul>

        <div class="flex items-center gap-x-4">
          <li>
            <a
                href="#"
                @click.prevent="changePage(prevPage)"
                v-if="pages.length > 0"
            >
              <div
                  class="flex items-center justify-center bg-gray-200 dark:bg-gray-400 rounded-md transform rotate-45 h-6 w-6"
              >
                <div class="transform -rotate-45">
                  <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          </li>
          <li v-if="hasFirst()">
            <a href="#" @click.prevent="changePage(1)">
              <div
                  class="flex hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
              >
                <span class="transform -rotate-45"> 1 </span>
              </div>
            </a>
          </li>
          <li v-if="hasFirst()">...</li>
          <li v-for="page in pages">
            <a href="#" @click.prevent="changePage(page)">
              <div
                  :class="{
                'bg-gradient-to-r from-blue-400 to-indigo-400': current == page,
              }"
                  :style="{'background-color' : current == page ? '#1a4b75' : ''}"
                  class="flex hover:bg-gray-200  dark:hover:bg-gray-400 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
              >
                <span class="transform -rotate-45">{{ page }}</span>
              </div>
            </a>
          </li>
          <li v-if="hasLast()">...</li>
          <li v-if="hasLast()">
            <a href="#" @click.prevent="changePage(totalPages)">
              <div
                  class="flex hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
              >
              <span class="transform -rotate-45">
                {{ totalPages }}
              </span>
              </div>
            </a>
          </li>
          <li v-if="pages.length > 0">
            <a href="#" @click.prevent="changePage(nextPage)">
              <div
                  class="flex items-center justify-center bg-gray-200 dark:bg-gray-400 rounded-md transform rotate-45 h-6 w-6"
              >
                <div class="transform -rotate-45">
                  <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          </li>

        </div>
      </ul>

    </section>
  </div>
</template>


<style scoped>
.select-style {
  border: 1px solid #ccc;
  width: 120px;
  border-radius: 3px;
  overflow: hidden;
  background: #fafafa url("img/icon-select.png") no-repeat 90% 50%;
}

.select-style select {
  padding: 5px 8px;
  width: 130%;
  border: none;
  box-shadow: none;
  background: transparent;
  background-image: none;
  -webkit-appearance: none;
}

select option:checked {
  background: #092f50 !important;
  color: #fff;
}
</style>
