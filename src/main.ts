//IMPORTED FILES
import {createApp} from "vue";
import App from "./App.vue";
import router from "./router/index";
import i18n from "@/plugins/i18n";
import "./assets/style/style.css";
import "@/assets/style/tailwind.css";
import "@/assets/style/responsive.scss";
import "@/assets/components/components.scss";
import VueTailwindPagination from "@/components/Pagination.vue"
import ability from "@/plugins/casl/ability";
import {abilitiesPlugin} from "@casl/vue";
import {createPinia} from "pinia";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {QuillEditor} from '@vueup/vue-quill'
import Vue3EasyDataTable from "vue3-easy-data-table";
import "./assets/style/vue3-easy-data-table.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import Cleave from "vue-cleave-component";
import Vue3Toasity, {toast} from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "./assets/pagination.css";
import vSelect from "vue-select";
import "./assets/style/vue-select/vue-select.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";
import {vMaska} from "maska";
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Paginate from "vuejs-paginate-next";
import DeleteModal from "@/components/DeleteModal.vue";
import LazySelect from "./components/LazySelect.vue";
import VueApexCharts from "vue3-apexcharts";
import Icon from "@/components/Icons/Icon.vue";
//DECLARED VARIABLES
const app = createApp(App);


QuillEditor.props.globalOptions.default = () => globalOptions
const globalOptions = {
    readOnly: false,
    theme: 'snow',
}


//APP USE
app.use(createPinia());
app.use(router);
app.use(Cleave);
app.directive("maska", vMaska);
app.use(Vue3Toasity, {
    autoClose: 3000,
    hideProgressBar: true,
    newestOnTop: true,
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: "colored",
});
// app.use(VueNativeSock, import.meta.env.VITE_SYSTEM_INFO_WEBSOCKET);
app.use(abilitiesPlugin, ability, {
    useGlobalProperties: true,
});
app.use(i18n);
UIkit.use(icons);
app.use(Paginate);
app.component('Editor', QuillEditor)
app.component("Apexchart", VueApexCharts);
app.component('DeleteModal', DeleteModal)
app.component("Datepicker", Datepicker);
app.component("LazySelect", LazySelect);
app.component("EasyDataTable", Vue3EasyDataTable);
app.component("Multiselect", Multiselect);
app.component("TwPagination", VueTailwindPagination);
app.component("VSelect", vSelect);
app.component("VueDatePicker", VueDatePicker);
app.component("Icon", Icon);


//FUNCTIONS
function showOfflineMessage() {
    toast.error(i18n.global.locale.value == 'uz' ? "Siz internet aloqasini yo'qotdingiz" : 'Вы потеряли подключение к Интернету');
}

function hideOfflineMessage() {
    toast.error(i18n.global.locale.value == 'uz' ? "Siz yana internetga ulandingiz" : 'Вы снова подключены к Интернету');
}


//WINDOW
window.addEventListener("offline", showOfflineMessage);
window.addEventListener("online", hideOfflineMessage);

app.mount("#app");
