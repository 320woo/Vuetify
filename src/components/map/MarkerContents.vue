<template>
  <div v-if="getContent">
    <file-upload></file-upload>
    <v-container fluid grid-list-xl
                 py-0
                 px-0
                 ma-0>
      <v-layout column wrap>
        <v-flex xs12 sm12 md12 py-1>
          <v-layout row wrap align-center justify-center fill-height>
            <v-flex xs12 sm10 pr-0>
              <v-text-field
                label="제목"
                v-model="title"
                append-outer-icon="done"
                @click:append="requestUpdateTitle"
                @change="requestUpdateTitle"
                placeholder="위치 이름">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm2 pl-0>
              <v-btn flat
                     icon
                     @click="deleteMarkerDialog = true">
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout v-if="type === this.Constants.ENUM_ANNOTATION_TYPE.LOCATION"
                    row wrap px-2>
            <p>좌표</p>
            <v-spacer></v-spacer>
            <p>{{ lng }},</p>
            <p>&nbsp{{ lat }}</p>
          </v-layout>
          <v-layout v-else-if="type === Constants.ENUM_ANNOTATION_TYPE.DISTANCE"
                    row wrap px-2>
            <p>길이</p>
            <v-spacer></v-spacer>
            <p v-html="value"></p>
          </v-layout>
          <v-layout v-else-if="type === Constants.ENUM_ANNOTATION_TYPE.METRIC"
                    row wrap px-2>
            <p>면적</p>
            <v-spacer></v-spacer>
            <p v-html="value"></p>
          </v-layout>
          <v-layout v-else-if="type === Constants.ENUM_ANNOTATION_TYPE.VOLUME"
                    row wrap px-2>
            <p>부피</p>
            <v-spacer></v-spacer>
            <p v-html="value"></p>
          </v-layout>
          <v-container
            id="scroll-target"
            style="max-height: 230px; height: 230px;"
            class="scroll-y"
            pa-0
            ma-0>
            <v-layout id="scrolled-content" column wrap justify-start ma-1>
              <v-list xs12 sm12 pa-0>
                <template v-for="(item, index) in comments">
                  <v-flex xs12 pa-0 my-2 elevation-1
                          v-if="item.annoimages && item.annoimages.length > 0">
                    <v-card color="grey lighten-2"
                            v-for="(annoimage, index) in item.annoimages" :key="index">
                      <div class="img_title">
                        <v-layout row wrap>
                          <v-flex xs12 sm9 ma-1 mx-2>
                            <v-layout column wrap justify-start>
                              <v-list-tile-content>
                                <v-list-tile-title class="grey--text text--darken-1">
                                  {{parserTimezone(item.created_at)}}
                                </v-list-tile-title>
                                <span class="black--text text--darken-2" v-if="item.comment">
                                  {{item.comment}}
                                </span>
                              </v-list-tile-content>
                            </v-layout>
                          </v-flex>
                          <v-spacer></v-spacer>
                          <v-btn
                            flat
                            icon
                            small
                            @click="deleteComment(item.comment_id)"
                          >
                            <v-icon>
                              clear
                            </v-icon>
                          </v-btn>
                        </v-layout>
                      </div>
                      <v-img
                        :src="getImageUrl(item.comment_id, annoimage.annoimage_id)"></v-img>
                    </v-card>
                  </v-flex>
                  <v-textarea
                    v-else-if="item.comment"
                    background-color="#566a98"
                    box
                    pa-0
                    mb-2
                    readonly
                    auto-grow
                    rows="1"
                    append-icon="clear"
                    @click:append="deleteComment(item.comment_id)"
                    :label="parserTimezone(item.created_at)"
                    :value="item.comment">
                  </v-textarea>
                </template>
              </v-list>
            </v-layout>
          </v-container>

          <v-layout
            v-if="getUploadFiles.length > 0"
            pa-0>
            <viewer
              :options="Options"
              :images="getUploadFiles"
              @inited="inited"
              class="viewer"
              ref="viewer"
            >
              <template
                v-for="(src, index) in getUploadFiles">
                <img class="mediaImage" :src="src.blob" :key="index">
              </template>
            </viewer>
            <v-btn
              flat
              icon
              small
              @click="removeUploadImage"
            >
              <v-icon>
                clear
              </v-icon>
            </v-btn>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 ms12 sm2 ma-0 py-2 px-0>
              <v-btn
                class="map-annotation-button"
                small
                ripple
                icon
                slot="activator"
                @click="addFile">
                <v-icon color="black">
                  add_a_photo
                </v-icon>
                <!--<v-layout column wrap>-->
                <!--<img :src="toggleList[index].icon">-->
                <!--</v-layout>-->
              </v-btn>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 ms12 sm10 ma-0 py-1 pl-0 pr-2>
              <v-text-field
                class="textfield"
                solo
                label="메세지"
                background-color="#566a98"
                v-model="message"
                append-icon="keyboard_return"
                @focusout="focusEvent"
                @keyup.enter="requestAddComment"
                @click:append="requestAddComment"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-dialog
        v-model="isShowDialog"
        max-width="290">
        <v-card>
          <v-card-title class="headline">삭제</v-card-title>

          <v-card-text>
            {{ getDialogMessage() }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="hiddenDialog">
              취소
            </v-btn>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="deleteMarkerContent">
              확인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import * as types from '../../vuex/mutation-types'
  import Constants from '../../components/common/constants'
  import StringUtil from '@/utils/utils/stringUtil'
  import FileUpload from '@/components/common/FileUpload'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer);

  const MARKER_COMMENT_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.MARKER_COMMENT_URL;
  const UPDATE_MARKER_COMMENT_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.UPDATE_MARKER_COMMENT_URL;

  const SMALL_POINT = 6;
  const COMMENT = {
    create_time: "",
    comment: "",
    attach: {}
  };

  export default {
    components: {
      FileUpload,
    },

    props: {
      projectId: {
        type: String,
        required: true
      },
      taskId: {
        type: String,
        required: true
      }
    },

    data: () => ({
      name: "MarkerContents",
      deleteMarkerDialog: false,
      deleteCommentDialog: false,
      deleteMarkerMessage: "선택된 위치 정보를 삭제하시겠습니까?",
      deleteCommentMessage: "선택된 내용을 삭제하시겠습니까?",
      deleteCommentId: "",
      title: "",
      type: "",
      lat: "0",
      lng: "0",
      value: "0",
      message: "",
      comments: [],
      SMALL_POINT,
      COMMENT,
      multiple: false, // Library에서 한번에 파일 여러개를 전송이 불가능
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      Options: {
        "inline": true,
        "button": false,
        "navbar": true,
        "title": false,
        "toolbar": false,
        "tooltip": false,
        "movable": false,
        "zoomable": false,
        "rotatable": false,
        "scalable": false,
        "transition": false,
        "fullscreen": false,
        "keyboard": false,
        "url": "data-source"
      },
      Constants,
    }),

    created() {
      document.addEventListener('keyup', this.keyEvent, false);
    },

    destroyed() {
      document.removeEventListener('keyup', this.keyEvent, false);
    },

    updated() {
      this.scrollToEnd()
    },

    methods: {
      inited(viewer) {
        this.$viewer = viewer
      },

      show() {
        this.$viewer.show()
      },

      requestUpdateTitle() {
        // console.log("[requestUpdateTitle] ");
        let content = this.getContent;
        content.title = this.title;
        console.log("[requestUpdateTitle] title : " + content.title);
        // console.log(content);
        this.$store.dispatch(types.UPDATE_MARKER,
          {
            project_id: this.projectId,
            task_id: this.taskId,
            marker_id: content.marker_id,
            content: content
          }
        )
      },

      requestAddComment() {
        console.log("[requestAddComment] ");

        let content = this.getContent;
        let reqParam = Constants.REQUEST_MARKER_COMMENT_PARAM;
        reqParam.comment = this.message;

        if (this.getUploadFiles.length > 0) {
          reqParam['images'] = this.getUploadFiles;
        }
        this.message = "";
        console.log("[requestAddComment] message : " + reqParam.comment);
        console.log(content);
        this.$store.dispatch(types.ADD_MARKER_COMMENT,
          {
            project_id: this.projectId,
            task_id: this.taskId,
            marker_id: content.marker_id,
            content: reqParam
          }
        )

        this.$store.commit(types.CLEAR_UPLOAD_FILES)
      },

      requestDeleteMarker() {
        console.log("[requestDeleteMarker] ");
        let content = this.getContent;
        console.log(content);
        this.$store.dispatch(types.DELETE_MARKER,
          {
            project_id: this.projectId,
            task_id: this.taskId,
            marker_id: content.marker_id,
          }
        )
      },

      requestDeleteMarkerComment() {
        console.log("[requestDeleteMarkerComment] ");
        let content = this.getContent;
        console.log(content);

        this.$store.dispatch(types.DELETE_MARKER_COMMENT,
          {
            project_id: this.projectId,
            task_id: this.taskId,
            marker_id: content.marker_id,
            comment_id: this.deleteCommentId,
          }
        );

        this.deleteCommentId = "";
      },

      parserTimezone(time) {
        return StringUtil.getConvertDate(time);
      },

      getContentTitle(content) {
        if (content !== undefined) {
          return content.title;
        }
        return "";
      },

      getContentCoordinate(coordinate) {
        if (coordinate !== undefined) {
          return coordinate.toFixed(SMALL_POINT);
        }
        return 0;
      },

      updateContent(data) {
        console.log("[updateContent] data : ", data);
        this.title = this.getContentTitle(data);
        this.type = data.data.type;

        switch (this.type) {
          case Constants.ENUM_ANNOTATION_TYPE.LOCATION:
            this.lng = this.getContentCoordinate(data.data.coordinate[0].gps_y);
            this.lat = this.getContentCoordinate(data.data.coordinate[0].gps_x);
            break;
          case Constants.ENUM_ANNOTATION_TYPE.DISTANCE:
          case Constants.ENUM_ANNOTATION_TYPE.METRIC:
          case Constants.ENUM_ANNOTATION_TYPE.VOLUME:
            this.value = data.data.metadata.value;
            break;
        }

        console.log("[updateContent] comments", data.comments);
        this.comments = data.comments;
      },

      hiddenDialog() {
        this.deleteMarkerDialog = false;
        this.deleteCommentDialog = false;
      },

      getDialogMessage() {
        if (this.deleteMarkerDialog) {
          return this.deleteMarkerMessage;
        } else {
          return this.deleteCommentMessage;
        }
      },

      deleteComment(id) {
        this.deleteCommentDialog = true;
        this.deleteCommentId = id;
      },

      deleteMarkerContent() {
        if (this.deleteMarkerDialog) {
          this.deleteMarkerDialog = false;
          this.requestDeleteMarker();
        } else {
          this.deleteCommentDialog = false;
          this.requestDeleteMarkerComment();
        }
      },

      scrollToEnd() {
        let elem = document.getElementById("scrolled-content");
        let container = document.getElementById("scroll-target");
        if (elem && container) {
          container.scrollTop = Math.floor(elem.offsetHeight);
        }
      },

      keyEvent(event) {
        // console.log("[keyEvent] event", event);

        if (!this.deleteMarkerDialog && event.key === "Delete"
          && document.activeElement.tagName.toLowerCase() !== "input") {
          this.deleteMarkerDialog = true;
        }
      },

      focusEvent(event) {
        console.log("[focusEvent] event : ", event);
        this.message = "";
      },

      removeUploadImage() {
        console.log("[removeUploadImage] index : ", this.$viewer.index);
        // this.uploadImages.splice(this.$viewer.index, 1);
        this.$store.commit(types.DELETE_UPLOAD_FILE, {index: this.$viewer.index})
      },

      parsingUrl(url, payload) {
        let pUrl = url.replace(Constants.PROJECTS_ID, payload.project_id)
          .replace(Constants.TASKS_ID, payload.task_id);

        if (url.includes(Constants.MARKER_ID) && payload.marker_id) {
          pUrl = pUrl.replace(Constants.MARKER_ID, payload.marker_id)
        }

        if (url.includes(Constants.COMMENT_ID) && payload.comment_id) {
          pUrl = pUrl.replace(Constants.COMMENT_ID, payload.comment_id)
        }

        return pUrl;
      },

      getImageUrl(commentId, annoimagesId) {
        let content = this.getContent;
        let url = this.parsingUrl(UPDATE_MARKER_COMMENT_URL, {
          project_id: this.projectId,
          task_id: this.taskId,
          marker_id: content.marker_id,
          comment_id: commentId
        });

        return `${url}/annoimages/${annoimagesId}`;
      },

      addFile() {
        this.getChild('FileUpload').addPhoto();
      },
      getChild(name) {
        for (let child of this.$children) {
          if (child.$options.name === name) {
            console.log("[getChild] child : ", child);
            return child;
          }
        }
      },
    },

    computed: {
      getContent() {
        let content = this.$store.getters.getCurrentViewContent;
        console.log("[getContent] content", content);
        return content
      },

      isShowDialog() {
        return this.deleteMarkerDialog || this.deleteCommentDialog;
      },

      getUploadFiles() {
        return this.$store.getters.getUploadFiles
      }
    },

    watch: {
      getContent(val, oldVal) {
        if (val) {
          this.updateContent(val);
        }
      },
    }
  }
</script>

<style scoped>
  .img_title {
    padding: 10px;
    font-size: 12px;
  }

  .viewer {
    display: block;
    width: 100%;
    height: 150px;
    margin-bottom: 50px;
  }

  .mediaImage {
    visibility: hidden;
    height: 0px;
  }

  .map-annotation-button {
    margin-bottom: 5px;
    min-width: 0 !important;
    min-height: 0 !important;
    border-radius: 10px !important;
    border: 1px solid #E1E2E4;
    background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);
  }
</style>
