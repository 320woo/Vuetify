<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="1280px">
      <v-card>
        <v-card-title>
          <span class="headline">비행경로 & 촬영지점</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column wrap justify-center>
              <v-layout row wrap justify-center>
                <address-search></address-search>
                <v-spacer></v-spacer>
                <template v-if="isProvider">
                  <v-switch v-model="areaDraw" label="수동 비행경로 설정"></v-switch>
<!--                  <v-btn :disabled="estimatedShootInfo.wayPoints.length == 0" @click="applyAutoWayPoint()">선택된 영역에 자동 비행 계획 추가</v-btn>-->
                </template>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
                  <template v-if="isProvider">
                    <v-btn color="blue darken-1" flat @click="onClickSaveButton()">저장</v-btn>
                  </template>
                </v-card-actions>
              </v-layout>
              <!-- <v-layout>
                <v-switch v-model="waypoint_plan" label="Waypoint plan"></v-switch>
                <v-switch v-model="waypoint_result" label="Waypoint result"></v-switch>
              </v-layout> -->
              <!-- <base-map class="pa-1" style="width: 100%"></base-map> -->
              <!-- <div class="map"> -->
              <v-layout row wrap justify-center>
                <v-flex xs8>
                  <v-app>
                  <!-- <div v-if="!progressBar"> -->
                    <!-- <v-content class="content"> -->
                        <div class="mapParent">
                          <BaseMap
                            v-if="mergeProjectInfo"
                            id="baseMap"
                            :selected-task-id="selectedTaskId"
                            :map-mode="mapMode"
                            @detail-view="showImageLayout"
                            ref="baseMap"
                          ></BaseMap>
                        </div>
                        <MapViewTools class="mapViewTools"
                                      :is-enable-image-position="isEnableImagePosition"
                                      :is-enable-graph="isEnableGraph"
                                      :is-enable-base-map="true"
                                      :is-enable-hybrid-map="true"
                                      :is-enable2-d-map="true"
                                      :is-enable-time-layer="false"></MapViewTools>

                        <v-layout v-if="enableImageLayout">
                          <v-flex xs12 sm5 offset-sm1 class="mt-2">
                            <v-card class="elevation-10">
                              <v-img
                                height="300px"
                                :src="imageUrl"
                              >
                              </v-img>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- <v-btn flat @click="enableDetailView = true">상세보기</v-btn> -->
                                <v-btn flat @click="enableImageLayout = false">닫기</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-flex>
                        </v-layout>

                    <!-- </v-content>   -->
                  <!-- </div> -->
                  </v-app>
              	<!-- </div> -->
                </v-flex>
                <v-flex xs4>
                  <v-label>비행 설정:</v-label>
                  <v-flex>
                    <v-layout row wrap>
                      <v-text-field
                        v-model="flightOptions.frontOverlap"
                        label="Front overlap (%)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                      <v-text-field
                        v-model="flightOptions.sideOverlap"
                        label="Side overlap (%)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                      <v-text-field
                        v-model="flightOptions.flightSpeed"
                        label="Flight Speed (m/s)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                      <v-text-field
                        v-model="flightOptions.flightAltitude"
                        label="Altitude (m)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                    </v-layout>
                    <v-layout row wrap>
                      <v-text-field
                        v-model="flightOptions.cameraFOV"
                        label="Camera FOV"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                      <v-text-field
                        v-model="flightOptions.shootResolutionWidth"
                        label="Camera Resolution (Width)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                      <v-text-field
                        v-model="flightOptions.shootResolutionHeight"
                        label="Camera Resolution (Height)"
                        @input="calcAutoWayPoint(true)"
                      ></v-text-field>
                    </v-layout>
                    <v-layout row wrap v-if="isProvider && estimatedShootInfo.wayPoints.length > 0">
                      <v-switch
                        v-model="flightOptions.useAutoFlightAngle"
                        label="자동 계산"
                        @change="calcAutoWayPoint(true)"
                      ></v-switch>
                      <v-slider v-model="flightOptions.flightAngle"
                                :disabled="flightOptions.useAutoFlightAngle == true"
                                label="비행방향(각도)"
                                min="0"
                                max="359"
                                @input="calcAutoWayPoint(true)"
                      >
                        <!-- <template v-slot:append>
                          <v-text-field
                            v-model="flightOptions.flightAngle"
                            readonly
                          ></v-text-field>
                        </template> -->
                      </v-slider>
                    </v-layout>
                  </v-flex>
                  <template v-if="isProvider && estimatedShootInfo.wayPoints.length > 0">
                  <v-flex py3>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-label>예상 비행 정보:</v-label>
                  <v-flex>
                    <v-layout row wrap>
                      <v-text-field
                        v-model="estimatedShootInfo.wayPointCount"
                        label="WayPoint 개수"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.area"
                        label="면적 (㎡)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.shootPathLength"
                        label="비행 경로 길이 (Meter)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.shootCount"
                        label="예상 촬영 장수"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.maxFlightSpeed"
                        label="최대 비행 속도 (m/s)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.shootArea"
                        label="장당 촬영 영역 (width * height)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.distancePerPixel"
                        label="픽셀 정밀도 (센티미터)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.meterPerShoot"
                        label="셧 거리 (Meter)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.shootInterval"
                        label="셧 주기 (초)"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-model="estimatedShootInfo.flightDuration"
                        label="예상 비행시간(분)-각 Point 5초 지연"
                        readonly
                      ></v-text-field>
                    </v-layout>
<!--                <v-layout>-->
<!--                  <v-btn :disabled="estimatedShootInfo.wayPoints.length == 0" @click="applyAutoWayPoint()">선택된 영역에 자동 비행 계획 추가</v-btn>-->
<!--                </v-layout>-->
                  </v-flex>
                  </template>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
          <template v-if="isProvider">
            <v-btn color="blue darken-1" flat @click="onClickSaveButton()">저장</v-btn>
          </template>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
      <!-- <DetailImageView
        v-if="enableDetailView"
        :detailViewType="Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_PROVIDER_MAP"
        :image-list="imageList"
        @close="enableDetailView = false"
      ></DetailImageView> -->
  </v-layout>
</template>

<script>
  import BaseMap from "@/components/map/BaseMap"
  import MapViewTools from "@/components/map/MapViewTools"
  import AddressSearch from "@/components/map/AddressSearch"
  import * as types from "@/vuex/mutation-types"
  import Constants from "@/components/common/constants"
  import dbAPI from "@/utils/api/dbAPI"
  import {mapActions, mapGetters, mapMutations} from "vuex"
  import AreaUtil from '@/utils/utils/areaUtil'
  // import MarkerContents from "@/components/map/MarkerContents"
  import ImageUtil from '@/utils/api/fileAPI'
  import { DronePath } from "@/utils/utils/waypointGenerator"
  import { PolygonUtil } from "@/utils/utils/polygonUtil"

  const EnumAlgorithm = {
    ODM: {value: 0, name: "ODM"},
    NDVI: {value: 1, name: "NDVI"},
    SCAN: {value: 2, name: "SCAN"},
    GEOTIFF: {value: 3, name: "GeoTiff"},
    AI: {value: 4, name: "AI"},

  }

  const EnumSortMode = {
    CREATE_TIME: {value: 0, name: "CREATE_TIME", display: "생성날짜"},
    NAME: {value: 1, name: "NAME", display: "이름"},
    SHOOTING_TIME: {value: 2, name: "SHOOTING_TIME", display: "촬영날짜"},
    UPDATE_TIME: {value: 3, name: "UPDATE_TIME", display: "수정날짜"},
  }

  export default {
    name: "WaypointPlanDialog",
    components: {
      BaseMap,
      MapViewTools,
      AddressSearch
    },
    props: {
      areaBoundary: {
        type: Array,
        default: () => []
      },
      // mission_id: {
      //   type: Number,
      //   required: true
      // },
      mission: {
        type: Object
      }
    },
    data: () => ({
      currentWaypointPlan: null,

      dialog: false,
      areaDraw: false,
      isCreatedWaypoint: false,

      // 비행 설정
      flightOptions: {
        frontOverlap: 80,
        sideOverlap: 80,
        flightSpeed: 12,
        flightAltitude: 150,
        flightAngle: 0,
        useAutoFlightAngle: true,
        cameraFOV: 83,
        shootResolutionWidth: 5472, // 4864,
        shootResolutionHeight: 3078, // 3648
      },
      estimatedShootInfo: {
        wayPoints: [],
        area: 0, // 면적
        wayPointCount: 0, // WayPoint 개수
        shootPathLength: 0, // 비행 거리 (WayPoint 경로만)
        meterPerShoot: 0, // 셧 거리
        shootInterval: 0, // 셧 주기
        maxFlightSpeed: 0, // 최대 비행 속도
        shootArea: '0m * 0m', // 장당 촬영 영역 (meter * meter)
        distancePerPixel: 0, // 픽셀 정밀도 (센티미터)
        shootCount: 0, // 예상 촬영 장수
        flightDuration: 0, // 예상 비행 시간
      },

      drawer: true,
      selectedProjectId: null,
      selectedTaskId: null,
      // detailTask: false,
      isEnableImagePosition: true,
      // isEnableGraph: false,
      // isEnableBaseMap: true,
      // isEnable2DMap: true,
      // isEnableTimeLayer: false,
      // opacity: 100,
      // progressBar: false,
      enableDetailView: false,
      enableImageLayout: false,
      // sortExpand: false,
      imageList: [],
      // imageUrl: "",

      // Project List
      projectInfo: null,

      // Enum value
      mapMode: null,
      // algorithmMode: [],

      EnumMapMode: Constants.MODE_MAP_TOOL_NONE,//Constants.ENUM_MAP_MODE,
      // EnumAlgorithm,
      // EnumSortMode,

      // icons: icons,
      // timelineData: null,
      // sorts: [
      //   EnumSortMode.SHOOTING_TIME,
      //   EnumSortMode.CREATE_TIME,
      //   // EnumSortMode.NAME,
      //   // EnumSortMode.UPDATE_TIME,
      // ],

      // sortMode: EnumSortMode.SHOOTING_TIME,
      Constants

    }),
    created() {
      let projectId = this.mission.project_id
      let taskId = this.mission.task_id

      if (this.projectInfo == null) {
        this.projectInfo = {
          projectId: this.mission.project_id,
          tasks: []
        }

        this.projectInfo.tasks.push({
          task_id: taskId
        })
      }

      // console.log('[created] projectId: '+this.projectInfo.projectId)
      // console.log('taskId: '+this.projectInfo.tasks[0].task_id)


      if (taskId !== undefined) {
        this.setSelectTask(taskId, true)
        // this.mapMode = this.EnumMapMode.TASK_MAP
        this.isEnableGraph = false
      }

      // this.algorithmMode.push(EnumAlgorithm.ODM)
      // this.algorithmMode.push(EnumAlgorithm.GEOTIFF)

      this.clearEstimatedShootInfo()

      this.dialog = true
      this.requestGetArea()
      this.requestWaypointPlanByMissionId()
      this.requestProjectList()

      this.$store.commit(types.SET_PROJECTS, {})
      this.$store.commit(types.MAP_TOOL_MODE, {mode: 0})
      this.$store.commit(types.MAP_OPACITY, {opacity: this.opacity})
      this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: null})
      this.$store.commit(types.MAP_TIMELINE, {isEnableTimeline: false})
      this.$store.commit(types.MAP_IMAGE_POSITION, {isEnableImagePosition: false})
      this.$store.commit(types.CLEAR_MARKER_LIST)
      this.$store.commit(types.SHOW_CONTENT, {showContents: true})
    },

    destroyed() {
      console.log('[destroyed] ')
      this.clearImageInfoList()
    },

    mounted() {
      console.log('mission: ', this.mission)
    },
    computed: {
      // ...mapGetters(['getToolMode', 'getAreaList', 'getAreaSize'])
      ...mapGetters(["getToolMode", "getWaypointList", "getSelectedFeature", "getAreaList", "getSprayResultList"]),

      getProjectInfo() {
        console.log("[getProjectInfo]")
        return this.$store.getters.getProject
      },

      getTaskList() {
        if (this.getProjectInfo === undefined) return
        this.progressBar = false
        const tasks = this.getProjectInfo.tasks
        console.log("[getTaskList] task : ", tasks)
        if (tasks && this.mapMode !== this.EnumMapMode.TASK_MAP) {
          this.isEnableGraph = tasks.length > 1
        }

        // this.updateTimelineData(tasks)
        return tasks
      },

      mergeProjectInfo() {
        console.log('## projectInfo >', this.projectInfo)
        return this.projectInfo
      },

      getImageInfoList() {
        return imageInfoList
      },

      isProvider() {
        if (this.$session.get('user_type') == "provider") {
          return true
        }
        return false
      },

    },

    methods: {
      // ...mapMutations(['setAreaList', 'clearAreaList']),
      ...mapMutations([
        "setWaypointList",
        "clearWaypointList",
        "setSprayList",
        "clearSprayList",
        'setAreaList',
        'clearAreaList',
        'clearImageInfoList'
      ]),

      ...mapActions([
        'requestGetProjectAll',
        'requestGetFileSearchList'
      ]),

      async requestProjectList() {
        this.progressBar = true

        console.log('[requestProjectList] called requestGetProjectAll() - projectId:'+this.mission.project_id)

        this.requestGetProjectAll(this.mission.project_id)
        // this.requestGetProjectImageFileList(this.mission.project_id)
      },

      async requestGetArea() {
        console.log("[requestGetArea] areaId : ", this.mission.area_id)
        try {
          let result = await dbAPI.query("select.area.user.area_id", {
            area_id: this.mission.area_id,
            user_id: this.mission.user_id,
          })
          console.log("[requestGetArea] result : ", result)

          if (result.rowCount > 0) {
            let areaList = AreaUtil.getConvertDBToMapJson(result.rows[0].area_boundary.area)
            this.setAreaList(areaList)
          }
        } catch (err) {
          console.log(err)
        }
      },

      async requestWaypointPlanByMissionId() {
        const param = {
          mission_id: this.mission.mission_id
        }
        console.log('[requestWaypointPlanByMissionId] mission_id: '+this.mission.mission_id)
        const result = await dbAPI.query("sp.select_waypoint_plan", param)
        if (result.rowCount !== 0) {
          this.estimatedShootInfo.wayPoints = []
          this.currentWaypointPlan = result.rows
          this.setWaypointList(result.rows)
          this.flightOptions.frontOverlap = this.currentWaypointPlan[0].waypoint_plan_info.frontOverlap * 100;
          this.flightOptions.sideOverlap = this.currentWaypointPlan[0].waypoint_plan_info.sideOverlap * 100;
          this.flightOptions.flightSpeed = this.currentWaypointPlan[0].waypoint_plan_info.autoFlightSpeed;
          this.flightOptions.flightAltitude = this.currentWaypointPlan[0].waypoint_plan_info.flightAltitude;
          // TODO : 서버에서 읽어 오도록... this.flightOptions.cameraFOV = xx;
          // TODO : 서버에서 읽어 오도록... this.flightOptions.shootResolutionWidth = xx;
          // TODO : 서버에서 읽어 오도록... this.flightOptions.shootResolutionHeight = xx;
        }
      },
      convertWaypointList(waypointList) {
        const convertList = { area: [] }
        convertList.area = waypointList.map(value => {
          const obj = {
            lat: value.latitude,
            lng: value.longitude
          }
          return obj
        })
        return convertList
      },
      async onClickSaveButton() {
        console.log(this.currentWaypointPlan)

        let ok = this.currentWaypointPlan == null ? await this.saveData() : await this.updateData()

        if (ok) {
          await this.updateMissionState(this.mission.mission_id, 2)
          alert('저장되었습니다.')
        }
        else {
          alert('실패되었습니다.')
        }
      },
      async saveData() {
        console.log("[saveData] getWaypointList : ", this.getWaypointList)

        /*
        waypoint_plan 테이블
        waypoint_plan_info (json)
        shootphoto_plan_info (json)
        mission_id (int)
         */
        const wayPointList = this.getWaypointList[0].area.map(value => {
          const obj = {
            latitude: value.lat,
            longitude: value.lng,
            altitude: this.flightOptions.flightAltitude,
            holdtime: 0,
            headingMode: 0
          }

          return obj
        })

        console.log("[saveData] wayPointList : ", wayPointList)

        const param = {
          waypoint_plan_info: {
            finishedAction: 0,
            headingMode: 0,
            flightPathMode: 0,
            autoFlightSpeed: this.flightOptions.flightSpeed,
            maxFlightSpeed: this.estimatedShootInfo.wayPoints.length > 0 ? this.estimatedShootInfo.maxFlightSpeed : 10,
            flightAltitude: this.flightOptions.flightAltitude,
            flightAngle: this.flightOptions.flightAngle,
            useAutoFlightAngle: this.flightOptions.useAutoFlightAngle,
            sideOverlap: Math.min(0.99, this.flightOptions.sideOverlap / 100.0),
            frontOverlap: Math.min(0.99, this.flightOptions.frontOverlap / 100.0),
            waypointList: wayPointList,
            waypointCount: wayPointList.length
          },
          mission_id: this.mission.mission_id,
          shootphoto_plan_info: {
            shootPhotoTimeInterval: this.estimatedShootInfo.shootInterval || 2,
            shootPhotoDistanceInterval: this.estimatedShootInfo.meterPerShoot || 0,
            shootmode: 0
          }
        }
        console.log("[saveData] sp.add_waypoint_plan param : ", param)

        const result = await dbAPI.query("sp.add_waypoint_plan", param)

        console.log("[saveData] sp.add_waypoint_plan response => ", result)

        if (result.rowCount == 1) {
          this.currentWaypointPlan = param
          return true
        }
        else {
          return false
        }
      },

      async updateData() {
        console.log("[updateData] getWaypointList : ", this.getWaypointList)

        let paramWaypointList = []

        if (this.getWaypointList.length > 0) {
          if (Object.keys(this.getWaypointList[0]).includes("waypoint_plan_info")) {
            const waypointList = this.getWaypointList[0].waypoint_plan_info.waypointList
            const convertWaypointList = this.convertWaypointList(waypointList)

            paramWaypointList = convertWaypointList.area.map(value => {
              const obj = {
                latitude: value.lat,
                longitude: value.lng,
                altitude: this.flightOptions.flightAltitude,
                holdtime: 0,
                headingMode: 0
              }

              return obj
            })
          } else {
            paramWaypointList = this.getWaypointList[0].area.map(value => {
              const obj = {
                latitude: value.lat,
                longitude: value.lng,
                altitude: this.flightOptions.flightAltitude,
                holdtime: 0,
                headingMode: 0
              }

              return obj
            })
          }
        }

        console.log("[updateData] paramWaypointList : ", paramWaypointList)

        const param = {
          waypoint_plan_info: {
            finishedAction: 0,
            headingMode: 0,
            flightPathMode: 0,
            autoFlightSpeed: this.flightOptions.flightSpeed,
            maxFlightSpeed: this.estimatedShootInfo.wayPoints.length > 0 ? this.estimatedShootInfo.maxFlightSpeed : 10,
            flightAltitude: this.flightOptions.flightAltitude,
            flightAngle: this.flightOptions.flightAngle,
            useAutoFlightAngle: this.flightOptions.useAutoFlightAngle,
            sideOverlap: Math.min(0.99, this.flightOptions.sideOverlap / 100.0),
            frontOverlap: Math.min(0.99, this.flightOptions.frontOverlap / 100.0),
            waypointList: paramWaypointList,
            waypointCount: paramWaypointList.length
          },
          mission_id: this.mission.mission_id,
          shootphoto_plan_info: {
            shootPhotoTimeInterval: this.estimatedShootInfo.shootInterval || 2,
            shootPhotoDistanceInterval: this.estimatedShootInfo.meterPerShoot || 0,
            shootmode: 0
          }
        }

        console.log("[updateData] sp.update_waypoint_plan param : ", param)

        const result = await dbAPI.query("sp.update_waypoint_plan", param)

        console.log("[updateData] sp.update_waypoint_plan response => ", result)
        return result.rowCount == 1
      },

      async updateMissionState(_mission_id, _state) {
        //임무상태 (0:요청/1:준비중/2:진행중/3:완료/4:취소

        if (_mission_id != null && _state > 0 && _state <= 4) {
          try {
            let info = {
              mission_id: _mission_id,
              state: _state
            }
            let result = await dbAPI.query('update.mission.state', info)
            if (result.rowCount >= 1) {
              console.log('[update.mission.state]',result.rows)
            }
          } catch (err) {
            console.log('[update.mission.state]',err)
          }
        }
        else {
          console.log('[ERR] state: '+_state)
        }
      },

      closePopup() {
        this.dialog = false
        this.clearWaypointList()
        this.currentWaypointPlan = null
        this.$emit("close")
      },

      clickToggle() {
        let mode = 0 //Constants.MODE_MAP_TOOL_NONE

        if (this.areaDraw) {
          mode = 5 //Constants.MODE_MAP_TOOL_WAYPOINT_PLAN
          this.clearWaypointList()
          console.log('[clickToggle] called clearWaypointList()')
        }
        else {
          if (this.isCreatedWaypoint == false) {
            this.requestWaypointPlanByMissionId()
          }
        }
        console.log('[clickToggle] mode: '+mode)
        this.isCreatedWaypoint = false

        this.$store.commit(types.MAP_TOOL_MODE, { mode: mode })
      },


      async goToDetailView(fileId) {
        console.log('[goToDetailView] ')
        await this.getImageList(fileId)
        this.enableDetailView = true
      },

      setSelectTask(taskId, detail) {
        console.log("[setSelectTask] taskId : " + taskId + ", detail : " + detail)
        this.selectedTaskId = taskId
        this.detailTask = detail

        // this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: null})
        // this.$store.dispatch(types.GET_MARKER_LIST, {
        //   project_id: this.mission.project_id,
        //   task_id: taskId
        // })
      },
      // _setSelectTaskColor(item) {
      //   return this.selectedTaskId === item.task_id ? 'mapTaskCardSelected' : 'mapTaskCard'
      // },
      // setOpacity(value) {
      //   this.$store.commit(types.MAP_OPACITY, {opacity: value})
      // },

      // getImageUrl(url) {
      //   return Constants.TASK_MANAGER_SERVER_URL + url
      // },

      async getImageList(fileId) {
        this.imageList = this.$store.getters.getImageInfoList
        if (fileId) {
          this.imageList = this.imageList.filter((item) => {
            return item.id === fileId
          })
        }
      },

      async showImageLayout(_, fileId) {
        console.log("[showImageLayout] ")
        await this.getImageList(fileId)

        const fileManager = ImageUtil.FileManagerUrl({}, {
          [ImageUtil.FILE_ID]: fileId
        })
        this.imageUrl = fileManager.storageImageUrl
        this.enableImageLayout = true
      },

      clearEstimatedShootInfo() {
        this.estimatedShootInfo.wayPoints = []
        this.estimatedShootInfo.wayPointCount = 0
        this.estimatedShootInfo.area = 0
        this.estimatedShootInfo.shootPathLength = 0
        this.estimatedShootInfo.meterPerShoot = 0
        this.estimatedShootInfo.shootInterval = 0
        this.estimatedShootInfo.maxFlightSpeed = 0
        this.estimatedShootInfo.shootArea = `0m * 0m`
        this.estimatedShootInfo.distancePerPixel = 0
        this.estimatedShootInfo.shootCount = 0
        this.estimatedShootInfo.flightDuration = 0
      },
      calcAutoWayPoint(apply) {
        if (this.getSelectedFeature == null) {
          this.clearEstimatedShootInfo()
        } else {
          if (this.getAreaList) {
            console.log('area list:', this.getAreaList)
            const selectedArea = this.getAreaList.find(v => v.id == this.getSelectedFeature.id_)
            console.log('selected area: ', selectedArea)
            if (selectedArea) {
              let dronePath = new DronePath()
              dronePath.vertices = selectedArea.area.map(v => new PolygonUtil.CGPoint(v.lng, v.lat))
              const firstVert = dronePath.vertices[0]
              const lastVert = dronePath.vertices[dronePath.vertices.length - 1]
              if (firstVert.equalTo(lastVert)) {
                dronePath.vertices.splice(dronePath.vertices.length - 1, 1)
              }
              dronePath.FOV = Math.max(0.1, this.flightOptions.cameraFOV)
              dronePath.cameraResolution = new PolygonUtil.CGSize(Math.max(100, this.flightOptions.shootResolutionWidth), Math.max(100, this.flightOptions.shootResolutionHeight))
              dronePath.flightAltitude = Math.max(0.5, this.flightOptions.flightAltitude)
              dronePath.flightSpeed = Math.max(0.5, this.flightOptions.flightSpeed)
              dronePath.frontOverlap = Math.min(0.99, this.flightOptions.frontOverlap / 100.0)
              dronePath.sideOverlap = Math.min(0.99, this.flightOptions.sideOverlap / 100.0)
              dronePath.coordSystem = new PolygonUtil.GPSCoordnateSystem()
              dronePath.flightAngle = parseInt(this.flightOptions.useAutoFlightAngle ? dronePath.recommendedFlightAngle(true) : this.flightOptions.flightAngle)
              dronePath.autoFlightAngle = this.flightOptions.useAutoFlightAngle

              const wpis = dronePath.make()
              // console.log('area vertices: ', dronePath.vertices)
              // console.log('calculated WayPoints: ', wpis)
              // for (let wpi of wpis) {
              //   console.log(`wpi ${wpi.point.x}, ${wpi.point.y}`)
              // }
              // console.log('flight angle: ', dronePath.flightAngle, 'auto: ', dronePath.autoFlightAngle)
              if (dronePath.autoFlightAngle) {
                this.flightOptions.flightAngle = parseInt(dronePath.flightAngle < 0 ? dronePath.flightAngle + 360 : dronePath.flightAngle)
              }

              const lsi = dronePath.lastShootInfo
              this.estimatedShootInfo.wayPoints = wpis
              this.estimatedShootInfo.wayPointCount = wpis.length
              this.estimatedShootInfo.area = dronePath.area().toFixed(3)
              this.estimatedShootInfo.shootPathLength = dronePath.flightDistance(wpis, null).toFixed(3)
              this.estimatedShootInfo.meterPerShoot = lsi.nextShootDistance.front.toFixed(3)
              this.estimatedShootInfo.shootInterval = lsi.shootInterval.toFixed(3)
              this.estimatedShootInfo.maxFlightSpeed = lsi.availableMaxFlightSpeed.toFixed(3)
              this.estimatedShootInfo.shootArea = `${lsi.shootSize.side.toFixed(3)}m * ${lsi.shootSize.front.toFixed(3)}m`
              this.estimatedShootInfo.distancePerPixel = (lsi.distancePerPixel * 100).toFixed(3)
              this.estimatedShootInfo.shootCount = dronePath.countShoot(wpis, true, lsi)
              this.estimatedShootInfo.flightDuration = `${((this.estimatedShootInfo.shootInterval * this.estimatedShootInfo.shootCount + wpis.length * 5) / 60).toFixed(1)} (가속도 미반영)` // 각 Waypoint 에서 5초 지연 가정.
            }
          }
        }
        if (apply) {
          this.applyAutoWayPoint()
        }
      },

      applyAutoWayPoint() {
        if (this.estimatedShootInfo.wayPoints.length == 0) {
          this.clearWaypointList()
          return
        }
        const featureId = this.$refs.baseMap.createFeatureId()
        const area = this.estimatedShootInfo.wayPoints.map(si => {
          return {
            lng: si.point.x,
            lat: si.point.y
          }
        })
        const size = parseFloat(this.estimatedShootInfo.area)

        const waypoint = {
          id: featureId,
          area,
          size
        }
        console.log('apply auto way point', waypoint)
        this.setWaypointList([waypoint])
        // this.clearWaypointList()
        // this.$refs.baseMap.addWaypointList(waypoint)
      }

    },

    watch: {
      getSelectTaskId(val, oldVal) {
        if (val !== this.selectedTaskId) {
          this.setSelectTask(val, this.detailTask)
        }
      },

      getTaskList(val, oldVal) {
        // console.log('[getTaskList] > @val: ', val)
        // console.log('[getTaskList] > @oldVal:', oldVal)
        if (oldVal === undefined && val !== undefined) {
          let taskInfo = val.filter((data) => {
            if (data.task_id === this.selectedTaskId) {
              return data
            }
            // return data.task_id === this.selectedTaskId
          })

          if (taskInfo.length > 0) {
            console.log('[getTaskList] call requestGetFileSearchList(..), taskInfo: ', taskInfo[0])
            if (taskInfo[0].taskfiles.storagefiles != undefined && taskInfo[0].taskfiles.storagefiles.length > 0) {
              this.requestGetFileSearchList(taskInfo[0].taskfiles.storagefiles)
            }
          }
        }
      },

      areaDraw() {
        console.log('[areaDraw] ')
        this.clickToggle()
      },
      getToolMode(value) {
        console.log("[getToolMode] value : " + value)
        if (value === Constants.MODE_MAP_TOOL_NONE) {
          this.isCreatedWaypoint = true
          this.areaDraw = false
        }
      },
      getSelectedFeature() {
        console.log('selected feature: ', this.getSelectedFeature)
        this.calcAutoWayPoint(true)
      }
    }
  }
</script>

<style scoped>

  .content {
    position: absolute;
    width: 100%;
    height: 50%;
  }

  .mapParent {
    position: absolute;
    background: darkgrey;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    min-height:none;
  }

  #baseMap {
    z-index: 0;
    width: 100%;
    height: 100%
  }

  .mapViewTools {
    float: right;
    margin-right: 2%;
    margin-top: 1%;
    z-index: 1
  }

</style>
