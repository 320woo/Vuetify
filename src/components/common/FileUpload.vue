<template>
  <div class="fileUpload">
    <file-upload-component
      ref="upload"
      v-model="uploadFiles"
      :multiple="true"
      :extensions="extensions"
      :accept="accept"
      :add-index="true"
      @input-filter="inputFilter"
    >
    </file-upload-component>
  </div>
</template>

<script>
import FileUploadComponent from "vue-upload-component"
import * as types from "@/vuex/mutation-types"

export default {
  name: "FileUpload",
  components: {
    FileUploadComponent
  },
  data: () => ({
    accept: "image/png,image/gif,image/jpeg,image/webp, image/tiff",
    extensions: "gif,jpg,jpeg,png,webp, tif, tiff"
  }),

  created() {
    console.log("[created] ")
    this.$store.commit(types.CLEAR_UPLOAD_FILES)
  },

  methods: {
    addPhoto() {
      console.log("[addPhoto] ")
      let input = this.$refs.upload.$el.querySelector("input")

      this.directory = false
      input.directory = false
      input.webkitdirectory = false
      input.multiple = true

      input.onclick = null
      input.click()

      this.$store.commit(types.CLEAR_UPLOAD_FILES)
    },

    inputFilter(newFile, oldFile, prevent) {
      console.log("[inputFilter] ")
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp|tif|tiff)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ""
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  },

  computed: {
    uploadFiles: {
      get() {
        return this.$store.getters.getUploadFiles
      },
      set(value) {
        this.$emit("onImageFile", value)
        this.$store.commit(types.SET_UPLOAD_FILES, value)
      }
    }
  }
}
</script>

<style scoped>
.fileUpload {
  visibility: hidden;
  height: 0px;
}
</style>
