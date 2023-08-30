import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import i18n from "@/plugins/i18n";

import "./assets/app.sass";
import "./assets/style/style.css";
import "@/assets/style/tailwind.css";
import "@/assets/style/responsive.scss";
import "@/assets/components/components.scss";

import ability from "@/plugins/casl/ability";
import { abilitiesPlugin } from "@casl/vue";
import { createPinia } from "pinia";

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// table
import Vue3EasyDataTable from "vue3-easy-data-table";
import "./assets/style/vue3-easy-data-table.css";

import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import Cleave from "vue-cleave-component";

import Vue3Toasity, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import VueTailwindPagination from "@ocrv/vue-tailwind-pagination";
import "./assets/pagination.css";

import vSelect from "vue-select";
import Input from "@/components/input/Input.vue";
// import 'vue-select/dist/vue-select.css';
import "./assets/style/vue-select/vue-select.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";
import { vMaska } from "maska";

import Paginate from "vuejs-paginate-next";
import FileInput from "./components/FileInput/FileInput.vue";
import LazySelect from "./components/LazySelect.vue";
import VueNativeSock from "vue-native-websocket-vue3";
import VueApexCharts from "vue3-apexcharts";
import Icon from "@/components/Icons/Icon.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Cleave);
app.directive("maska", vMaska);

// toastfy
app.use(Vue3Toasity, {
  autoClose: 3000,
  hideProgressBar: true,
  newestOnTop: true,
  position: toast.POSITION.BOTTOM_RIGHT,
  theme: "colored",
});

app.use(VueNativeSock, import.meta.env.VITE_SYSTEM_INFO_WEBSOCKET);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});
app.use(i18n);
UIkit.use(icons);
app.use(Paginate);

app.component("Apexchart", VueApexCharts);

app.component("Datepicker", Datepicker);
app.component("LazySelect", LazySelect);
app.component("EasyDataTable", Vue3EasyDataTable);
app.component("Multiselect", Multiselect);
app.component("TwPagination", VueTailwindPagination);
app.component("VSelect", vSelect);
app.component("Input", Input);
app.component("FileInput", FileInput);
app.component("VueDatePicker", VueDatePicker);
app.component("Icon", Icon);

// v2
function showOfflineMessage() {
  toast.error("You have lost internet connection");
}

function hideOfflineMessage() {
  toast.success("You are connected to the internet again");
}

window.addEventListener("offline", showOfflineMessage);
window.addEventListener("online", hideOfflineMessage);

app.mount("#app");
