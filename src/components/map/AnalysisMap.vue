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
          <v-container fluid px-3>
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
                <AnalysisMapAnnotationTools :readonly="isUser()"
                                            class="mapAnnotationTools"></AnalysisMapAnnotationTools>
                <AnalysisAreaContents :readonly="isUser()" v-if="getContent"
                                      :analysis-id="analysisId"></AnalysisAreaContents>
              </v-layout>
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
            <template v-if="getTaskInfo(selectedTaskId)">
              {{ getTaskInfo(selectedTaskId).name }}
            </template>
          </v-toolbar-title>

          <v-layout row align-right justify-end class="rightTopOptionLayout">
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
              :transparency="true"
              @detail-view="showImageLayout"
            ></BaseMap>
            <v-layout align-start justify-start fill-height white>
              <v-flex xs12>
                <quill-editor
                  v-if="!isUser()"
                  v-model="analysisComment"
                  :options="editorOption"
                  @blur="onEditorBlur($event)">
                </quill-editor>
                <quill-editor
                  v-if="isUser()"
                  :content="analysisComment"
                  :options="{ modules: { toolbar: false }}"
                  :disabled="true">
                </quill-editor>
              </v-flex>
            </v-layout>
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
  import BaseMap from '@/components/map/BaseMap'
  import AnalysisMapAnnotationTools from '@/components/map/AnalysisMapAnnotationTools'
  import MapViewTools from '@/components/map/MapViewTools'
  import DetailImageView from '@/components/common/DetailImageView'
  import { analysisMapMixin } from '@/components/map/analysisMapMixin'
  import AnalysisAreaContents from '@/components/map/AnalysisAreaContents'
  import { quillEditor } from 'vue-quill-editor'
  // import Quill from 'quill'
  // import { ImageDrop } from 'quill-image-drop-module'
  // import ImageResize from 'quill-image-resize-module'
  //
  // Quill.register('modules/imageDrop', ImageDrop)
  // Quill.register('modules/imageResize', ImageResize)

  export default {
    name: 'AnalysisMap',
    mixins: [
      analysisMapMixin
    ],
    components: {
      BaseMap,
      AnalysisMapAnnotationTools,
      MapViewTools,
      AnalysisAreaContents,
      DetailImageView,
      quillEditor
    },
    props: {
      projectId: {
        type: String
      },
      taskId: {
        type: String
      }
   },
    data: () => ({
      drawer: true,
      opacity: 100,
      enableDetailView: false,
      enableImageLayout: false,
      imageList: [],
      imageUrl: '',

      // Project List
      projectInfo: {
        'projectId': '',
        'tasks': []
      },

      analysisComment: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          // imageDrop: true,
          // imageResize: {
          //   displayStyles: {
          //     backgroundColor: 'black',
          //     border: 'none',
          //     color: 'white'
          //   },
          //   modules: ['Resize', 'DisplaySize', 'Toolbar']
          // }
        }
      }
    }),
    methods: {
      onEditorBlur() {
        console.log('[onEditorBlur] analysisComment: ', this.analysisComment)

        this.requestAnalysisContent(this.analysisComment)
      }
    },
    computed: {},
    watch: {}
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
    height: 70%
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

  h2 {
    font-size: 30px
  }

  >>> .v-list__tile--active {
    color: white !important;
    background-color: #344164
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

  .v-list__tile__action {
    min-width: 36px
  }

  .quill-editor,
  .quill-code {
    width: 100vw;
    height: 20vh;
  }
</style>
