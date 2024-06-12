<script lang="ts" setup>
// Imported files
import { useI18n } from "vue-i18n";
import FileInput from "@/components/FileInput/FileInput.vue";
import { VueDraggableNext as draggable } from "vue-draggable-next";

// Declared variables
const {t} = useI18n()

</script>

<template>
         <div class="card mt-4">
        <h2 class="text-success mb-3"><b>{{ t('mediacontent') }}</b></h2>

        <div class="mb-3">
          <label
        ><b>{{ t('file') }}</b>
          <FileInput
          name="recipe"
          />
          <!-- v-model="image"
          @remove="splashData.image = null"
          :typeModal="propData.editData.id" -->
        </label>
        <small>{{ t('Content format and size: jpg / mp4 / 1920x1080') }}</small>

        <draggable class="dragArea list-group w-full" >
        <div class="mt-4 flex justify-between items-center">
          <span class="flex items-center">
            <Icon icon="Star" color="#FFC107" size="16" />
            <div class="flex justify-left gap-3 mx-2">
              <!-- <img
                v-if="items && items.photo"
                class="w-[45px] h-[45px] rounded object-cover"
                :src=""
                alt="Rounded avatar"
                @click="onShowFile(items.photo)"
            /> -->
            <!-- v-else -->
            <div
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

            <span>
              <h3 class="text-success"><b>{{ t('Photo.jpg') }}</b></h3>
              <small>12:00 / 22.08.2023</small>
            </span>

          </div>
          </span>

          <span class="flex">
            <button>
              <Icon icon="Eye" color="#356c2d"/>
            </button>
            <button class="mx-2">
              <Icon icon="Upload Minimalistic" color="#356c2d" />
            </button>
            <button>
              <Icon icon="Close Square" color="#F44336"/>
            </button>
          </span>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <span class="flex items-center">
            <Icon icon="Hamburger Menu"  size="16" />
            <div class="flex justify-left gap-3 mx-2">
              <!-- <img
                v-if="items && items.photo"
                class="w-[45px] h-[45px] rounded object-cover"
                :src=""
                alt="Rounded avatar"
                @click="onShowFile(items.photo)"
            /> -->
            <!-- v-else -->
            <div
                class="relative text-primary inline-flex items-center justify-center w-[45px] h-[45px] overflow-hidden bg-primary/10 rounded"
            >
              <Icon icon="User" color="#356c2d"/>
            </div>

            <span>
              <h3 class="text-success"><b>{{ t('Photo.jpg') }}</b></h3>
              <small>12:00 / 22.08.2023</small>
            </span>

          </div>
          </span>
          
          <span class="flex">
            <button>
              <Icon icon="Play" color="#356c2d"/>
            </button>
            <button class="mx-2">
              <Icon icon="Upload Minimalistic" color="#356c2d" />
            </button>
            <button>
              <Icon icon="Close Square" color="#F44336"/>
            </button>
          </span>
        </div>
    </draggable>


        </div>
      </div>
</template>