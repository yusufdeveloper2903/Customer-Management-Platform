<template>
  <v-select
      id="select"
      ref="selectV"
      v-model="selected"
      :label="label"
      :reduce="reduce"
      :options="localeOptions"
      :get-option-label="getOptionLabel"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="false"
      direction="top"
      @input="onSelected"
      @search="onSearch"
      @open="onOpen"
  >
    <template #list-footer>
      <li v-show="options.next" ref="load" class="loader">
        {{ $t("loading_more_options") }}
      </li>
    </template>

    <template #no-options> {{ $t("no_matching_options") }}</template>
  </v-select>
</template>

<script>
export default {
  props: {
    state: {
      type: [Object, Array],
      default: () => [],
    },
    autoFetch: {
      type: Boolean,
      default() {
        return true;
      },
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {
          next: null,
          timer: null,
        };
      },
    },
    getOptionLabel: {
      type: Function,
      required: false,
      default: () => {
      },
    },
    reduce: {
      type: Function,
      required: false,
      default: (v) => v,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    fetch: {
      type: Function,
      required: false,
      default: () => {
      },
    },
    pageSize: {
      type: Number,
      required: false,
      default: 10,
    },
    value: {
      type: [Array, Object, String, Number],
      default: null,
    },
    filters: {
      type: Object,
      default() {
        return {};
      },
    },
    otherProps: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    notFetchOnMount: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      observer: null,
      selectLoading: false,
      localeOptions: [],
      searchText: "",
      selected: null,
      nextPage: 1,
      search: null,
      select: null,
      oldPosition: null,
    };
  },
  watch: {
    value(newValue) {
      this.selected = newValue;
    },
  },
  mounted() {
    if (!this.notFetchOnMount) {
      this.loadOptions();
    }
  },
  methods: {
    onSelected(value) {
      this.$emit("input", value);
    },
    onOpen() {
      const {uid} = this.$refs.selectV;
      setTimeout(() => {
        this.select = document.getElementById(`vs${uid}__listbox`);
        this.select.addEventListener("scroll", () => {
          if (
              this.select.scrollTop + this.select.clientHeight >=
              this.select.scrollHeight - 5
          ) {
            this.loadOptions();
            this.oldPosition = this.select.scrollTop;
          }
        });
      }, 500);
    },
    async onSearch(search, loading) {
      // loading(true)
      this.search = search;
      this.nextPage = 1;
      await this.fetch({
        search: this.search,
        page: this.nextPage,
        page_size: 15,
        ...this.filters,
      });
      this.localeOptions = this.options.results;
      this.nextPage = this.options.next;
      this.$nextTick(() => {
        // loading(false)
        this.onOpen();
      });
    },
    refresh(params) {
      this.nextPage = 1;
      this.localeOptions = [];
      this.loadOptions(params);
    },
    clear() {
      this.nextPage = null;
      this.localeOptions = [];
    },
    async loadOptions(params) {
      // try {
      if (this.nextPage) {
        await this.fetch({
          search: this.search,
          page: this.nextPage,
          page_size: 15,
          ...this.filters,
          ...params,
        });
        if (this.nextPage !== this.options.next) {
          this.nextPage = this.options.next;
          this.localeOptions.push(...this.options.results);
          this.$nextTick(() => {
            const {uid} = this.$refs.selectV;
            document.getElementById(`vs${uid}__listbox`).scrollTop =
                this.oldPosition;
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
