<script lang="ts" setup>
import { Ref, ref, computed, onMounted } from 'vue';
import UIkit from "uikit";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate, { Validation } from "@vuelidate/core";
import knowledgeBase from "../../store/index";

const { t } = useI18n();
const isSubmitted = ref<boolean>(false);
const store = knowledgeBase()
const emits = defineEmits(["saveNews"]);
const file = ref<string>("")

interface EditData {
  id: number | null,
  title: {
    uz: string,
    ru: string
  } 
    file: string,
    start_time: string,
    status: string,
    url: string
}

var NewsData = ref({
    title: {
      uz: "",
      ru: ""
    },
    photo: "",
    start_time: "",
    status: "",
    url: ""
})

const rules = computed(() => {
  return {   
    title: {
      required: helpers.withMessage("required", required),
    },
    start_time: {
      required: helpers.withMessage("required", required),
    },
  };
  
});

const validate: Ref<Validation> = useVuelidate(rules, NewsData);

const propData = defineProps<{editData: EditData}>();


function openModal(){
  if(propData.editData.id) {
    console.log(propData)
    NewsData.value.title.uz = propData.editData.title.uz
    NewsData.value.title.ru = propData.editData.title.ru
    NewsData.value.photo = propData.editData.file
    NewsData.value.start_time = propData.editData.start_time
    NewsData.value.status = propData.editData.status

  } else {
    NewsData.value.title.uz = ""
    NewsData.value.title.ru = ""
    NewsData.value.photo = ""
    NewsData.value.start_time = ""
    NewsData.value.status = ""
  }
}

const getFile = (e: any) => {
  NewsData.value.photo = e.target.files[0]
  file.value = e.target.files[0]
}

const updateDeal = async () => {
  const success = await validate.value.$validate();
  if (!success) return;

    const formData = new FormData()
    if(file.value){
      formData.append('file', NewsData.value.photo)
      formData.append('title', JSON.stringify(NewsData.value.title))
      formData.append('status', NewsData.value.status)
      formData.append('start_time', NewsData.value.start_time)
    } else {
      // formData.append('file', NewsData.value.photo)
      formData.append('title', JSON.stringify(NewsData.value.title))
      formData.append('status', NewsData.value.status)
      formData.append('start_time', NewsData.value.start_time)
    }

  if (propData.editData.id) {    
    try {
        formData.append('id', propData.editData.id)
        await store.updateNews(formData).then(() => {
          emits("saveNews");
          setTimeout(() => {
            toast.success(t("updated_successfully"));
          }, 200);
          UIkit.modal("#newsModal").hide();
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            // error.response || error.response.data.msg || error.response.data.error || "Error"
            error.response || "Error"

          );
        }
      }
    
  } else {
      try {
        await store.createNews(formData).then(() => {
          emits("saveNews");
          setTimeout(() => {
            toast.success(t("created_successfully"));
          }, 200);
          UIkit.modal("#newsModal").hide();
        });
        isSubmitted.value = false;
      } catch (error: any) {
        isSubmitted.value = false;
        if (error) {
          toast.error(
            // error.response || error.response.data.msg || error.response.data.error || "Error"
            error.response || "Error"

          );
        }
      }
  }
};

onMounted(async() => {
  await store.getStatus()
})
</script>

<template>
  <div id="newsModal" class="uk-flex-top" uk-modal @shown="openModal">
    <div
      class="uk-modal-dialog uk-margin-auto-vertical rounded-lg overflow-hidden"
    >
      <button class="uk-modal-close-default" type="button" uk-close />
      <div class="uk-modal-header">
        <h2 class="uk-modal-title text-xl font-normal text-[#4b4b4b]">
          {{ propData.editData.id ? $t("Change") : $t('Add') }}
        </h2>
      </div>

      <div class="uk-modal-body py-4">
            <form>
              <div class="flex justify-between">
                <label for="title_uz" class="w-full mr-4"> Title uz
                <input
                  id="title_ru"
                  type="text"
                  class="form-input"
                  placeholder="Title"
                  v-model="NewsData.title.uz"
                  :class="validate.title.$errors.length ? 'required-input' : ''"
                />
                <p
                v-for="error in validate.title.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>

            <label for="title_ru" class="w-full"> Title ru
                <input
                  id="title_ru"
                  type="text"
                  class="form-input"
                  placeholder="Title"
                  v-model="NewsData.title.ru"
                  :class="validate.title.$errors.length ? 'required-input' : ''"
                />
                <p
                v-for="error in validate.title.$errors"
                :key="error.$uid"
                class="text-danger text-sm"
              >
                {{ $t(error.$message) }}
              </p>
            </label>
              </div>


            <label for="form-stacked-text" class="mt-4 block">{{ $t('Photo') }}
              <input @input="getFile" type="file" class="form-file-input p-1" :placeholder="NewsData.photo"/>
          </label>

          <label for="form-stacked-text" class="mt-4 block">{{ $t('Status') }}
              <VSelect v-model="NewsData.status" 
                :options="store.statusList && store.statusList.results"
                :getOptionLabel="(name) => name.title[$i18n.locale]"  
                :reduce="(name) => name.id"
                />
            </label>

            <label for="form-stacked-text" class="mt-4 block">{{ $t('Start time') }}
              <VueDatePicker v-model="NewsData.start_time" model-type="yyyy-MM-dd hh:mm" :placeholder="NewsData.start_time"></VueDatePicker>
            </label>

            </form>
      </div>

      <div
        class="uk-modal-footer transition-all flex justify-end gap-3 uk-text-right px-5 py-3 bg-white"
      >
        <button uk-toggle="target: #newsModal" class="btn-secondary">
          {{ $t("cancel2") }}
        </button>

        <button :class="propData.editData.id ? 'btn-warning' : 'btn-success'" @click="updateDeal" :disabled="isSubmitted">
          <img
            src="@/assets/image/loading.svg"
            alt="loading.svg"
            class="inline w-4 h-4 text-white animate-spin mr-2"
            v-if="isSubmitted"
          />
          <span>{{ propData.editData.id ? $t("Change") : $t('Add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
