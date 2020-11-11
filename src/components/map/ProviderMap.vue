<template>
  <div class="map">
    <v-app>
      <div v-if="!progressBar">
        <v-navigation-drawer
          class="navigationDrawer white--text"
          :clipped="true"
          :mobile-break-point="800"
          v-model="drawer"
          dark
          app
          touchless>
          <template v-if="!detailTask">
            <v-card
              class="card-header"
              color="primary">
              <v-container v-if="sortExpand"
                           fluid>
                <v-layout column
                          align-center
                >
                  <!--<v-layout jusify-center-->
                  <!--wrap>-->
                  <!--<v-flex>-->
                  <!--<v-text-field label="프로젝트 이름을 입력해주세요."-->
                  <!--single-line-->
                  <!--hide-details-->
                  <!--solo-->
                  <!--class="map-task-card"-->
                  <!--append-icon="search">-->
                  <!--</v-text-field>-->
                  <!--</v-flex>-->
                  <!--</v-layout>-->
                  <v-layout jusify-end
                            column
                            wrap>
                    <v-flex>
                      <!--<v-btn class="default-action-button"-->
                      <!--ripple-->
                      <!--@click.prevent="requestProjectList">-->
                      <!--<img :src="icons.queued">-->
                      <!--</v-btn>-->
                      <v-menu
                        transition="slide-y-transition"
                        bottom
                      >
                        <v-btn slot="activator"
                               color="#9D41EC">
                          임무정렬 ({{sortMode.display}})
                        </v-btn>
                        <v-list>
                          <v-list-tile
                            v-for="(item, i) in sorts"
                            :key="i"
                            @click="sortProject(item)"
                          >
                            <v-list-tile-title>{{ item.display }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                      <v-menu
                        transition="slide-y-transition"
                        bottom
                      >
                        <v-btn slot="activator"
                               color="#9D41EC">
                          임무종류 ({{getFilterAlgorithmMode.display}})
                        </v-btn>
                        <v-list>
                          <v-list-tile
                            v-for="(item, i) in getAlgorithmFilters"
                            :key="i"
                            @click="setSelectAlgorithm(item)"
                          >
                            <v-list-tile-title>{{ item.display }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-container>
              <v-layout
                align-center
                justify-center
              >
                <v-btn
                  style="margin-top: 5px; z-index: 99999"
                  fixed
                  round
                  outline
                  icon
                  small
                  @click="sortExpand = !sortExpand"
                >
                  <v-icon v-if="sortExpand">
                    expand_less
                  </v-icon>
                  <v-icon v-else>
                    expand_more
                  </v-icon>
                </v-btn>
              </v-layout>
            </v-card>
            <v-hover v-for="(item, index) in getTaskList" :key="index">
              <v-card class="map-task-card"
                      :color="_setSelectTaskColor(item)"
                      slot-scope="{ hover }"
                      :class="`elevation-${hover ? 12 : 2}`"
                      :key="item.task_id"
                      @click.native.stop.prevent="selectTask(item.task_id, false)">
                <v-container class="pa-3"
                             fluid>
                  <v-layout row justify-space-between align-center>
                    <v-layout column wrap>
                      <v-flex class="white--text name">{{ item.name }}</v-flex>
                      <v-flex>
                        <v-chip class="ml-0"
                                :color="_calAlgorithmBadgeColor(item.algorithm)"
                                small
                                label
                                text-color="white">
                          {{ item.algorithm }}
                        </v-chip>
                      </v-flex>
                      <v-flex v-if="sortMode===EnumSortMode.SHOOTING_TIME" class="date">
                        {{ _convertDate(getTaskInfo(item.task_id).base_date) }}
                      </v-flex>
                      <v-flex v-if="sortMode===EnumSortMode.CREATE_TIME" class="date">
                        {{ _convertDate(getTaskInfo(item.task_id).created_at) }}
                      </v-flex>
                      <v-flex class="address">{{ getTaskAddress(item.task_id).text }}</v-flex>
                    </v-layout>
                    <v-layout row wrap align-center justify-end>
                      <v-btn
                        class="ma-0"
                        icon
                        ripple
                        @click.stop.prevent="setSelectTask(item.task_id, true)">
                        <v-icon color="grey lighten-1">info</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-layout>
                </v-container>
              </v-card>
            </v-hover>
          </template>
          <v-container v-else fluid px-3>
            <v-layout column wrap>
              <v-layout column wrap align-start justify-center>
                <v-flex wrap class="map-task-title">
                  <template v-if="getTaskInfo(selectedTaskId)">
                    {{ getTaskInfo(selectedTaskId).name }}
                  </template>
                </v-flex>
                <v-flex wrap class="address">
                  <template v-if="getTaskInfo(selectedTaskId)">
                    {{ getTaskAddress(selectedTaskId).text }}
                  </template>
                </v-flex>
                <v-flex wrap class="date">
                  <template v-if="getTaskInfo(selectedTaskId)">
                    생성 : {{ _convertDate(getTaskInfo(selectedTaskId).created_at) }}
                  </template>
                </v-flex>
                <v-flex wrap class="date">
                  <template v-if="getTaskInfo(selectedTaskId)">
                    촬영 : {{ _convertDate(getTaskInfo(selectedTaskId).base_date) }}
                  </template>
                </v-flex>
              </v-layout>
              <v-divider class="ma-1"></v-divider>
              <v-layout align-center justify-center pt-1 pb-1>
                <v-btn
                  @click="goToDetailView()"
                  color="taskButton"
                  class="square-border-button">
                  <img :src="originalImageViewIcon" class="button-content-icon">
                  원본 이미지 보기
                </v-btn>
              </v-layout>
              <v-divider class="ma-1"></v-divider>
              <v-layout column>
                <MapAnnotationTools class="mapAnnotationTools"></MapAnnotationTools>
                <MarkerContents v-if="isShowMarkerContent"
                                :project-id="projectId"
                                :task-id="selectedTaskId">
                </MarkerContents>
              </v-layout>
              <v-layout wrap align-center justify-center pt-2 pb-2>
                <v-btn v-if="mapMode !== EnumMapMode.TASK_MAP"
                       color="#9D41EC"
                       @click="goToTaskListPage"
                       class="square-border-button">
                  <img class="button-content-icon" :src="icons.list">
                  리스트 페이지
                </v-btn>
              </v-layout>

              <template v-if="isNDVI">
                <v-layout wrap align-center justify-center pt-2 pb-2>
                  <v-container>
                    <bar-chart
                      :data="histogramData"
                      :options="histogramOptions"
                      :width="200"
                      :height="200">
                    </bar-chart>
                  </v-container>
                </v-layout>
              </template>


            </v-layout>
          </v-container>
        </v-navigation-drawer>
        <v-toolbar
          :clipped-left="true"
          color="toolbar"
          dark
          app>
          <v-btn icon class="hidden-xs-only"
                 @click=goToPrevPage>
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="toolbarTitle">
            임무명:
            <template v-if="getTaskInfo(selectedTaskId)">
              {{ getTaskInfo(selectedTaskId).name }}
            </template>
          </v-toolbar-title>

          <v-layout row align-right justify-end class="rightTopOptionLayout">
            <v-flex class="pr-3 pt-2" xs12 sm6 md6>
              <address-search></address-search>
            </v-flex>
            <v-flex class="pr-3 opacitySliderBar" xs12 sm5 md5>
              <v-slider
                v-model="opacity"
                thumb-color="white lighten-1"
                color="#fa961a"
                track-color="#e2e6f1"
                always-dirty
                :max="100"
                :min="0"
                label="투명도"
              ></v-slider>
            </v-flex>

            <v-flex shrink style="width: 50px">
              <v-text-field
                v-model="opacity"
                hide-details
                single-line
                type="number"
                :max="100"
                :min="0"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-toolbar>
        <v-content class="content">
          <div class="mapParent">
            <BaseMap
              v-if="mergeProjectInfo"
              id="baseMap"
              :project-info="mergeProjectInfo"
              :selected-task-id="selectedTaskId"
              :map-mode="mapMode"
              @detail-view="showImageLayout"
            ></BaseMap>
            <Timeline id="timeline" :timeline-data="getTimelineData"></Timeline>
          </div>
          <MapViewTools class="mapViewTools"
                        :is-enable-image-position="isEnableImagePosition"
                        :is-enable-graph="isEnableGraph"
                        :is-enable-base-map="true"
                        :is-enable-hybrid-map="true"
                        :is-enable2-d-map="true"
                        :is-enable-time-layer="false"></MapViewTools>
          <v-btn
            class="drawOpener"
            block
            color="navigationDrawer"
            @click="drawer=!drawer">
            <div v-if="drawer">
              <v-icon color="white lighten-1">chevron_left</v-icon>
            </div>
            <div v-else>
              <v-icon color="white lighten-1">chevron_right</v-icon>
            </div>
          </v-btn>
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
                  <v-btn flat @click="enableDetailView = true">상세보기</v-btn>
                  <v-btn flat @click="enableImageLayout = false">닫기</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-content>
      </div>
      <div v-else>
        <v-progress-circular
          class="progress"
          :size="70"
          :width="7"
          color="purple"
          indeterminate>
        </v-progress-circular>
      </div>
      <DetailImageView
        v-if="enableDetailView"
        :detailViewType="Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_PROVIDER_MAP"
        :image-list="imageList"
        @close="enableDetailView = false"
      ></DetailImageView>
    </v-app>
  </div>
</template>

<script>
  import BaseMap from './BaseMap'
  import MapAnnotationTools from './MapAnnotationTools'
  import MapViewTools from './MapViewTools'
  import TaskInfo from '@/components/shared-components/TaskInfo'
  import * as types from '../../vuex/mutation-types'
  import Constants from '../common/constants'
  import Timeline from './Timeline'
  import StringUtil from '@/utils/utils/stringUtil'
  import DetailImageView from '../common/DetailImageView'
  import MarkerContents from './MarkerContents'
  import icons from '@/icons'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import ImageUtil from '@/utils/api/fileAPI'
  import AddressSearch from '@/components/map/AddressSearch'
  import BarChart from '@/components/common/BarCharts'
  import taskAPI from "@/utils/api/taskAPI"

  const EnumAlgorithm = {
    ODM: { value: 0, name: 'ODM' },
    NDVI: { value: 1, name: 'NDVI' },
    SCAN: { value: 2, name: 'SCAN' },
    GEOTIFF: { value: 3, name: 'GeoTiff' },
    AI: { value: 4, name: 'AI' }
  }

  const EnumSortMode = {
    CREATE_TIME: { value: 0, name: 'CREATE_TIME', display: '생성날짜' },
    NAME: { value: 1, name: 'NAME', display: '이름' },
    SHOOTING_TIME: { value: 2, name: 'SHOOTING_TIME', display: '촬영날짜' },
    UPDATE_TIME: { value: 3, name: 'UPDATE_TIME', display: '수정날짜' }
  }

  export default {
    components: {
      MarkerContents,
      DetailImageView,
      Timeline,
      MapViewTools,
      BaseMap,
      TaskInfo,
      MapAnnotationTools,
      AddressSearch,
      BarChart,
    },

    props: {
      projectId: {
        type: String
      },
      taskId: {
        type: String
      }
    },

    data() {
      return {
        name: 'Map',
        title: 'ProjectName',
        drawer: true,
        selectedProjectId: null,
        selectedTaskId: null,
        detailTask: false,
        isEnableImagePosition: true,
        isEnableGraph: true,
        isEnableBaseMap: true,
        isEnable2DMap: true,
        isEnableTimeLayer: false,
        opacity: 100,
        progressBar: false,
        enableDetailView: false,
        enableImageLayout: false,
        sortExpand: false,
        imageList: [],
        imageUrl: '',
        isNdvi: false,

        filterProjectInfo: {},

        // Project List
        projectInfo: {
          'projectId': '',
          'tasks': []
        },

        // Enum value
        mapMode: null,
        algorithmMode: [],

        EnumMapMode: Constants.ENUM_MAP_MODE,
        EnumAlgorithm,
        EnumSortMode,

        icons: icons,
        timelineData: null,
        sorts: [
          EnumSortMode.SHOOTING_TIME,
          EnumSortMode.CREATE_TIME
          // EnumSortMode.NAME,
          // EnumSortMode.UPDATE_TIME,
        ],
        sortMode: EnumSortMode.SHOOTING_TIME,
        Constants,

        //histogram data
        //begin
        // Chart data
        histogramData: {
          labels: [],
          datasets: [
            {
              label: 'NDVI 지수 분포',
              borderColor: ['#770000','#880000','#990000','#AA0000','#BB0000','#CC0000','#DD0000','#EE0000','#FF0000','#FF0000','#FF0000','#FFCC00','#FFFF00','#00FF00','#008800','#006600','#006600'], //'#f75c4c',//'#FFFFFF',//
              backgroundColor: ['#770000','#880000','#990000','#AA0000','#BB0000','#CC0000','#DD0000','#EE0000','#FF0000','#FF0000','#FF0000','#FFCC00','#FFFF00','#00FF00','#008800','#006600','#006600'], //'#f75c4c',
              pointBorderColor: '#FF0000',//'#249EBF',
              borderWidth: 1,
              data: [],
              type: 'bar'
            }
          ]
        },
        histogramOptions: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'NDVI'
              },
              ticks: {
                beginAtZero: true,
                maxRotation: 13,
                minRotation: 13,
                autoSkip: true,
                maxTicksLimit: 17,
                fontSize: 9
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
                steps: 1,
                stepValue: 1,
                max: 256,
                display: false,
              }
            }]
          },
          title: {
            display: true,
            text: 'NDVI Histogram'
          }
        }
        //histogram data
        //end
      }
    },

    async created() {
      console.info('[created] params projectId : ' + this.$route.params.projectId)
      console.info('[created] params taskId : ' + this.$route.params.taskId)

      let projectId = this.$route.params.projectId
      let taskId = this.$route.params.taskId

      if (taskId !== undefined) {
        this.setSelectTask(taskId, true)
        this.mapMode = this.EnumMapMode.TASK_MAP
        this.isEnableGraph = false
      } else if (projectId !== undefined) {
        this.mapMode = this.EnumMapMode.PROJECT_MAP
        this.isEnableGraph = true
        this.setFilterAlgorithmMode(Constants.ENUM_FILTER_ALGORITHM_MODE.ODM)
      } else {
        this.mapMode = this.EnumMapMode.ALL_PROJECT_MAP
        this.isEnableGraph = true
      }
      console.log('[created] mapMode : ', this.mapMode)

      this.algorithmMode.push(EnumAlgorithm.ODM)
      this.algorithmMode.push(EnumAlgorithm.NDVI)
      this.algorithmMode.push(EnumAlgorithm.GEOTIFF)
      this.algorithmMode.push(EnumAlgorithm.AI)

      this.requestProjectList()

      this.$store.commit(types.SET_PROJECTS, {})
      this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
      this.$store.commit(types.MAP_OPACITY, { opacity: this.opacity })
      this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, { markerId: null })
      this.$store.commit(types.MAP_TIMELINE, { isEnableTimeline: false })
      this.$store.commit(types.MAP_IMAGE_POSITION, { isEnableImagePosition: false })
      this.$store.commit(types.CLEAR_MARKER_LIST)
      this.$store.commit(types.SHOW_CONTENT, { showContents: true })

      let tmpNum = this.$store.getters.getPosition
      console.log('################# committed itemIndex #2: '+tmpNum)

      // await this.getHistogram()
    },

    mounted() {
      this.isShowTimeline
    },

    destroyed() {
      console.log('[destroyed] ')
      if (this.timelineData !== null) {
        this.timelineData.data = []
      }

      this.setFilterAlgorithmMode(null)
      this.clearImageInfoList()
    },

    methods: {
      ...mapMutations([
        'setFilterAlgorithmMode',
        'setTaskOfProjectImageInfo',
        'clearImageInfoList'
      ]),

      ...mapActions([
        'requestGetTask',
        'requestGetProjectAll',
        'requestGetProjectImageFileList',
        'requestGetFileSearchList',
        'requestGetImageFileList'
      ]),

      goToPrevPage() {
        console.log('[ProviderMap] gotoPrevPage() ')
        this.$router.go(-1)
      },

      goToTaskListPage() {
        this.detailTask = false
        this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
      },

      setSelectTask(taskId, detail) {
        console.log('[setSelectTask] taskId : ' + taskId + ', detail : ' + detail)
        this.selectedTaskId = taskId
        this.detailTask = detail

        this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, { markerId: null })
        this.$store.dispatch(types.GET_MARKER_LIST, {
          project_id: this.projectId,
          task_id: this.selectedTaskId
        })
        this.setTaskOfProjectImageInfo(taskId)
      },
      _setSelectTaskColor(item) {
        return this.selectedTaskId === item.task_id ? 'mapTaskCardSelected' : 'mapTaskCard'
      },
      setOpacity(value) {
        this.$store.commit(types.MAP_OPACITY, { opacity: value })
      },

      getImageUrl(url) {
        return Constants.TASK_MANAGER_SERVER_URL + url
      },

      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date))
      },

      _convertTimelineDate(date) {
        return StringUtil.getConvertDateFormat(new Date(date), Constants.FORMAT_CONVERT_TIMELINE_DATE)
      },

      async getImageList(fileId) {
        this.imageList = this.getImageInfoList
        if (fileId) {
          this.imageList = this.imageList.filter((item) => {
            return item.id === fileId
          })
        }
      },

      async goToDetailView(fileId) {
        console.log('[goToDetailView] ')
        await this.getImageList(fileId)
        this.enableDetailView = true
      },

      async showImageLayout(_, fileId) {
        console.log('[showImageLayout] ')
        await this.getImageList(fileId)

        const fileManager = ImageUtil.FileManagerUrl({}, {
          [ImageUtil.FILE_ID]: fileId
        })
        this.imageUrl = fileManager.storageImageUrl
        this.enableImageLayout = true
      },

      getTaskAddress(taskId) {
        let task = this.getTaskInfo(taskId)

        if (task.address instanceof Object) {
          return task.address.result[0]
        } else {
          return { text: '' }
        }
      },

      validStatusFilter(tasks) {
        if (tasks === undefined) return
        return tasks.filter(task => task.status === Constants.ENUM_TASK_STATUS.COMPLETED.value)
      },

      _calAlgorithmBadgeColor(algorithm) {
        switch (algorithm) {
          case Constants.TASK_ALGORITHM_ODM:
            return '#4CBDCB'
          case Constants.TASK_ALGORITHM_SCAN:
            return '#FF8F93'
          case Constants.TASK_ALGORITHM_NDVI:
            return '#81CAAF'
          case Constants.TASK_ALGORITHM_TEMPERATURE:
            return '#FC4B8F'
          case Constants.TASK_ALGORITHM_GEOTIFF:
            return '#EDAF20'
          case Constants.TASK_ALGORITHM_AI:
            return '#81CFFF'
        }
      },

      initTimelineData() {
        if (this.timelineData) {
          this.timelineData.property = ''
          this.timelineData.data = []
        }
      },

      updateTimelineData(taskList) {
        console.log('[updateTimelineData] ', taskList)
        if (taskList) {
          let timelineData
          this.initTimelineData()
          timelineData = new StringUtil.clone(Constants.TIMELINE_DATA)
          taskList.forEach((item) => {
            timelineData.data.push(
              {
                'taskId': item.task_id,
                'date': this._convertTimelineDate(item.created_at),
                'value': 0
              }
            )
            console.log('[updateTimelineData] date : ' + this._convertTimelineDate(item.created_at))
          })

          console.log('[updateTimelineData] this.timelineData : ', timelineData)
          this.timelineData = timelineData
        }
      },

      async requestProjectList() {
        this.progressBar = true
        let projectId = this.$route.params.projectId

        this.requestGetProjectAll(projectId)
      },

      sortProject(mode) {
        console.log('[sortProject] key : ' + mode)

        this.sortMode = mode

        switch (mode) {
          case EnumSortMode.CREATE_TIME:
            this.sortProjectCreateTimeList()
            break
          case EnumSortMode.NAME:
            this.sortProjectNameList()
            break
          case EnumSortMode.SHOOTING_TIME:
            this.sortProjectShootingTimeList()
            break
          case EnumSortMode.UPDATE_TIME:
            this.sortProjectUpdateTimeList()
            break
          default:
            break
        }
      },

      sortProjectCreateTimeList() {
        let project = this.getProjectInfo
        project.tasks.sort((a, b) => {
          return ('' + b.created_at).localeCompare(a.created_at)
        })
      },

      sortProjectNameList() {
        let project = this.getProjectInfo
        project.tasks.sort((a, b) => {
          return ('' + a.name).localeCompare(b.name)
        })
      },

      sortProjectShootingTimeList() {
        let project = this.getProjectInfo
        project.tasks.sort((a, b) => {
          return ('' + b.base_date).localeCompare(a.base_date)
        })
      },

      sortProjectUpdateTimeList() {
        let project = this.getProjectInfo
        project.tasks.sort((a, b) => {
          return ('' + b.touched_at).localeCompare(a.touched_at)
        })
      },

      selectTask(taskId, detail) {
        console.log('[selectTask] taskId : ' + taskId)
        this.$store.commit(types.SELECT_TASK_ID, { taskId: taskId })
        this.setSelectTask(taskId, detail)
      },

      isAvailableAlgorithm(mode) {
        let available = false
        this.algorithmMode.some((availableMode) => {
          if (mode.toLowerCase() === availableMode.name.toLowerCase()) {
            available = true
            return true
          }
        })
        return available
      },

      getGeoDataCode(localName) {
        let splitLocalName = localName.split(' ')

        let serviceCode = Constants.ENUM_LOCAL_AREA.SIGG

        if (splitLocalName.length > 0) {
          let lastName = splitLocalName[splitLocalName.length - 1]
          console.log('[getGeoDataCode] splitLocalName : ' + lastName)

          if (splitLocalName.length === 1 &&
            (lastName.includes('도') || lastName.includes('광역시') || lastName.includes('특별시'))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.SIDO
          } else if (splitLocalName.length === 2 &&
            (lastName.includes('시') || lastName.includes('군') || lastName.includes('구'))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.SIGG
          } else if (splitLocalName.length === 3 &&
            (lastName.includes('읍') || lastName.includes('면') || lastName.includes('동'))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.EMD
          } else {
            serviceCode = Constants.ENUM_LOCAL_AREA.RI
          }
        }

        return serviceCode
      },

      setSelectAlgorithm(algorithm) {
        this.setFilterAlgorithmMode(algorithm)
        this.selectTask(this.getTaskList[0].task_id, false)
      },

      async getHistogram() {
        try {
          // if (this.isNdvi === false) {
          //   console.log('################################## isNDVI: false')
          //   return
          // }

          let getHistogramParam = {
            project_id: this.projectId,
            task_id: this.taskId
          }

          let response = await taskAPI.getHistogram(getHistogramParam)
          if (response.returnCode != 0) {
            console.log('There is no histogram: ', response)
            return
          }

          let histogram_info = response.histogram_info
          let maxCount = 0
          let histData = Object.assign({}, this.histogramData)

          console.log('############## Histogram ##############')
          console.log(histogram_info.histogram)
          for (let i in histogram_info.histogram) {
            let item = histogram_info.histogram[i]
            //re-scaling 0 ~ 255 => -1 ~ 1
            // let ndviLevel = item.level //parseFloat(item.level / parseFloat((histogram_info.max + 1) / 2)) - 1.
            let ndviLevel = item.level //parseFloat(item.level / parseFloat((histogram_info.max + 1) / 2)) - 1.
            let fixedNdvi = ndviLevel//ndviLevel.toFixed(2)
            histData.labels.push(''+fixedNdvi)
            histData.datasets[0].data.push(item.count)
            if (maxCount < item.count) {
              maxCount = item.count
            }
            if (i < 5)
              console.log('### histogram('+item.level+'):'+item.count)
          }

          this.histogramData = histData
          this.histogramOptions.scales.yAxes[0].ticks.max = maxCount

        } catch (err) {
          console.log(err)
        }
      }
    },

    computed: {
      ...mapGetters([
        'getAlgorithmFilters',
        'getFilterAlgorithmMode',
        'getImageInfoList'
      ]),

      getProject() {
        return this.$store.getters.getProject
      },

      getProjectInfo() {
        console.log('[getProjectInfo]')
        // let project = new StringUtil.clone(this.getProject)
        //
        // if (this.mapMode !== this.EnumMapMode.TASK_MAP) {
        //   return this.filterAlgorithmProject(this.filterAlgorithmMode, project)
        // }
        return this.$store.getters.getProject
      },

      getTaskInfo() {
        return (taskId) => {
          let taskList = this.getTaskList
          let task = null
          if (taskList !== undefined && taskId !== undefined) {
            task = taskList.filter((data) => {
              if (data.task_id === taskId)
                return data.task_id === taskId
            })
          }

          if (task != null && task.length != 0 && task[0].algorithm === 'NDVI') {
            // console.log('####################### NDVI')
            this.isNdvi = true
          }

          return task === null ? null : task[0]
        }
      },

      getTaskList() {
        console.log('[getTaskList] *****************')
        if (this.getProjectInfo === undefined) return
        this.progressBar = false
        const tasks = this.getProjectInfo.tasks//this.validStatusFilter(this.getProjectInfo.tasks)
        // const tasks = this.getProjectInfo.tasks

        console.log('[getTaskList] task : ', tasks)
        if (tasks && this.mapMode !== this.EnumMapMode.TASK_MAP) {
          this.isEnableGraph = tasks.length > 1
        }

        this.updateTimelineData(tasks)
        return tasks
      },

      getSelectTaskId() {
        console.log('[getSelectTaskId] ' + this.$store.getters.getSelectTaskId)
        return this.$store.getters.getSelectTaskId
      },

      mergeProjectInfo() {
        let project = this.getProjectInfo
        if (!project.tasks) return null

        let tasks = project.tasks//this.validStatusFilter(project.tasks)

        if (this.mapMode === this.EnumMapMode.TASK_MAP) {
          this.projectInfo.projectId = project.project_id

          let taskId = this.$route.params.taskId

          tasks.forEach((task) => {
            if (task.task_id === taskId) {
              this.projectInfo.tasks.push(task)
            }
          })
        } else {
          this.projectInfo.projectId = project.project_id

          tasks.forEach((task) => {
            if (this.isAvailableAlgorithm(task.algorithm)) {
              this.projectInfo.tasks.push(task)

              if (this.selectedTaskId === null) {
                this.selectTask(task.task_id, this.detailTask)
              }
            }
          })
        }
        return this.projectInfo
      },

      isShowMarkerContent() {
        let isShow = this.$store.getters.isShowContent
        console.log('[isShowMarkerContent] isShow : ' + isShow)
        return isShow
      },

      isShowTimeline() {
        let isShow = this.$store.getters.isEnableTimeLayer
        let baseMap = document.getElementById('baseMap')

        if (baseMap) {
          if (isShow) {
            baseMap.style.height = '60%'
          } else {
            baseMap.style.height = '94%'
          }
        }
        console.log('[isShowTimeline] isShow : ' + isShow + ', baseMap', baseMap)
      },

      originalImageViewIcon() {
        return require('@/assets/originalImage.png')
      },

      getTimelineData() {
        console.log('[getTimelineData] ')
        return this.timelineData
      },

      isNDVI() {
        if (this.isNdvi == true) {
          this.getHistogram()
        }

        return this.isNdvi
      }
    },

    watch: {
      opacity: function(val, oldVal) {
        console.log('[opacity] val : ' + val)
        this.setOpacity(val)
      },

      getSelectTaskId(val, oldVal) {
        if (val !== this.selectedTaskId) {
          this.setSelectTask(val, this.detailTask)
        }
      },

      getTaskList(val, oldVal) {
        if (oldVal === undefined && val !== undefined) {
          switch (this.mapMode) {
            case this.EnumMapMode.TASK_MAP:
              let selectTaskId = this.selectedTaskId === null ? val[0].task_id : this.selectedTaskId
              console.log('[getTaskList] selectTaskId : ' + selectTaskId)
              let taskInfo = val.filter((data) => {
                return data.task_id === selectTaskId
              })
              if (taskInfo.length > 0) {
                this.requestGetFileSearchList(taskInfo[0].taskfiles.storagefiles)
              }
              break
            case this.EnumMapMode.PROJECT_MAP:
              let projectId = this.$route.params.projectId
              console.log('[getTaskList] tasklist : ', val)
              this.requestGetProjectImageFileList({ tasks: val })
              break
          }
        }
      },
      isShowMarkerContent(val, oldVal) {
      },
      isShowTimeline(val, oldVal) {
      }
    }
  }
</script>

<style scoped>
  .toolbarTitle {
    font-weight: bold;
    color: white
  }

  .content {
    position: fixed;
    width: 100%;
    height: 100%
  }

  .mapParent {
    position: fixed;
    background: darkgrey;
    width: 100%;
    height: 100vh
  }

  #baseMap {
    z-index: 0;
    width: 100%;
    height: 94%
  }

  #timeline {
    background: beige;
    z-index: 0;
    width: auto;
    height: 40%
  }

  .mapViewTools {
    float: right;
    margin-right: 2%;
    margin-top: 1%;
    z-index: 1
  }

  .rightTopOptionLayout {
    position: absolute;
    width: 40%;
    z-index: 1;
    right: 20px;
    margin-left: auto;
    margin-right: auto
  }

  .opacitySlider {
    position: absolute;
    width: 25%;
    z-index: 1;
    right: 20px;
    margin-left: auto;
    margin-right: auto
  }

  .opacitySliderBar {
    height: 20px;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto
  }

  .drawOpener {
    position: absolute;
    z-index: 2;
    top: 20px;
    width: 30px;
    min-width: 30px
  }

  .progress {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto
  }

  .timelineContainer {
    position: absolute;
    bottom: 20px
  }

  .list-action {
    height: 100%;
    display: flex;
    justify-content: start;
    align-items: start
  }

  .titleAlign {
    margin-left: 10px
  }

  h2 {
    font-size: 30px
  }

  >>> .v-list__tile--active {
    color: white !important;
    background-color: #344164
  }

  .originalImage {
    padding-right: 5px
  }

  .name {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }

  .address {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #8b93a8;
    left: 0px;
    height: auto
  }

  .date {
    position: relative;
    color: #f0646d;
    left: 0px;
    top: 0px;
    height: auto
  }

  .map-task-title {
    font-size: x-large;
    font-weight: bold
  }

  .map-task-card {
    cursor: pointer;
    border-radius: 10px;
    margin: 10px
  }

  .v-list__tile__action {
    min-width: 36px
  }
</style>
