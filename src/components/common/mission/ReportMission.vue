<template>
  <div v-if="mission">
    <v-card class="task-card-wrapper">
      <v-layout class="task-status-wrapper">
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
              <!-- <img :src="`https://picsum.photos/150/150?image=10`" width="120px" /> -->
              <img :src="_convertURL(task.asset_thumbnail_url)" width="120px"/>
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
                          @click.prevent="moveToMissionHistoryOverride()"
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
                  <v-flex>
                    <v-btn
                      v-if="isuser()"
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="moveToAnalysisMap"
                    >
                      <v-icon small>insert_drive_file</v-icon>
                      분석 보고서 열람
                    </v-btn>
                    <v-btn
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="showFiles()"
                    >
                      <v-icon small>attachment</v-icon>
                      첨부파일 보기
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-divider class="ma-1"></v-divider>
                <v-layout row>
                  <v-layout>
                    <v-layout align-center style="max-width: fit-content">
                      <v-btn
                        v-if="isShowReportCategory(2)"
                        @click="moveToAnalysisTimeSeriesOverride()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <v-icon small>burst_mode</v-icon>
                        시계열 분석
                      </v-btn>
                      <v-btn
                        v-if="isShowReportCategory(3)"
                        @click="moveToAnalysisMapOverride()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <v-icon small>panorama_wide_angle</v-icon>
                        분석의견 작성
                      </v-btn>
                      <v-btn
                        v-if="isShowReportCategory(4)"
                        @click="moveToAnalysisCompareOverride()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <v-icon small>filter_b_and_w</v-icon>
                        영역 비교
                      </v-btn>
                      <!-- <v-btn
                        v-if="isShowReportCategory(5)"
                        @click="moveToAnalysisDEM()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <v-icon small>terrain</v-icon>
                        경사도 분석
                      </v-btn> -->
                      <v-btn
                        v-if="!isuser()"
                        @click="openUploadModal()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <v-icon small>cloud_upload</v-icon>
                        분석보고서 업로드
                      </v-btn>
                    </v-layout>
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
        <v-layout row>
          <!-- <v-slide-y-transition>
            <v-flex class="task_name">{{ mission.project_id }}/{{ mission.task_id }}</v-flex>
            <task-images-view
              v-if="visible && mission.project_id && mission.task_id"
              :project_id="mission.project_id"
              :task="mission.task_id"
            >
            </task-images-view>
          </v-slide-y-transition> -->
          <v-card>
            <TaskStorageFileReportView
              v-if="visible && mission.project_id && mission.task_id"
              :project_id="mission.project_id"
              :task="getTask"
            >
            </TaskStorageFileReportView>
          </v-card>
        </v-layout>
      </v-container>
    </v-card>
    <!-- Dialog -->
    <analysis-mission-dialog
      v-if="analysisDialog"
      :analysis-data="analysisData"
      @close="analysisDialog = false"
    />
    <image-import-dialog
      v-if="imageImportDialog"
      @close="imageImportDialog = false"
    />
    <!-- <v-dialog
      v-model="storageUploadDialog"
      persistent
      @keydown.esc="closeUploadModal"
      max-width="600"
    > -->
      <storage-upload
        v-if="storageUploadDialog"
        task_algorithm=""
        @uploadState="onUploadState"
      ></storage-upload>
    <!-- </v-dialog> -->
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ this.snackbarText }}
      <v-btn dark flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <confirm-delete-mission-dialog
      v-if="deleteDialog"
      :mission="mission"
      @close="refreshList()"
    />

  </div>
</template>

<script>
  import { missionMixin } from '@/components/common/mission/missionMixin'
  import TaskStorageFileReportView from '@/components/common/project/task/TaskStorageFileReportView'
  import taskAPI from '@/utils/api/taskAPI'
  import ProgressDialog from '@/components/common/ProgressDialog'
  import StorageUpload from '@/components/common/StorageUpload'

  export default {
    name: 'ReportMission',
    mixins: [missionMixin],
    props: {
      selectedIndex: {  
        type: Number,
        default: -2
      },
      itemIndex: {
        type: Number
      }
    },
    data: () => ({
      visible: false,
      isFileAttached: false,

      storageUploadDialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: ''
    }),
    components: {
      ProgressDialog,
      StorageUpload,
      TaskStorageFileReportView: TaskStorageFileReportView
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
      moveToMissionHistoryOverride() {
        this.commitSelectedIndex()
        this.moveToMissionHistory()
      },
      showFiles() {
        this.commitSelectedIndex()
        this.visible = !this.visible
      },
      moveToAnalysisTimeSeriesOverride() {
        this.commitSelectedIndex()
        this.moveToAnalysisTimeSeries()
      },
      moveToAnalysisMapOverride() {
        this.commitSelectedIndex()
        this.moveToAnalysisMap()
      },
      moveToAnalysisCompareOverride() {
        this.commitSelectedIndex()
        this.moveToAnalysisCompare()
      },
      _convertURL(url) {
        return require('@/assets/AGDrone-Report.svg')
      },
      // _getAttachedFile() {
      //   this.isFileAttached = false
      //   if (this.task) {
      //     if ("taskfiles" in task) {
      //       if ("storafefiles" in this.task.taskfiles) {
      //         console.log("_getAttachedFile storagefiles: ", this.task.taskfiles.storagefiles)
      //         if (this.task.taskfiles.storagefiles.length > 0) {
      //           this.isFileAttached = true
      //         }
      //       }
      //     }
      //   }
      // },

      isShowReportCategory(btnid) {
        if (this.isuser() == true) {
          return false
        }
        if (this.mission.mission_type_name == '피해분석') {
          switch (btnid) {
            case 1:
            case 4:
              return true
          }
        } else if (this.mission.mission_type_name == '생육분석') {
          switch (btnid) {
            case 1:
            case 2:
            case 3:
              return true
          }
        } else if (this.mission.mission_type_name == '경사도분석') {
          switch (btnid) {
            case 1:
            case 5:
              return true
          }
        }
        return false
      },

      openUploadModal() {
        this.storageUploadDialog = true
        this.commitSelectedIndex()
      },
      editMissionReportOverride() {
        this.commitSelectedIndex()
        this.editMissionReport()
      },
      deleteMissionOverride() {
        this.commitSelectedIndex()
        this.showDeleteDialog()
      },
      closeUploadModal() {
        this.storageUploadDialog = false
      },
      onUploadState: async function(state) {
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
          console.log('업로드 완료!', state.files)
          this.closeUploadModal()
          this.snackbar = false
          this.snackbarText = '파일 업로드 완료!'
          this.snackbarColor = 'blue'
          this.snackbar = true
          const storageFiles = state.files
            .filter(f => f.response && f.response.message === 'OK')
            .flatMap(f => f.response.files.map(s => s.storage_id))

          await this.setImageInfoToTask(storageFiles)
          await this.requestTaskInfo()
        }
        if (state.name == 'close') {
          // 다이얼로그 닫기
          console.log('업로드 다이얼로그 닫기!')
          if (this.snackbarColor == 'blue') {
            this.snackbar = false
          }
          this.closeUploadModal()
          await this.requestTaskInfo()
        }
      },
      getstoragefiles() {
        if (Object.keys(this.task).includes('taskfiles') == false) {
          console.log('[setImageInfoToTask] taskfiles not found')
          return false
        }
        if (Object.keys(this.task.taskfiles).includes('storagefiles') == false) {
          console.log('[setImageInfoToTask] storagefile not found')
          return false
        }
        return true
      },
      async setImageInfoToTask(storageFiles) {
        var prevstoragefiles = []
        if (Object.keys(this.task).includes('taskfiles') == false) {
          console.log('[setImageInfoToTask] taskfiles not found')
          return
        }
        if (Object.keys(this.task.taskfiles).includes('storagefiles') == false) {
          console.log('[setImageInfoToTask] storagefile not found')
          return
        }

        prevstoragefiles = this.task.taskfiles.storagefiles
        if (storageFiles.length > 0) {
          console.log('[setImageInfoToTask] prevstoragefiles : ', prevstoragefiles)
          console.log('[setImageInfoToTask] storageFiles : ', storageFiles)
          for (var i = 0; i < prevstoragefiles.length; i++) {
            storageFiles.unshift(prevstoragefiles[i])
          }
          let setImageRequestParam = {
            project_id: this.mission.project_id,
            task_id: this.mission.task_id,
            storagefiles: storageFiles
          }
          const setImageResponse = await taskAPI.setImageInfoToTask(
            setImageRequestParam
          )
          console.log(
            '[setImageInfoToTask] setImageResponse : ',
            setImageResponse
          )
        }
      }
    },

    watch: {
      getSelectedIndex (val, oldVal) {
        console.log('####### itemIndex: '+this.itemIndex+', watched: ', val)
        this.selectedIndex = val
      }
    },  
    computed: {
      isSelected() {
        return (this.selectedIndex === this.itemIndex)
      },
      getSelectedIndex () {
        return this.$store.getters.getPosition
      },
      analysisData() {
        return {
          id: this.mission.mission_id,
          areaBoundary: this.mission.area_boundary.area,
          areaName: this.mission.area_name,
          wishDate: this.getDate(this.mission.wish_dat)
        }
      },
      getTask() {
        return this.task
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/mission.scss";
</style>
