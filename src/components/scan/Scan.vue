<template>
  <v-app id="scan">
    <v-navigation-drawer
      class="drawer"
      :clipped="true"
      :mobile-break-point="600"
      v-model="drawer"
      app
    >
      <v-layout v-if="taskId"
                column
                justify-center
                align-center
                pa-3>
        <task-info v-if="task.address"
                   :address="task.address.result[0]"
                   :created_at="task.created_at"></task-info>
        <v-btn small
               @click="goToDetailView()">
          원본 이미지 보기
        </v-btn>

      </v-layout>


      <v-layout>
        <BaseMap class="baseMap pa-1" v-show="mapVisible" ref="baseMap"></BaseMap>
      </v-layout>


      <v-divider class="my-3"></v-divider>


      <div>
        <v-toolbar color="indigo" dark>
          <v-toolbar-title>마커</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch label="보기/감추기" v-model="showMarker" row></v-switch>
          <v-btn flat icon dark small color="cyan" @click="goAddMarker">
            <v-icon dark>edit</v-icon>
          </v-btn>
        </v-toolbar>
        <MarkerContents
          v-if="showMarker"
          :project-id="projectId"
          :task-id="taskId">
        </MarkerContents>
      </div>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="true"
      color="blue darken-3"
      dark
      app
    >
      <v-btn icon class="hidden-xs-only"
             @click=_goToPrevPage>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="toolbarTitle">
        {{ task.name }}
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-btn
        class="drawOpener mt-4"
        block
        color="dark accent-2"
        @click="drawer=!drawer"
      >
        <v-icon v-if="drawer">chevron_left</v-icon>
        <v-icon v-else>chevron_right</v-icon>
      </v-btn>
      <!--<div id="toolbarDiv">-->
        <!--<span style="float:right;margin:10px 20px 0 0"><a id="next" href="#next-page">Next</a></span>-->
      <!--</div>-->
      <div class="openseadragon1" id="openseadragon1">
      </div>
      <v-icon v-show="false" id="placeIcon" class="placeIcon">place</v-icon>
    </v-content>
    <DetailImageView
      v-if="enableDetailView"
      :project-id="projectId"
      :task-info="task"
      @close="enableDetailView = false"
    ></DetailImageView>
  </v-app>
</template>

<script>
  import API from '@/utils/api/taskAPI'
  import StringUtil from '@/utils/utils/stringUtil'
  import TaskInfo from '@/components/shared-components/TaskInfo'
  import BaseMap from "@/components/map/BaseMap"
  import DetailImageView from "../common/DetailImageView"
  import OpenSeadragon from 'openseadragon'
  import MarkerContents from "../map/MarkerContents";
  import Constants from "../common/constants";
  import * as types from '../../vuex/mutation-types'

  export default {
    components: {
      MarkerContents,
      TaskInfo,
      BaseMap,
      DetailImageView,
    },
    props: [
      'projectId',
      'taskId'
    ],
    data() {
      return {
        drawer: true,
        task: {},
        mapVisible: true,
        enableDetailView: false,
        mapOpened: false,
        showMarker: false,
        markerInfos: [],
        markerAddMode: false,
        viewer: null,
        lastSelectedMarkerId: '',
      }
    },
    async created() {
      this.task = await this._getTaskInfo()
      this.resetMapShotPoints()

      this.$store.dispatch(types.GET_MARKER_LIST, {
        project_id: this.projectId,
        task_id: this.taskId
      });
      this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: null});

      console.log("Scan.Vue created")
    },
    watch: {
      showMarker(val) {
        console.log('showMarker changed.', val)
        this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: null});
        if (val == true) {
          this.$store.dispatch(types.GET_MARKER_LIST, {
            project_id: this.projectId,
            task_id: this.taskId
          });
        }
        else {
          this.removeOverlays()
          this.markerAddMode = false
        }
      },
      markerAddMode(val) {
        if (val) {
          this.showMarker = true
        }
      },
      getMarkerList(val, oldVal) {
        this.markerInfos = val
        this.showOverlays();
      },
    },
    mounted() {

      const hawaii = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Format: "jpeg",
          Overlap: "0",
          TileSize: "256",
          Url: `${Constants.WEB_SERVER}/static/external/hawaii.dzi_files/`,
          Size: {
            Height: "2691",
            Width: "19650"
          }
        }
      }
      const orthophoto = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Format: "jpeg",
          Overlap: "1",
          TileSize: "256",
          Url: `${Constants.WEB_SERVER}/static/external/orthophoto.dzi_files/`,
          Size: {
            Height: "9618",
            Width: "16174"
          }
        }
      }
      const techwin = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Format: "jpeg",
          Overlap: "1",
          TileSize: "256",
          Url: `${Constants.WEB_SERVER}/static/external/1515578557677.dzi_files/`,
          Size: {
            Height: "8740",
            Width: "8740"
          }
        }
      }
      const viewer = OpenSeadragon({
        id: "openseadragon1",
        showNavigator: true,
        navigatorPosition: "TOP_RIGHT",
        prefixUrl: "/static/openseadragon/images/",
        tileSources: [techwin],
        // sequenceMode: true,
        // toolbar: "toolbarDiv",
        // nextButton:     "next",
        // preserveViewport: true,
        // visibilityRatio: 1.0,
        defaultZoomLevel: 5.0,
        minZoomLevel: 1,
        // constrainDuringPan: true,
      })
      viewer.addHandler('open', () => {
        // viewer.viewport.goHome(true);
        console.log('opened')

        console.log('baseMap? ', this.$refs.baseMap)
        this.mapOpened = true
        this.resetMapShotPoints()
      });
      viewer.gestureSettingsMouse.clickToZoom = false
      this.viewer = viewer

      viewer.addHandler('canvas-click', (event) => {
        console.log(event)
        this.canvasClick(event)
      })

      console.log('Scan.Vue mounted.')
    },
    computed: {
      isTaskMode() {
        return typeof this.taskId !== undefined;
      },
      getMarkerList() {
        return this.$store.getters.getContentList;
      },
    },
    methods: {
      _goToPrevPage() {
        return this.$router.go(-1)
      },
      async _getTaskInfo() {
        await this.$store.dispatch('requestGetTask', {
          project_id: this.projectId,
          task_id: this.taskId
        })
        return this.$store.getters.getTask
      },
      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date));
      },
      goToDetailView() {
        console.log("[goToDetailView] ");
        this.enableDetailView = true;
      },
      resetMapShotPoints() {
        console.log('mapOpened: ', this.mapOpened, 'task: ', this.task.imagelist)
        if (this.mapOpened) {
          if (this.task.imagelist !== undefined && this.task.imagelist.length > 0) {
            let points = Array.map(this.task.imagelist, (item, index) => ([item.gps_lng, item.gps_lat]))
            this.$refs.baseMap.addShotPoints(points)
            console.log('task: ', this.task.imagelist)
          }
        }

      },

      // 뷰에서 모든 마커 삭제
      removeOverlays() {
        this.viewer.clearOverlays()
        const imgElem = document.getElementById(`marker-img-${this.lastSelectedMarkerId}`)
        if (imgElem) imgElem.style.color = ""
      },

      // 뷰에 모든 마커 표시
      showOverlays(selectedMarkerId) {
        console.log('showOverlays()')

        this.viewer.clearOverlays()

        if (!this.showMarker) return;

        this.markerInfos.forEach((elem) => {
          // 마커 앵커 엘리먼트 생성
          let elt = document.createElement("a")
          elt.id = `marker-overlay-${elem.marker_id}`
          elt.setAttribute("marker_id", elem.marker_id)
          // let pt = this.viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(elem.coordinate.gps_x, elem.coordinate.gps_y))
          let pt = new OpenSeadragon.Point(elem.data.coordinate[0].gps_x, elem.data.coordinate[0].gps_y)
          console.log('pt: ', pt.x, pt.y)

          // 마커 아이콘을 오버레이 이미지로 사용
          let placeIcon = document.getElementById("placeIcon")
          let img = placeIcon.cloneNode(true)
          img.id = `marker-img-${elem.marker_id}`
          img.style.display = ""
          elt.appendChild(img);
          elt.addEventListener('click', (event) => {
            this.selectMarker(elt)
            console.log(event)
          }, false)

          // osd view에 마커 오버레이 추가
          this.viewer.addOverlay({
            element: elt,
            location: pt,
            checkResize: false,
            // placement: OpenSeadragon.Placement.BOTTOM
          });
          if (selectedMarkerId == elem.marker_id) {
            this.selectMarker(elt)
          }
          console.log('add overlays')
        })
      },
      selectMarker(elt) {
        const imgBeforeElem = document.getElementById(`marker-img-${this.lastSelectedMarkerId}`)
        if (imgBeforeElem) imgBeforeElem.style.color = ""

        const marker_id = elt.getAttribute("marker_id")
        const imgElem = document.getElementById(`marker-img-${marker_id}`)
        if (imgElem) imgElem.style.color = "orange"
        console.log('clicked marker id: ', marker_id)
        this.lastSelectedMarkerId = marker_id
        this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: marker_id});
        console.log('showMarkerInfo', elt.id)
      },
      goAddMarker() {
        this.markerAddMode = true
      },
      canvasClick(event) {
        if (this.markerAddMode) {
          if (event.quick) {
            console.log('add marker')
            let crd_pixel = event.position
            let crd_point = this.viewer.viewport.pointFromPixel(crd_pixel)
            // let crd_image = this.viewer.viewport.viewportToImageCoordinates(crd_point)
            console.log('pixel: ', crd_pixel)
            console.log('point: ', crd_point)

            let content = Constants.REQUEST_MARKER_PARAM;

            content.data.coordinate[0].gps_x = crd_point.x;
            content.data.coordinate[0].gps_y = crd_point.y;

            this.$store.dispatch(types.ADD_MARKER,
              {
                project_id: this.projectId,
                task_id: this.taskId,
                content: content,
                callback: (id) => {
                  console.log("[ADD_MARKER] id : " + id);
                  this.showOverlays(id)
                  this.markerAddMode = false
                }
              });
          }
        }
      },
    },
  }
</script>

<style scoped>
  .openseadragon1 {
    /*background-color: seashell;*/
    /*border: 1px solid black;*/
    width: 100%;
    height: 100%;
    /*height: calc(100% - 40px);*/
  }

  .drawOpener {
    position: absolute;
    z-index: 2;
    top: 20px;
    width: 10px;
    min-width: 5px;
  }

  .baseMap {
    position: relative;
    /*z-index: 0;*/
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .placeIcon {
    position: relative;
    left: -12px;
    top: -20px;
  }

</style>
