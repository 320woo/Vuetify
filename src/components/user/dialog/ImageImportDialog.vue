<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-tabs
        v-model="active"
        color="cyan"
        dark
        slider-color="yellow"
      >
        <v-tab
          v-for="(item, index) in tabs"
          :key=index
          ripple
        >
          {{ item }}
        </v-tab>
        <v-spacer></v-spacer>
        <v-btn
          icon
          flat
          @click="closePopup()"
        >
          <v-icon>
            clear
          </v-icon>
        </v-btn>
        <v-tab-item
          v-for="n in 3"
          :key="n"
        >
          <v-card flat>
            <picture-search v-if="n === 1"></picture-search>
            <result-search v-if="n === 2"></result-search>
            <upload-history v-if="n === 3"></upload-history>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
  </v-layout>
</template>

<script>
  import PictureSearch from '@/components/user/dialog/PictureSearch'
  import ResultSearch from '@/components/user/dialog/ResultSearch'
  import UploadHistory from '@/components/user/dialog/UploadHistory'

  export default {
    name: "ImageImportDialog",
    components: {
      PictureSearch,
      ResultSearch,
      UploadHistory
    },
    data: () => ({
      dialog: false,
      tabs: ["사진조회", "결과물 조회", "업로드 히스토리"],
    }),
    created() {
      this.dialog = true
    },
    methods: {
      closePopup() {
        this.dialog = false
        this.$emit('close')
      },
    }

  }
</script>

<style scoped>

</style>
