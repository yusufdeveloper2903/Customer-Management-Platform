<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import { VueDraggableNext as draggable } from "vue-draggable-next";
import { onMounted, ref } from 'vue';
import RecipeStorage from '@/modules/Recipes/store/index';
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import MediaContentViewFileModal from "./modals/MediaContentViewFileModal.vue";
import { RecipeMedia } from "../interfaces/index"
import UIkit from "uikit";



// Declared variables
const {t} = useI18n()
const route = useRoute()
const isLoading = ref<boolean>(false);
const store = RecipeStorage()
const itemId = ref<number | null>(null)
  
const openFile = ref<RecipeMedia>({
    id: null,
    media_file: null,
    file_type: "",
    recipes: "",
    index: 0,
    create_date: ""
})


// Onmounted
onMounted(async () => {
 await refresh()
})




// Functions
const refresh = async () => {
  isLoading.value = true;
  try {
    if (route.params.id) {
      await store.getRecipeMediaById(route.params.id)
    }
  } catch (error: any) {
    toast.error(
      error.response || "Error"
    );
  }

  isLoading.value = false;
};


const getFile = (e: any) => {
  localStorage.setItem('media_file', JSON.stringify(e.target.value))
  console.log(e.target.value);
  
}

const deleteAction = async () => {
    isLoading.value = true
    try {
        await store.deleteRecipeMedia(itemId.value);
        UIkit.modal("#file-delete").hide();
        refresh()
        toast.success(t('deleted_successfully'));

        isLoading.value = false
    } catch (error: any) {
        toast.error(
            t('error')
        );
        isLoading.value = false
    }
}


const handleDeleteModal = (id: number | null) => {
    UIkit.modal("#file-delete").show();
    itemId.value = id;
};
</script>

<template>
         <div class="card mt-4">
        <h2 class="text-success mb-3"><b>{{ t('mediacontent') }}</b></h2>

        <div class="mb-3">
          <label
        ><b>{{ t('file') }}</b> 
          <input type="file" class="form-file-input" @change="getFile" >
          <span style="font-size:14px;color:#999999" class="ml-1">
      {{ $t('format_photo') }}: (png / jpg / 1080x1920)
    </span>
        </label>

        <div class="flex justify-center" v-if="isLoading">
          <img src="@/assets/image/loading.svg" alt="loading.svg" class="inline w-4 h-4 text-white animate-spin mr-2"
              />
        </div>

        <draggable class="dragArea list-group w-full" v-else v-model="store.recipeMediaList.data">
        <div class="mt-4 flex justify-between items-center" v-for="item in store.recipeMediaList.data" :key="item.id">
          <span class="flex items-center">
            <span class="flex">
              <Icon icon="Star" color="#FFC107" size="16" v-if="item.file_type === 'PHOTO'"/>
              <span class="mr-4" v-else> </span>
              <Icon icon="Hamburger Menu"  size="16" class="ml-2"/>
            </span>
            <div class="flex justify-left gap-3 mx-2">
              <img
                v-if="item && item.media_file && item.file_type === 'PHOTO'"
                class="w-[45px] h-[45px] rounded object-cover"
                :src="item.media_file"
                alt="Photo"
            />
            <video v-if="item && item.media_file && item.file_type === 'VIDEO'" :src="item.media_file" class="w-[45px] h-[45px] rounded object-cover" alt="Video">
            
            </video>
            
            <div v-else-if="!item.media_file"
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

            <span>
              <h4 class="text-success"><b>{{  item.media_file && item.media_file.length > 30
                    ? item.media_file.slice(0, 30) + "..."
                    : item.media_file}}</b></h4>
              <small>{{ item.create_date }}</small>
            </span>

          </div>
          </span>

          <span class="flex">
            <button @click="openFile = item" uk-toggle="target: #open_video" class="mr-2">
             <Icon icon="Eye" color="#356c2d" v-if="item.file_type === 'PHOTO'"/>
             <Icon icon="Play" color="#356c2d" v-if="item.file_type === 'VIDEO'"/>
            </button>
            <!-- <button class="mx-2">
              <Icon icon="Upload Minimalistic" color="#356c2d" />
            </button> -->
            <button @click="handleDeleteModal(item.id)">
              <Icon icon="Close Square" color="#F44336" />
            </button>
          </span>
</div>
    </draggable>


        </div>
      </div>


      <DeleteModal @delete-action="deleteAction" :id="'file-delete'" />
      <MediaContentViewFileModal  :openFile="openFile"/>
</template>

<style>
/* input[type=file]::before {
  content: "📁";
  color: black;
  margin-right: 10px;
} */

</style>