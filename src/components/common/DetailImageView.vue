<template>
  <div id="DetailImageView">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      scrollable
    >
      <v-card tile>
        <v-toolbar height="30px" card dark color="black">
          <v-toolbar-title>{{ currentIndex + 1 + " / " + getTotalListSize }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="resetImage()">
            <v-icon>crop_original</v-icon>
          </v-btn>
          <div v-show="!gridImageDialog">
            <v-btn icon dark @click.native="gridImageDialog = true">
              <v-icon>grid_on</v-icon>
            </v-btn>
          </div>
          <div v-show="gridImageDialog">
            <v-btn icon dark @click.native="gridImageDialog = false">
              <v-icon>grid_off</v-icon>
            </v-btn>
          </div>
          <v-btn icon dark @click.native="closePopup()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card class="cardParent">
          <viewer :options="Options"
                  class="viewer media" ref="viewer"
                  :images="[getCurrentImageUrl()]"
                  @inited="inited">
            <img class="mediaImage"
                 @load="onImageLoaded"
                 :src="getCurrentImageUrl()"/>
          </viewer>
          <v-card-actions class="media">
            <GridImageView class="gridView"
                           v-if="gridImageDialog"
                           :detailViewType="detailViewType"
                           :project-id="projectId"
                           :task-id="taskId"
                           :image-list="imageList"
            ></GridImageView>
          </v-card-actions>
          <v-btn class="pageBtn prevPage" icon flat fixed large color="orange" @click="prevPage">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <v-btn class="pageBtn nextPage" icon flat fixed large color="orange" @click="nextPage">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-card>
        <v-card-title class="content">
          <v-flex>
            <div>
              <template v-if="getCurrentImageInfo">
                <table>
                  <tr>
                    <th><span class="grey--text">위도</span></th>
                    <th><span class="grey--text">경도</span></th>
                    <th><span class="grey--text">고도</span></th>
                    <th><span class="grey--text">FOV</span></th>
                    <th><span class="grey--text">ISO</span></th>
                    <th><span class="grey--text">Pitch</span></th>
                    <th><span class="grey--text">Yaw</span></th>
                    <th><span class="grey--text">Roll</span></th>
                    <th><span class="grey--text">제조회사</span></th>
                    <th><span class="grey--text">제품모델</span></th>
                    <th><span class="grey--text">포맷</span></th>
                    <th><span class="grey--text">파일이름</span></th>
                    <th><span class="grey--text">파일크기</span></th>
                    <th><span class="grey--text">파일형식</span></th>
                    <th><span class="grey--text">가로</span></th>
                    <th><span class="grey--text">세로</span></th>
                    <th><span class="grey--text">생성 날짜</span></th>
                  </tr>
                  <tr>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().gps_lat) ? getCurrentImageInfo().gps_lat : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().gps_lng) ? getCurrentImageInfo().gps_lng : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().gps_alt) ? getCurrentImageInfo().gps_alt : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.FOV : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.ISO : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Pitch : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Yaw : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Roll : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Make : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Model : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.Format : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.FileName : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.FileSize : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.FileType : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.ImageWidth : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? getCurrentImageInfo().exif_info.ImageHeight : ""}}</span></td>
                    <td><span class="grey--text">{{(!!this.getCurrentImageInfo().exif_info) ? convertDate(getCurrentImageInfo().exif_info.CreateDate) : ""}}</span></td>
                  </tr>
                </table>
              </template>
            </div>
          </v-flex>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.css'
  import GridImageView from './GridImageView'
  import StringUtil from "@/utils/utils/stringUtil";
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  import {imageViewMixin} from '@/components/common/imageViewMixin'

  Vue.use(Viewer)

  export default {
    name: "DetailImageView",
    mixins: [imageViewMixin],
    components: {
      GridImageView
    },
    data: () => ({
      dialog: false,
      gridImageDialog: false,
      Options: {
        "inline": true,
        "button": false,
        "navbar": false,
        "title": false,
        "toolbar": false,
        "tooltip": true,
        "movable": true,
        "zoomable": true,
        "rotatable": true,
        "scalable": true,
        "transition": true,
        "fullscreen": false,
        "keyboard": false,
        "url": "data-source"
      }
    }),

    props: {
      initIndex: {
        type: Number
      }
    },

    created() {
      this.dialog = true
      this.currentIndex = this.initIndex ? this.initIndex : 0
      this.imageType = this.ENUM_IMAGE_TYPE.ORIGINAL_IMAGE

      // Warning 해결 :
      // [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive.
      document.addEventListener('wheel', null, {passive: true})
    },
    methods: {
      inited(viewer) {
        this.$viewer = viewer
      },
      show() {
        this.$viewer.show()
      },
      nextPage() {
        let index = this.currentIndex
        if (index < this.getTotalListSize - 1) {
          index++;
          this.currentIndex = index
        }
      },
      prevPage() {
        let index = this.currentIndex
        if (index > 0) {
          index--;
          this.currentIndex = index
        }
      },
      closePopup() {
        this.dialog = false
        this.$emit('close')
      },
      convertDate(date) {
        let createDate = new Date()

        //month 는 0 ~ 부터 시작하여 기본 월에 +1이 되어 표시되므로 -1을 하여 기본 값과 맞추도록함.
        createDate.setFullYear(date.year, date.month - 1, date.day)
        createDate.setHours(date.hour, date.minute, date.second)

        return StringUtil.getConvertDate(new Date(createDate))
      },
      resetImage() {
        this.$viewer.reset()

        if (this.getCurrentImageInfo().exif_info) {
          let yaw = this.getCurrentImageInfo().exif_info.Yaw
          if (yaw) this.rotate(yaw)
        }
      },
      rotate(value) {
        console.log("[rotate] ")
        if (this.$viewer) {
          console.log("[rotate] value : " + value)
          this.$viewer.rotate(value)
        }
      },
      onImageLoaded() {
        console.log("[onImageLoaded] ")

        setTimeout(()=> {
          // rotate
          if (this.getCurrentImageInfo().exif_info) {
            let yaw = this.getCurrentImageInfo().exif_info.Yaw
            if (yaw) this.rotate(yaw)
          }
        }, 400)
      },
    },
  }
</script>

<style scoped>
  .media {
    background: black;
    object-fit: scale-down;
  }

  .cardParent {
    margin-top: auto;
    margin-bottom: auto;
  }

  .mediaImage {
    visibility: hidden;
    height: 80vh;
  }

  .pageBtn {
    position: absolute;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
  }

  .prevPage {
    left: 10px;
    float: left;
  }

  .nextPage {
    right: 10px;
    float: right;
  }

  .content {
    width: 100%;
    background: black;
  }

  .gridView {
    top: 10px;
  }

  table {
    margin-left: auto;
    margin-right: auto;
  }

  th, td {
    padding: 5px;
    text-align: left;
  }

</style>
