<template>
  <v-layout>
    <v-layout column>
      <v-layout justify-end>
        <v-btn class="header-menu mr-0"
               v-if="!isGCP"
               slot="activator"
               color="blue"
               @click="_onClickImageUploadButton"
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
               dark ripple small>
          <v-icon class="pr-1">
            cloud_upload
          </v-icon>
          GCP Interface
        </v-btn>
      </v-layout>
      <v-data-table v-if="isShowComponent"
                    :headers="headers"
                    :items="_getImageList"
                    rows-per-page-text="페이지 당 이미지 갯수"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr @click="_onClickTableRecord(props.item)">
            <td>
              <v-layout class="ma-1"
                        align-center
                        justify-center>
                <img :src="_getImageUrl(props.item.file_id)">
              </v-layout>
            </td>
            <td class="text-xs-right">{{ props.item.org_nm}}</td>
            <td class="text-xs-right">{{ props.item.org_size }}</td>
            <td class="text-xs-right">{{ props.item.gps_lat }}</td>
            <td class="text-xs-right">{{ props.item.gps_lng }}</td>
            <td class="text-xs-right">{{ props.item.gps_alt }}</td>
            <td class="text-xs-right justify-end pr-3">
              <v-btn icon
                     class="ma-0"
                     ripple
                     @click.prevent.stop="_onClickImage(props.item.file_id)">
                <v-icon color="grey"
                        dark
                        small>
                  panorama
                </v-icon>
              </v-btn>
            </td>
          </tr>
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
              @keydown.esc="_closeModal">
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
      :task-id="task_id"
      :image-list="imageList"
      :init-index="imageIndex"
      @close="enableDetailView = false"
    ></detail-image-view>
  </v-layout>
</template>


<script>
  import Constant from '@/components/common/constants'
  import TaskImageUploadModal from '@/components/common/project/task/TaskImageUploadModal'
  import DetailImageView from "@/components/common/DetailImageView"
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import FileAPI from '@/utils/api/fileAPI'
  import {transform} from 'ol/proj.js';
  import Static from 'ol/source/ImageStatic'
  import ImageUtil from '@/utils/api/fileAPI'
  import Projection from 'ol/proj/Projection'
  import View from 'ol/View';
  import {getCenter} from 'ol/extent';

  export default {
    props: {
      project_id: {
        type: String,
        required: true
      },
      task_id: {
        type: String,
        required: true
      },
      isGCP: {
        type: Boolean
      },
      curImageInfo: {
        type: Object
      }
    },
    data() {
      return {
        task: {},
        imageList: [],
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
        imageWidth: '',
        imageHeight: ''
      }
    },
    created() {
      console.log("Image View Created!!!")
      this._requestGetImageFileList({
        projectId: this.project_id,
        taskId: this.task_id
      })
    },
    mounted() {
    },
    updated() {
      console.log("ImageView Updated!!!!!!!!!!!!!!")
      // this.$emit('onSetImageInfo', this.imageList[0])
      // console.log(this.imageList[0])
    },
    computed: {
      ...mapGetters([
        'getTask',
        'gcpMap',
        'gcpImageMap',
        // 'curGCPImageWidth',
        // 'curGCPImageHeight',
        'getImageList',
        // 'curImageInfo'
      ]),
      _getImageList() {
        return this.imageList
      },
    },
    methods: {
      ...mapMutations([
        // 'SET_GCP_CURRENT_IMAGE_WIDTH',
        // 'SET_GCP_CURRENT_IMAGE_HEIGHT',
        // 'SET_CURRENT_IMAGE_INFO'
      ]),
      ...mapActions([
        'requestGetProject',
        'requestGetTask',
        'requestGetImageFileList'
      ]),
      async _requestGetImageFileList({projectId, taskId}) {
        await this.requestGetImageFileList({projectId, taskId})
        // this.task = this.getTask
        this.imageList = await this.getImageList
        this.isShowComponent = true
      },
      _onClickImageUploadButton() {
        this.isOpenUploadModal = true
      },
      _onClickGCPInterfaceButton() {
        this.$router.push({
          name: 'gcpi',
          params: {
            "projectId": this.project_id,
            "taskId": this.task_id
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
          this._requestGetTask({
            project_id: this.project_id,
            task_id: this.task_id
          }, Constant.TASK_INFO_ALL)
        }
      },
      _getImageUrl: function (fid) {
        return FileAPI.FileManagerUrl(this, FileAPI.FileId(fid)).thumbnailUrl
      },
      _onClickImage(fid) {
        this.imageIndex = this.imageList.findIndex(image => image.file_id === fid)
        this.enableDetailView = true
      },
      async _onClickTableRecord(item) {
        //Map Viewer 설정
        // const mapView = this.gcpMap.getView()
        // mapView.setCenter(transform([item.gps_lng, item.gps_lat], 'EPSG:4326', 'EPSG:3857'))
        // mapView.setZoom(18)

        //Image Viewer 설정
        console.log(item)
        // this.curImageInfo = item
        // this.curImageWidth = item.exif_info.ImageWidth
        // this.curImageHeight = item.exif_info.ImageHeight
        this.$emit('onSetImageInfo', item)
        // this.$emit('set-imagewidth', item.exif_info.ImageWidth)
        // this.$emit('set-imageheight', item.exif_info.ImageHeight)


        // const fileManager = await ImageUtil.FileManagerUrl({
        //   [ImageUtil.PROJECT_ID]: this.project_id,
        //   [ImageUtil.TASK_ID]: this.task_id
        // }, {
        //   [ImageUtil.FILE_ID]: item.file_id
        // })
        // const originImageURL = await fileManager.imageUrl;
        // const imageViewExtent = await [0, 0, this.curGCPImageWidth, this.curGCPImageHeight]
        //
        // const imageViewProjection = await new Projection({
        //   code: 'xkcd-image',
        //   units: 'pixels',
        //   extent: imageViewExtent
        // })
        //
        // const imageMapSource = await new Static({
        //   url: originImageURL,
        //   projection: imageViewProjection,
        //   imageExtent: imageViewExtent,
        //   imageSize: [this.curGCPImageWidth, this.curGCPImageHeight]
        // })
        //
        // const view = await new View({
        //   projection: imageViewProjection,
        //   center: getCenter(imageViewExtent),
        //   zoom: 2,
        //   minZoom: 1,
        //   maxZoom: 8,
        //   resolution: 1,
        // })
        //
        // // Image Viewer 이벤트 셋팅
        // view.on('change:resolution', this._constrainPan);
        // view.on('change:center', this._constrainPan);
        //
        // const imageMap = await this.gcpImageMap.getLayers().getArray()[0]
        // await imageMap.setSource(imageMapSource)
        // await this.gcpImageMap.setView(view)
      },

      // _constrainPan() {
      //   console.log("move");
      //   const view = this.gcpImageMap.getView()
      //   const extents = [0, 0, this.curGCPImageWidth, this.curGCPImageHeight];
      //   const visible = view.calculateExtent(this.gcpImageMap.getSize());
      //   const center = view.getCenter();
      //   let delta;
      //   let adjust = false;
      //
      //   if ((delta = extents[0] - visible[0]) >= 0) {
      //     adjust = true;
      //     //console.log(delta);
      //     center[0] += delta;
      //   } else if ((delta = extents[2] - visible[2]) <= 0) {
      //     adjust = true;
      //     center[0] += delta;
      //   }
      //   if ((delta = extents[1] - visible[1]) >= 0) {
      //     adjust = true;
      //     center[1] += delta;
      //   } else if ((delta = extents[3] - visible[3]) <= 0) {
      //     adjust = true;
      //     center[1] += delta;
      //   }
      //   if (adjust) {
      //     view.setCenter(center);
      //   }
      // }
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
