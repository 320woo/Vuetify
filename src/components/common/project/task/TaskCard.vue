<template>
  <v-card class="task-card-wrapper">
    <v-layout class="task-status-wrapper">
      <task-status :status="task.status"> </task-status>
    </v-layout>
    <v-container class="pb-0" fluid>
      <v-layout row wrap>
        <v-flex class="task-card-image">
          <v-layout align-center justify-center>
            <img :src="_convertURL(task.asset_thumbnail_url)" />
          </v-layout>
        </v-flex>
        <v-flex>
          <v-container class="pt-0">
            <v-layout column>
              <v-layout pl-2 row wrap align-center justify-start>
                <v-flex class="task_name">{{ task.name }}</v-flex>
                <v-divider class="ma-1" vertical></v-divider>
                <v-flex class="task_date">
                  <v-layout align-center justify-center>
                    {{ _convertDate(task.created_at) }}
                  </v-layout>
                </v-flex>
                <v-divider class="ma-1" vertical></v-divider>
                <v-flex class="task_image_count">
                  <v-layout row align-center justify-center>
                    <img :src="icons.image_dark" />
                    <span class="pl-1">{{ task.images_count }}</span>
                  </v-layout>
                </v-flex>
                <v-divider class="ma-1" vertical></v-divider>
                <v-flex class="task_algorithm">
                  <v-layout align-center justify-center>
                    <v-chip
                      :color="_calAlgorithmBadgeColor(task.algorithm)"
                      small
                      label
                      text-color="white"
                    >
                      {{ task.algorithm }}
                    </v-chip>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-divider class="ma-1"></v-divider>

              <v-layout column>
                <v-layout row>
                  <v-flex>
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

                    <v-btn
                      v-if="_isMap(task)"
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="_onClickMoveMap()"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.map2D" />
                      2D 지도
                    </v-btn>

                    <v-btn
                      v-if="_isScan(task)"
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="_onClickMoveScan()"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.image" />
                      스캔 지도
                    </v-btn>

                    <v-btn
                      v-if="_isNDVI(task)"
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="_onClickMoveNDVIMap"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.ndvi" />
                      NDVI 지도
                    </v-btn>

                    <v-btn
                      v-if="_isThermal(task)"
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="_onClickMoveThermal"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.thermal" />
                      열 영상
                    </v-btn>

                    <v-btn
                      v-if="_is3D(task)"
                      class="task-card-menu-button"
                      color="taskButton"
                      @click="_onClickMove3DMap()"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.model3D" />
                      3D 모델
                    </v-btn>

                    <v-btn
                      class="task-card-menu-button"
                      v-if="task.status !== 20"
                      color="taskButton"
                      @click="visible = !visible"
                      dark
                      ripple
                      small
                    >
                      <img class="button-content-icon" :src="icons.image" />
                      이미지
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-divider class="ma-1" v-if="task.status !== 20"></v-divider>
              </v-layout>

              <v-layout row>
                <v-layout>
                  <v-btn
                    v-if="isVisibleStartButton"
                    class="task-card-menu-button start"
                    color="indigo"
                    @click="
                      requestStartTask({
                        project_id: project_id,
                        task_id: task.task_id
                      })
                    "
                    :disabled="this.$session.get('permission') != 'rw'"
                    dark
                    ripple
                    small
                  >
                    {{ task.status === 50 ? "재시작" : "시작" }}
                  </v-btn>
                  <v-btn
                    v-if="task.status === 20"
                    class="task-card-menu-button cancel"
                    color="red"
                    @click="
                      requestCancelTask({
                        project_id: project_id,
                        task_id: task.task_id
                      })
                    "
                    :disabled="this.$session.get('permission') != 'rw'"
                    dark
                    ripple
                    small
                  >
                    취소
                  </v-btn>
                </v-layout>
                <v-spacer></v-spacer>
                <v-layout justify-end>
                  <v-divider class="ma-1" vertical></v-divider>
                  <v-btn
                    class="default-action-button"
                    ripple
                    :disabled="this.$session.get('permission') != 'rw'"
                    @click.prevent="
                      _onClickEditButton({
                        project_id: project_id,
                        task: JSON.parse(JSON.stringify(task))
                      })
                    "
                  >
                    <img :src="icons.edit" />
                  </v-btn>
                  <v-btn
                    class="default-action-button"
                    ripple
                    :disabled="this.$session.get('permission') != 'rw'"
                    @click.prevent="
                      _onClickRemoveButton({
                        project_id: project_id,
                        task_id: task.task_id
                      })
                    "
                  >
                    <img :src="icons.delete" />
                  </v-btn>
                </v-layout>
              </v-layout>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <v-slide-y-transition>
        <task-images-view
          v-if="visible && task.status !== 20"
          :project_id="project_id"
          :task="task"
        >
        </task-images-view>
      </v-slide-y-transition>
    </v-container>
    <v-progress-linear
      class="mb-0"
      color="toolbar"
      :active="task.status === 20"
      :indeterminate="true"
    ></v-progress-linear>
  </v-card>
</template>

<script>
import Constants from "@/components/common/constants"
import TaskStatus from "./TaskStatus"
import TaskImagesView from "@/components/common/project/task/TaskImagesView"
import StringUtil from "@/utils/utils/stringUtil"
import { mapActions, mapGetters, mapMutations } from "vuex"
import FileAPI from "@/utils/api/fileAPI"
import icons from "@/icons"

export default {
  props: {
    project_id: {
      type: String,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      algorithmBadgeColor: "",
      visible: false,
      icons: icons
    }
  },
  computed: {
    ...mapGetters([
      "getProject",
      "isOpenAddModal",
      "isOpenEditModal",
      "isOpenRemoveModal"
    ]),
    isVisibleStartButton() {
      return this.task.status !== 20
      // return this.task.status !== 20 && this.task.images_count == 0
    }
  },
  methods: {
    ...mapMutations([
      "OPEN_ADD_MODAL",
      "OPEN_EDIT_MODAL",
      "OPEN_REMOVE_MODAL",
      "CLOSE_MODAL",
      "SET_EDIT_TASK",
      "SET_REMOVE_TASK"
    ]),
    ...mapActions([
      "requestGetProject",
      "requestStartTask",
      "requestCancelTask"
    ]),
    _convertDate(date) {
      return StringUtil.getConvertDate(new Date(date)) + " 생성"
    },
    _convertURL(url) {
      if (url instanceof Object || !url) {
        return require("@/assets/empty_thumbnail_image.png")
      } else {
        return Constants.TASK_MANAGER_SERVER_URL + url
      }
    },
    _convertAssets(obj) {
      let output = Object.keys(obj).map(key => {
        return { menu: obj[key], name: key }
      })
      return output
    },
    _calAlgorithmBadgeColor(algorithm) {
      switch (algorithm) {
        case Constants.TASK_ALGORITHM_ODM:
          return "#4CBDCB"
        case Constants.TASK_ALGORITHM_SCAN:
          return "#FF8F93"
        case Constants.TASK_ALGORITHM_NDVI:
          return "#81CAAF"
        case Constants.TASK_ALGORITHM_TEMPERATURE:
          return "#FC4B8F"
        case Constants.TASK_ALGORITHM_GEOTIFF:
          return "#EDAF20"
        case Constants.TASK_ALGORITHM_AI:
          return "#81CFFF"
      }
    },
    _downLoadAsset(name) {
      const { assetsUrl } = FileAPI.FileManagerUrl(
        FileAPI.TaskInfo(this.project_id, this.task.task_id),
        FileAPI.AssetName(name)
      )
      console.log("assetsurl: ", assetsUrl)

      const link = document.createElement("a")
      link.href = assetsUrl
      link.setAttribute("download", name) //or any other extension
      document.body.appendChild(link)
      link.click()
    },
    _isScan(task) {
      return (
        task.status === 40 && task.algorithm === Constants.TASK_ALGORITHM_SCAN
      )
    },
    _isMap(task) {
      return (
        task.status === 40 &&
        (task.algorithm === Constants.TASK_ALGORITHM_ODM ||
          task.algorithm === Constants.TASK_ALGORITHM_GEOTIFF)
      )
    },
    _is3D(task) {
      return (
        task.status === 40 && task.algorithm === Constants.TASK_ALGORITHM_ODM
      )
    },
    _isNDVI(task) {
      return (
        task.status === 40 && task.algorithm === Constants.TASK_ALGORITHM_NDVI
      )
    },
    _isThermal(task) {
      return (
        task.status === 40 &&
        task.algorithm === Constants.TASK_ALGORITHM_TEMPERATURE
      )
    },
    _onClickEditButton(obj) {
      this.SET_EDIT_TASK(obj)
      this.OPEN_EDIT_MODAL()
    },
    _onClickRemoveButton(obj) {
      this.SET_REMOVE_TASK(obj)
      this.OPEN_REMOVE_MODAL()
    },
    _onClickMoveMap() {
      this.$router.push({
        name: "map",
        params: {
          projectId: this.project_id.toString(),
          taskId: this.task.task_id.toString()
        }
      })
    },
    _onClickMoveScan() {
      this.$router.push({
        name: "scan",
        params: {
          projectId: this.project_id.toString(),
          taskId: this.task.task_id.toString()
        }
      })
    },
    _onClickMove3DMap() {
      console.log(this.project_id.toString(), this.task.task_id.toString())
      // this.$router.push({
      //   name: '3dmap',
      //   params: {
      //     "projectId": this.project_id.toString(),
      //     "taskId": this.task.task_id.toString()
      //   }
      // })
      const route = this.$router.resolve({
        name: "3dmap",
        params: {
          projectId: this.project_id.toString(),
          taskId: this.task.task_id.toString()
        }
      })
      window.open(route.href, "_blank")
    },
    _onClickMoveNDVIMap() {
      this.$router.push({
        name: "ndvi",
        params: {
          projectId: this.project_id.toString(),
          taskId: this.task.task_id.toString()
        }
      })
    },
    _onClickMoveThermal() {
      this.$router.push({
        name: "thermal",
        params: {
          projectId: this.project_id.toString(),
          taskId: this.task.task_id.toString()
        }
      })
    }
  },
  components: {
    TaskStatus: TaskStatus,
    TaskImagesView: TaskImagesView
  }
}
</script>

<style scoped>
.task_card_action_button {
  padding: 10px;
  margin-left: 10px;
  min-width: 0 !important;
  min-height: 0 !important;
  border-radius: 10px !important;
  border: 1px solid #e1e2e4;
  background: linear-gradient(to top right, #e6edff 0%, #ffffff 100%);
}

.task-card-menu-button {
  text-transform: none !important;
  border-radius: 5px;
  border: 1px solid #3459f0;
}

.start {
  border: 1px solid #6e51e7;
  background: linear-gradient(#8172e7, #5c8cca);
}

.cancel {
  border: 1px solid #fc4b8f;
  background: linear-gradient(#ff614e, #fe6aa6);
}

.task-card-wrapper {
  padding-bottom: 5px;
  position: relative;
}

.task-status-wrapper {
  top: -5px;
  left: 10px;
  position: absolute;
  max-width: fit-content;
}

.task-card-image {
  max-width: fit-content;
  align-content: center;
  justify-content: center;
}

.task_name {
  display: inline-block;
  max-width: fit-content;
  color: #374051;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task_date {
  max-width: fit-content;
  color: #b9b9b9;
  font-size: smaller;
  font-weight: lighter;
}

.task_image_count {
  max-width: fit-content;
}

.task_algorithm {
  max-width: fit-content;
}

@media screen and (min-width: 320px) and (max-width: 970px) {
  .task-card-image {
    min-width: 100%;
    align-content: center;
    justify-content: center;
  }

  .task_name {
    min-width: 100%;
    padding-top: 10px;
  }

  .task_date {
    max-width: 100%;
  }

  .task_image_count {
    max-width: 100%;
  }

  .task_algorithm {
    max-width: 100%;
  }
}
</style>
