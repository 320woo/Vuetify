<template>
<v-container fluid>
  <v-layout column wrap class="ml-auto">
    <v-card class="card-header"
            color="#E6EDFF">
      <v-container fluid>
        <v-layout align-center
                  justify-center
                  row
                  wrap>
          <v-flex class="card-header-title">
            <v-layout
              align-center
              jusify-center
              wrap>
              <img src="@/assets/prepand_title.png">
              <span class="ml-1">GCS 데이터 가져오기</span>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card>
      <v-container fluid>
        <v-layout row wrap>
          <div>
            <h3>임무 수행후에 GCS에서 생성된 Data파일(이미지, 비행/살포 정보 등)을 불러오는 기능입니다.</h3>
          </div>
          <v-flex xs12>
          <uploader ref="uploader" :options="options" class="uploader-example"
              @file-success="fileSuccess" @complete="complete()">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
              <p>업로드할 파일을 여기에 올리기</p>
              <!-- <uploader-btn>select files</uploader-btn>
              <uploader-btn :attrs="attrs">select images</uploader-btn> -->
              <uploader-btn :directory="true">폴더 선택</uploader-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
          </uploader>
          </v-flex>
          <!-- <v-text-field
            v-model="mission_id"
            label="대상 mission_id"
          ></v-text-field>
          <v-btn @click="setImages()">업로드 완료</v-btn> -->
        </v-layout>
      </v-container>
    </v-card>
  </v-layout>
</v-container>
</template>

<script>
  import storageAPI from '@/utils/api/storageAPI'
  import missionAPI from '@/utils/api/missionAPI'
  import Constants from "@/components/common/constants"
  export default {
    data : () => ({
      options: {
        target: `${Constants.MISSION_SERVER_URL}/import`,
        testChunks: false,
        chunkSize: 1024*1024*500
      },
      attrs: {
        accept: '*'
        //accept: 'image/*'
      },
      mission_id: 0,
      storageIds: []
    }),
    created() {
      this.storageIds = []
    },

    methods: {
      fileSuccess(rootFile, file, message) {
        //alert('rootfile: '+rootFile)

        console.log('[fileSuccess] ', message)

        let response = JSON.parse(message)

        if (response.reason.file != undefined && response.reason.file != null) {
          console.log('push storage id: '+response.reason.file.id)
          this.storageIds.push(response.reason.file.id)
          console.log('storageIds: ', this.storageIds)
        }
      },
      async complete() {
        console.log('[complete]')

        if (this.storageIds.length == 0) {
          console.log('There is no storage id')
          return
        }

        console.log('Storage id length: '+this.storageIds.length)

        for (let i in this.$refs.uploader.fileList) {
          let item = this.$refs.uploader.fileList[i]
          if (item.name.indexOf('mission_') >= 0) {
            this.mission_id = item.name.substring(8, item.name.length)
            break
          }
        }

        let payload = {
          mission_id: this.mission_id,
          storageIds: this.storageIds
        }
        console.log('setImagesToTask(payload): '+JSON.stringify(payload))
        let res = await missionAPI.setImagesToTask(payload)
        console.log(JSON.stringify(res))

        this.storageIds = []
      }
    }
  }
</script>

<style>
  .uploader-example {
    width: auto;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
