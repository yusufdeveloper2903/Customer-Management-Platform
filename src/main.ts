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
import {createPinia} from "pinia";
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
import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";
import {vMaska} from "maska";
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Paginate from "vuejs-paginate-next";
import DeleteModal from "@/components/DeleteModal.vue";
import Icon from "@/components/Icons/Icon.vue";
import Vue3TagsInput from 'vue3-tags-input';


//DECLARED VARIABLES
const app = createApp(App);



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
app.use(i18n);
UIkit.use(icons);
app.use(Paginate);
app.component('DeleteModal', DeleteModal)
app.component("EasyDataTable", Vue3EasyDataTable);
app.component("Multiselect", Multiselect);
app.component("TwPagination", VueTailwindPagination);
app.component("VSelect", vSelect);
app.component("Icon", Icon);
app.component("Vue3TagsInput", Vue3TagsInput)


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
