<template>
  <div v-if="mission">
    <v-card class="task-card-wrapper">
      <v-layout row wrap class="task-status-wrapper">
        <v-flex xs12 sm6 md4 lg3 xl2>
          <div v-if="isSelected">
            <v-img :src="icons.selectedItem" width="5px" height="250px"/>
          </div>
        </v-flex>
        <v-flex xs7>
          <mission-status :status="mission.state"></mission-status>
        </v-flex>
      </v-layout>
      <v-container fluid>
        <v-layout row wrap>
          <v-layout class="task-card-category-type-wrapper">
            <v-layout
              justify-center
              align-center
              class="task-card-category-type"
            >
              <v-chip
                :color="_calBadgeColorByCategory(mission.mission_type_category)"
                small
                label
                text-color="white"
              >
                {{ mission.mission_type_name }}
              </v-chip>
            </v-layout>
          </v-layout>
          <v-flex class="task-card-image">
            <v-layout align-center justify-center>
              <!-- <img :src="`https://picsum.photos/150/150?image=10`" /> -->
              <v-img :src="_convertURL(task.asset_thumbnail_url)" width="120px">
              </v-img>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-container class="pt-0">
              <v-layout column>
                <v-layout pl-2 row wrap align-center justify-start>
                  <MissionInformation :missioninfo="missioninfo"/>
                  <v-flex>
                    <v-layout justify-end>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          style="min-width: 0!important;
                        border-radius: 10px !important;
                        border: 1px solid #E1E2E4;
                        background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);"
                          ripple
                          @click.prevent="moveToMissionHistory()"
                        >
                          <v-icon dark>
                            history
                          </v-icon>
                        </v-btn>
                        <span>작업 히스토리</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-divider class="ma-1"></v-divider>

                <v-layout row>
                  <v-flex v-if="isVisibleStartButton && isVisibleWorkButtons">
                    <!--                    Todo: 정사영상, ndvi 분기 -->
                    <v-btn
                      v-if="isVisible2dMapButton"
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="show2DMapDialogOverride()"
                    >
                      <img class="button-content-icon" :src="icons.map2D"/>
                      2D Map
                    </v-btn>
                    <v-btn
                      v-if="isVisible3dMapButton"
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="_onClickMove3DMap()"
                    >
                      <img class="button-content-icon" :src="icons.model3D"/>
                      3D Model
                    </v-btn>
                    <!-- <v-btn
                      v-if="isVisibleNDVIButton"
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="showNDVIDialog()"
                    >
                      <img class="button-content-icon" :src="icons.ndvi"/>
                      NDVI
                    </v-btn> -->
                    <v-btn
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="showOriginalImageView()"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.image"/>
                      원본보기
                    </v-btn>
                    <v-menu
                      v-if="task.status === 40"
                      transition="slide-y-transition"
                      offset-y
                    >
                      <v-btn
                        class="task-card-menu-button"
                        slot="activator"
                        color="taskButton"
                        dark
                        ripple
                        small
                      >
                        <img
                          class="button-content-icon"
                          :src="icons.download"
                        />
                        <span>다운로드</span>
                      </v-btn>
                      <v-list
                        dense
                        v-for="(item, index) in _convertAssets(
                          task.downloadasset
                        )"
                        :key="index"
                      >
                        <v-list-tile @click="_downLoadAsset(item.name)">
                          {{ item.menu }}
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-divider class="ma-1"></v-divider>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-layout>
                    <v-layout align-center style="max-width: fit-content">
                      <v-btn
                        v-if="!isuser()"
                        @click="openUploadModal()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <img :src="icons.image" class="mr-1"/>
                        이미지 선택
                      </v-btn>
                      <v-btn
                        v-if="!isuser()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                        @click="openFileSelectDialig()"
                      >
                        <img :src="icons.image" class="mr-1"/>
                        이미지 검색
                      </v-btn>
                    </v-layout>
                  </v-layout>
                  <!-- TODO : 시작/재시작/취소 기능 임시로 붙임.. 수정할 것~ (permission 이슈 확인필요) -->
                  <v-layout>
                    <v-btn
                      v-if="isVisibleStartButton && !isuser()"
                      class="task-card-menu-button start"
                      color="indigo"
                      @click="startTask()"
                      dark
                      ripple
                      small
                    >
                      <!-- :disabled="this.$session.get('permission') != 'rw'" -->
                      {{ task.status === 50 ? "재시작" : "시작" }}
                    </v-btn>
                    <v-btn
                      v-if="task.status === 20 && !isuser()"
                      class="task-card-menu-button cancel"
                      color="red"
                      @click="cancelTask()"
                      dark
                      ripple
                      small
                    >
                      <!-- :disabled="this.$session.get('permission') != 'rw'" -->
                      취소
                    </v-btn>
                  </v-layout>
                  <v-layout row v-if="!isuser()">
                    <v-spacer></v-spacer>
                    <v-layout justify-end>
                      <v-divider class="ma-1" vertical></v-divider>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          class="default-action-button"
                          ripple
                          @click.prevent="editMissionReportOverride()"
                        >
                          <img :src="icons.edit"/>
                        </v-btn>
                        <span>편집</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          class="default-action-button"
                          ripple
                          @click.prevent="deleteMissionOverride()"
                        >
                          <img :src="icons.delete"/>
                        </v-btn>
                        <span>삭제</span>
                      </v-tooltip>
                    </v-layout>
                  </v-layout>
                </v-layout>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
        <v-slide-y-transition v-if="showFileView && mission.project_id && mission.task_id">
          <task-storage-file-view
            :project_id="mission.project_id"
            :task="task"
            ref="taskStorageFileViewRef"
          >
          </task-storage-file-view>
        </v-slide-y-transition>
      </v-container>
      <v-progress-linear
        class="mb-0"
        color="toolbar"
        :active="task.status === 20"
        :indeterminate="true"
      ></v-progress-linear>
    </v-card>
    <map-dialog v-if="mapDialog" @close="mapDialog = false"/>
    <ndvi-dialog v-if="ndviDialog" @close="ndviDialog = false"/>
    <progress-dialog :is-show-dialog="showDialog"></progress-dialog>
    <DetailImageView
      v-if="enableDetailView"
      :image-list="imageList"
      :detailViewType="Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_IMAGE"
      @close="enableDetailView = false"
    ></DetailImageView>
    <!-- <v-dialog
      v-model="storageUploadDialog"
      persistent
      @keydown.esc="closeUploadModal"
      max-width="600"
    > -->
      <storage-upload
        v-if="storageUploadDialog"
        :task_algorithm="taskAlgorithm"
        @uploadState="onUploadState"
      ></storage-upload>
    <!-- </v-dialog> -->
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ this.snackbarText }}
      <v-btn dark flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <SearchUploadedFile
      :is-show-dialog="filesSearchDialog"
      :project_id="mission.project_id"
      :task_id="task.task_id"
      :file-list="getSearchFileList"
      :algorithm="task.algorithm"
      :mission_name="mission.name"
      @close="closeFileSelectDialig"
    ></SearchUploadedFile>
    <confirm-delete-mission-dialog
      v-if="deleteDialog"
      :mission="mission"
      @close="refreshList()"
    />
  </div>
</template>

<script>
  import DetailImageView from "@/components/common/DetailImageView"
  import Constants from "@/components/common/constants"
  import { missionMixin } from "@/components/common/mission/missionMixin"
  import { missionListMixin } from "@/components/common/missionListMixin"
  import StorageUpload from "@/components/common/StorageUpload"
  import storageAPI from "@/utils/api/storageAPI"
  import taskAPI from "@/utils/api/taskAPI"
  import moment from "moment-timezone"
  import ProgressDialog from "@/components/common/ProgressDialog"
  import SearchUploadedFile from "@/components/common/SearchUploadedFile"
  import TaskStorageFileView from "@/components/common/project/task/TaskStorageFileView"
  import StringUtil from "@/utils/utils/stringUtil"
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: "CreateMapMission",
    mixins: [missionMixin, missionListMixin],
    components: {
      DetailImageView,
      ProgressDialog,
      StorageUpload,
      SearchUploadedFile,
      TaskStorageFileView,
    },
    props: {
      missioninfo: {
        type: Object
      },
      selectedIndex: {
        type: Number,
        default: -2
      },
      itemIndex: {
        type: Number
      }
    },

    data: () => ({
      enableDetailView: false,
      showDialog: false,

      imageList: [],

      storageUploadDialog: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",

      Constants,

      filesSearchDialog: false,
      showFileView: false,

      FileList: [],

      childSelectedIndex: this.selectedIndex
    }),

    created() {
      console.log('[CreateMapMission::created] selectedIndex: '+this.childSelectedIndex
                    +', itemIndex: '+this.itemIndex)
    },

    methods: {
      refreshList() {
        this.deleteDialog = false
        this.$emit("on-refresh")
      },
      commitSelectedIndex() {
        console.log('################# commit itemIndex: '+this.itemIndex)
        this.$store.commit('setPosition', {
          pos: this.itemIndex
        })
      },
      show2DMapDialogOverride() {
        console.log('################# 111111111111111')
        this.commitSelectedIndex()
        console.log('################# 22222222222222222')
        this.show2DMapDialog()
      },
      _convertURL(url) {
        console.log("CHK => url", url)
        if (url instanceof Object || !url) {
          return require("@/assets/AGDrone-CreateMap.svg")
        } else {
          return Constants.TASK_MANAGER_SERVER_URL + url
        }
      },
      async _onClickImageUploadButton() {
        this.commitSelectedIndex()

        const areaId = this.mission.area_id
        const diaryId = null

        console.log("[_onClickImageUploadButton] mission : ", this.mission)
        const params = {
          req_time: moment().format(),
          tag: `area:${areaId}, diary:${diaryId}`,
          comment: "uploaded from web [Mission Image Upload]",
          images: this.getUploadFiles
        }

        console.log("_onClickImageUploadButton request param : ", params)

        this.showDialog = true
        const response = await storageAPI.uploadImages(params)
        console.log("_onClickImageUploadButton response : ", response)

        if (response.message.toLowerCase() === "ok") {
          let imageIds = response.files.map(data => {
            return data.storage_id
          })

          console.log("[_onClickImageUploadButton] imageIds : ", imageIds)
          let setImageRequestParam = {
            project_id: this.mission.project_id,
            task_id: this.mission.task_id,
            storagefiles: imageIds
          }
          const setImageResponse = await taskAPI.setImageInfoToTask(
            setImageRequestParam
          )
          console.log(
            "[_onClickImageUploadButton] setImageResponse : ",
            setImageResponse
          )
        }
        this.showDialog = false
      },

      async startTask() {
        this.commitSelectedIndex()

        const param = {
          project_id: this.mission.project_id,
          task_id: this.mission.task_id
        }

        this.showDialog = true
        const response = await taskAPI.startTask(param)
        if (response.data.returnCode === 0) {
          await this.requestTaskInfo()
        }

        this.showDialog = false
        console.log("[startTask] response : ", response)
      },

      async cancelTask() {
        this.commitSelectedIndex()

        const param = {
          project_id: this.mission.project_id,
          task_id: this.mission.task_id
        }

        this.showDialog = true
        const response = await taskAPI.cancelTask(param)
        if (response.data.returnCode === 0) {
          await this.requestTaskInfo()
        }

        this.showDialog = false
        console.log("[cancelTask] response : ", response)
      },

      openUploadModal() {
        this.commitSelectedIndex()

        this.storageUploadDialog = true
      },

      closeUploadModal() {
        this.storageUploadDialog = false
      },

      showOriginalImageView() {
        this.commitSelectedIndex()

        this.showFileView = !this.showFileView
      },

      editMissionReportOverride() {
        this.commitSelectedIndex()
        this.editMissionReport()
      },

      deleteMissionOverride() {
        this.commitSelectedIndex()
        this.showDeleteDialog()
      },

      async openFileSelectDialig() {
        this.commitSelectedIndex()

        try {
          const response = await storageAPI.searchFiles()
          console.log("[SearchUploadedFile] response : ", response.data.files)
          this.FileList = response.data.files
          this.isShowComponent = true
        } catch (err) {
          console.log(err)
          return
        }

        this.filesSearchDialog = true
      },

      closeFileSelectDialig() {
        this.filesSearchDialog = false
      },

      onUploadState: async function(state) {
        console.log(state)
        if (state.name == "started") {
          // 업로드 시작됨
          console.log("업로드 시작!")
          this.snackbarText = "파일 업로드 중입니다. 페이지를 벗어나지 마세요."
          this.snackbarColor = "orange"
          this.snackbar = true
        }
        if (state.name == "uploaded") {
          // 업로드 완료됨
          console.log("업로드 완료!", state.files)
          this.closeUploadModal()
          this.snackbar = false
          this.snackbarText = "파일 업로드 완료!"
          this.snackbarColor = "blue"
          this.snackbar = true
          const storageFiles = state.files
            .filter(f => f.response && f.response.message === "OK")
            .flatMap(f => f.response.files.map(s => s.storage_id))

          await this.setImageInfoToTask(storageFiles)

          let resp = await storageAPI.searchImagesByStorageIds(storageFiles)
          //console.log('####### [searchImagesByStorageIds] response: ', resp)

          let images = resp.data.files//this.getUploadFiles
          console.log('[onUploadState]', images)
          if (images.length > 0) {
            if (images[0].gps_time) {
              let generatedDateTime = images[0].gps_time
              console.log('[onUploadState] generatedDateTime: '+generatedDateTime)

              let payload = {
                project_id: this.missioninfo.project_id,
                task: {
                  task_id: this.missioninfo.task_id,
                  algorithm: this.taskAlgorithm,
                  name: this.missioninfo.name,
                  base_date: generatedDateTime
                }
              }
              console.log('[onUploadState] updateTask info: ', payload)
              await taskAPI.updateTask(payload)
            }
            else {
              console.log('[onUploadState] there is no exif info')
            }
          }
          else {
            console.log('[onUploadState] there is no imageList')
          }

          await this.requestTaskInfo()
          if (this.showFileView) {
            await this.$refs.taskStorageFileViewRef.reloadList()
          }
        }
        if (state.name == "close") {
          // 다이얼로그 닫기
          console.log("업로드 다이얼로그 닫기!")
          if (this.snackbarColor == "blue") {
            this.snackbar = false
          }
          this.closeUploadModal()
        }
      },
      async setImageInfoToTask(storageFiles) {
        if (storageFiles.length > 0) {
          console.log("[setImageInfoToTask] storageFiles : ", storageFiles)
          let setImageRequestParam = {
            project_id: this.mission.project_id,
            task_id: this.mission.task_id,
            storagefiles: storageFiles
          }
          const setImageResponse = await taskAPI.setImageInfoToTask(
            setImageRequestParam
          )
          console.log(
            "[setImageInfoToTask] setImageResponse : ",
            setImageResponse
          )
        }
      },
      _onClickMove3DMap() {
        console.log(this.missioninfo.project_id, this.missioninfo.task_id)
        console.log(this.missioninfo)
        // console.log(this.project_id.toString(), this.task.task_id.toString())
        const route = this.$router.resolve({
          name: "3dmap",
          params: {
            projectId: this.missioninfo.project_id.toString(),
            taskId: this.missioninfo.task_id.toString()
          }
        })
        window.open(route.href, "_blank")
      },
      _convertAssets(obj) {
        let output = Object.keys(obj).map(key => {
          return { menu: obj[key], name: key }
        })
        return output
      },
      _downLoadAsset(name) {
        const param = {
          project_id: this.mission.project_id,
          task_id: this.mission.task_id,
          asset_name: name
        }
        const assetsUrl = taskAPI.assetsDownloadUrl(param)
        console.log("downloadAssetUrl:", assetsUrl)

        const link = document.createElement("a")
        link.href = assetsUrl
        link.setAttribute("download", name) //or any other extension
        document.body.appendChild(link)
        link.click()
      }
    },

    watch: {
      getSelectedIndex (val, oldVal) {
        console.log('####### itemIndex: '+this.itemIndex+', watched: ', val)
        this.childSelectedIndex = val
      }
    },

    computed: {
      getSelectedIndex () {
        return this.$store.getters.getPosition
      },
      isSelected() {
        return (this.childSelectedIndex === this.itemIndex)
      },
      isVisibleStartButton() {
        return this.task.status !== 20
        // return this.task.status !== 20 && this.task.images_count == 0
      },
      taskAlgorithm() {
        return this.task_algorithm(this.missioninfo)
      },
      isVisible2dMapButton() {
        return this.taskAlgorithm === Constants.TASK_ALGORITHM_NDVI ||
          this.taskAlgorithm === Constants.TASK_ALGORITHM_ODM ||
          this.taskAlgorithm === Constants.TASK_ALGORITHM_AI ||
          this.taskAlgorithm === Constants.TASK_ALGORITHM_GEOTIFF
      },
      isVisible3dMapButton() {
        return this.taskAlgorithm === Constants.TASK_ALGORITHM_NDVI ||
          this.taskAlgorithm === Constants.TASK_ALGORITHM_ODM ||
          this.taskAlgorithm === Constants.TASK_ALGORITHM_AI
      },
      isVisibleNDVIButton() {
        return this.taskAlgorithm === Constants.TASK_ALGORITHM_NDVI
      },
      getSearchFileList() {
        return this.FileList
      },
      isVisibleWorkButtons() {
        return this.task.status !== 50
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/mission.scss";
</style>
