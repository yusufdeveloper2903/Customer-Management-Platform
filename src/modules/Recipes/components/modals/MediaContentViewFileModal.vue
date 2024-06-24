<script setup lang="ts">
import { ref } from 'vue'
// import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { RecipeMedia } from "../../interfaces/index"
// import UIkit from "uikit";

const emits = defineEmits(["delete_audio"]);
const { t } = useI18n();
const propData = defineProps<{ openFile: RecipeMedia }>();
const videoPlayer = ref();



function pauseVideo() {
    if(propData.openFile.file_type === 'VIDEO')
        videoPlayer.value.pause();
    }
</script>

<template>
    
  <div id="open_video" class="uk-flex-top" uk-modal @hidden="pauseVideo">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
      </div>

      <div class="uk-modal-body py-4 ">
        
          <div class="flex justify-center mb-2 ">
            <div class="box_bg flex justify-center">
              <video v-if="propData.openFile.file_type === 'VIDEO'" :src="propData.openFile.media_file" controls class="vd" ref="videoPlayer"></video>
              <img v-if="propData.openFile.file_type === 'PHOTO'" :src="propData.openFile.media_file" class="img" />
            </div>
        </div>
      </div>

      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 "
      >


        <button uk-toggle="target: #open_video" class="btn-success">
          {{ t("Cancel") }}
        </button>


      </div>
    </div>
  </div>


</template>

<style>
.vd{
    max-height: 600px;
}

.img {
  max-height: 600px;
  min-height: 300px;
}

.box_bg{
  height: 600px;
  width: 500px;
  /* opacity: 0.33; */
  background-color: #000 ;
}
</style>
