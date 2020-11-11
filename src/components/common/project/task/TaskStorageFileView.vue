<template>
  <v-layout>
    <v-layout column>
      <v-layout justify-end>
        <v-btn class="header-menu mr-0"
               slot="activator"
               color="blue"
               @click="_onClickImageUploadButton"
               :disabled="this.$session.get('permission') != 'rw'"
               dark ripple small>
          <v-icon class="pr-1">
            cloud_upload
          </v-icon>
          이미지 추가
        </v-btn>
        <v-btn class="header-menu mr-0"
               v-if="!isGCP"
               slot="activator"
               color="blue"
               @click="_onClickGCPInterfaceButton"
               :disabled="this.$session.get('permission') != 'rw'"
               dark ripple small>
          <v-icon class="pr-1">
            cloud_upload
          </v-icon>
          GCP Interface
        </v-btn>
      </v-layout>
      <v-data-table v-if="isShowComponent"
                    :headers="headers"
                    :items="_getStorageFileList"
                    rows-per-page-text="페이지 당 이미지 갯수"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>
            <v-layout class="ma-1"
                      align-center
                      justify-center>
              <img :src="_getStorageFileUrl(props.item.id)">
            </v-layout>
          </td>
          <td class="text-xs-right">{{ props.item.org_nm}}</td>
          <td class="text-xs-right">{{ props.item.org_size }}</td>
          <td class="text-xs-right">{{ props.item.gps_lat }}</td>
          <td class="text-xs-right">{{ props.item.gps_lng}}</td>
          <td class="text-xs-right">{{ props.item.gps_alt }}</td>
          <td class="text-xs-right justify-end pr-3">
            <v-btn icon
                   class="ma-0"
                   ripple
                   @click.prevent="_onClickImage(props.item.id)">
              <v-icon color="grey"
                      dark
                      small>
                panorama
              </v-icon>
            </v-btn>
            <!-- <v-btn icon
                   class="ma-0"
                   ripple
                   @click.prevent="_onClickDelete(props.item.id)">
              <v-icon color="grey"
                      dark
                      small>
                delete
              </v-icon>
            </v-btn> -->
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            이미지가 존재하지 않습니다.
          </v-alert>
        </template>
      </v-data-table>
    </v-layout>
    <v-dialog v-model="isOpenUploadModal"
              persistent
              @keydown.esc="_closeModal" max-width="600">
      <task-image-upload-modal :project_id="project_id"
                               :task="task"
                               @updateState="_uploadState"/>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout=0
      :color="snackbarColor"
    >
      {{this.snackbarText}}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <detail-image-view
      v-if="enableDetailView"
      :project-id="project_id"
      :task-id="task.task_id"
      :image-list="_getStorageFileList"
      :init-index="imageIndex"
      :detailViewType="Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_PROVIDER_MAP"
      @close="enableDetailView = false"
    ></detail-image-view>
  </v-layout>
</template>


<script>
  import Constants from '@/components/common/constants'
  import TaskImageUploadModal from '@/components/common/project/task/TaskImageUploadModal'
  import DetailImageView from "@/components/common/DetailImageView"
  import {mapActions, mapGetters} from 'vuex'
  import taskAPI from '@/utils/api/taskAPI'
  import StorageAPI from '@/utils/api/storageAPI'

  export default {
    props: {
      project_id: {
        type: String,
        required: true
      },
      task: {
        type: Object,
        required: true
      },
      isGCP: {
        type: Boolean
      }
    },
    data() {
      return {
        isOpenUploadModal: false,
        isShowComponent: false,
        enableDetailView: false,
        headers: [
          {
            text: '이미지 썸네일',
            align: 'center',
            sortable: false,
            value: 'image_thumbnail'
          },
          {text: '이름', align: 'right', sortable: false, value: 'name'},
          {text: '용량', align: 'right', sortable: false, value: 'size'},
          {text: '위도', align: 'right', sortable: false, value: 'lat'},
          {text: '경도', align: 'right', sortable: false, value: 'lon'},
          {text: '고도', align: 'right', sortable: false, value: 'alt'},
          {text: '동작', align: 'right', sortable: false, value: 'action'}
        ],
        snackbar: false,
        snackbarText: '',
        snackbarColor: '',
        imageIndex: null,
        Constants,
        storageFileList: []
      }
    },
    async created() {
      console.log("Image View Created!!!")
      await this.reloadList()
    },
    mounted() {
    },
    updated() {
      console.log("ImageView Updated!!!!!!!!!!!!!!")
    },
    computed: {
      ...mapGetters([
        // 'getTask',
        'getStorageList',
      ]),
      _getStorageFileList() {
        return this.storageFileList
      },
    },
    methods: {
      ...mapActions([
        'requestGetStorageFileList'
      ]),
      async reloadList() {
        await this._requestGetStorageFileList(this.task.taskfiles.storagefiles)
      },
      async _requestGetStorageFileList(storageIds) {
        // console.log("_requestGetStorageFileList " + storageIds)
        await this.requestGetStorageFileList(storageIds)
        this.storageFileList = await this.getStorageList
        // console.log("_requestGetStorageFileList " + this.storageFileList)
        this.isShowComponent = true
      },
      _onClickImageUploadButton() {
        this.isOpenUploadModal = true
      },
      _onClickGCPInterfaceButton() {
        this.$router.push({
          name: 'gcpi',
          // params: {
          //   "projectId": this.project_id,
          //   "taskId": this.task_id
          // },
          query: {
            "projectId": this.project_id,
            "taskId": this.task.task_id
          }
        })
      },
      _closeModal() {
        this.isOpenUploadModal = false
      },
      _uploadState: function (state) {
        console.log(state)
        if (state.name == 'started') {
          // 업로드 시작됨
          console.log('업로드 시작!')
          this.snackbarText = '파일 업로드 중입니다. 페이지를 벗어나지 마세요.'
          this.snackbarColor = 'orange'
          this.snackbar = true
        }
        if (state.name == 'uploaded') {
          // 업로드 완료됨
          console.log('업로드 완료!')
          this.snackbar = false
          this.snackbarText = '파일 업로드 완료!'
          this.snackbarColor = 'blue'
          this.snackbar = true
          // this._requestGetTask({
          //   project_id: this.project_id,
          //   task_id: this.task_id
          // }, Constants.TASK_INFO_ALL)
          this._requestGetFileList({
            projectId: this.project_id,
            taskId: this.task.task_id
          })
        }
        if (state.name == 'close') {
          // 다이얼로그 닫기
          console.log('업로드 다이얼로그 닫기!')
          if (this.snackbarColor == 'blue') {
            this.snackbar = false
          }
          this._closeModal()
        }
      },
      _getStorageFileUrl(fid) {
        return StorageAPI.downloadImageUrl(fid, "thumb")
        // return FileAPI.FileManagerUrl(this.task, FileAPI.FileId(fid)).thumbnailUrl
      },
      _onClickImage(fid) {
        this.imageIndex = this.storageFileList.findIndex(image => {
          // console.log(image)
          return image.id === fid;
        })
        this.enableDetailView = true
      }
    },
    components: {
      'TaskImageUploadModal': TaskImageUploadModal,
      'DetailImageView': DetailImageView
    }
  }
</script>

<style scoped>
  .header-menu {
    text-transform: none !important;
  }

  .image {
    cursor: pointer;
  }

  .image:hover {
    border: 3px solid #2980b9;
  }
</style>
