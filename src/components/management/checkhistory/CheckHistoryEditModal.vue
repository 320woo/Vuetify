<template>
  <div>
    <progress-dialog :is-show-dialog="showDialog"></progress-dialog>
    <base-modal>
      <div slot="title"
           class="headline">점검내역 수정
      </div>
      <v-container class="py-1 my-1"
                   slot="content"
                   grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="점검자"
                          v-model="getEditCheckHistory.checker"
                          :rules="[rules.required]">
            </v-text-field>
          </v-flex>


          <v-flex xs12>
            <v-dialog
              ref="dateDialog"
              v-model="dateModal"
              :return-value.sync="date"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="date"
                label="점검날짜"
                readonly>
              </v-text-field>
              <v-date-picker v-model="date"
                             scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="dateModal = false">취소</v-btn>
                <v-btn flat color="primary" @click="$refs.dateDialog.save(date)">확인</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>

          <v-flex xs12>
            <v-dialog
              ref="timeDialog"
              v-model="timeModal"
              :return-value.sync="time"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="time"
                label="점검시간"
                readonly>
              </v-text-field>
              <v-time-picker v-model="time" format="24hr">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="timeModal = false">취소</v-btn>
                <v-btn flat color="primary" @click="$refs.timeDialog.save(time)">확인</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="상태"
                          v-model="getEditCheckHistory.check_type"
                          :rules="[rules.required]">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea box
                        label="상세내역"
                        v-model="getEditCheckHistory.check_detail"
                        :rules="[rules.required]">
            </v-textarea>
          </v-flex>
          <v-flex v-for="(item, index) in getCheckHistoryCustomFieldKeyList"
                  :key="index" xs12>
            <v-text-field :label=item
                          v-model="getEditCheckHistory.custom_info[item]"
                          :rules="[rules.required]">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-layout
              v-if="viewImages.length > 0 && showImageViewer"
              pa-0>
              <viewer
                :options="Options"
                :images="viewImages"
                @inited="inited"
                class="viewer"
                ref="viewer">
                <template
                  v-for="(src, index) in viewImages">
                  <img class="mediaImage" :src="src.url" :key="index">
                </template>
              </viewer>
              <v-btn
                flat
                icon
                small
                @click="removeUploadImage">
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout>
              <v-icon @click="showImageViewer = !showImageViewer">
                collections
              </v-icon>
              <div class="pl-2 py-3"> {{ viewImages.length }} </div>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-grey"
                class="white--text"
                @click="addFile">
                이미지 추가
                <v-icon class="pl-1">
                  add_to_photos
                </v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <v-btn slot="negative-button"
             color="blue darken-1"
             flat
             @click="CLOSE_MODAL_CHECK_HISTORY">
        닫기
      </v-btn>
      <v-btn slot="positive-button"
             color="blue darken-1"
             flat
             @click="onClickConfirm">
        수정
      </v-btn>
    </base-modal>
    <file-upload></file-upload>
  </div>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import moment from 'moment-timezone'
  import Constants from '@/components/common/constants'
  import FileUpload from '@/components/common/FileUpload'
  import * as types from '@/vuex/mutation-types'
  import ProgressDialog from '@/components/common/ProgressDialog'

  const ENUM_VIEW_TYPE = {
    ALREADY: "already",
    ADD: "add"
  }

  export default {
    extends: BaseComponent,
    props: [],
    data: () => ({
      date: null,
      time: null,
      dateModal: false,
      timeModal: false,
      modal: false,
      showText: false,
      showImageViewer: false,
      uploadedImages: [],
      deleteImages: [],
      viewImages: [],
      showDialog: false,
      rules: {
        required: value => !!value || '필수 입력',
        min: v => v.length >= 4 || 'Min 4 characters',
      },
      isOpenConfirmModal: false,
      modalTitle: '',
      modalContent: '',
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
      }
    }),
    created() {
      this.date = moment(this.getEditCheckHistory.check_date).format('YYYY-MM-DD')
      this.time = moment(this.getEditCheckHistory.check_date).format('HH:mm')

      this.uploadedImages = this.getEditCheckHistory.infoimages
      this.getEditCheckHistory.infoimages.forEach((item) => {
        console.log("[item.image_url]  : ", item.image_url);
        this.viewImages.push({type: ENUM_VIEW_TYPE.ALREADY, url: this.getUploadedUrl(item.image_url)})
      })
    },
    computed: {
      ...mapGetters([
        'getFacility',
        'getEditCheckHistory',
        'getCheckHistoryCustomFieldKeyList',
        'isActiveCheckHistoryCustomField'
      ]),
      getUploadFiles() {
        return this.$store.getters.getUploadFiles
      }
    },
    watch: {
      getUploadFiles(val, oldVal) {
        console.log("[getUploadFiles] val ", val);
        console.log("[getUploadFiles] oldVal ", oldVal);

        this.viewImages.splice(this.uploadedImages.length, this.viewImages.length - this.uploadedImages.length)
        val.forEach((item) => {
          this.viewImages.push({type: ENUM_VIEW_TYPE.ADD, url: item.blob})
        })

        console.log("[getUploadFiles] viewImages : ", this.viewImages);
      }
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_CHECK_HISTORY',
        'SET_IS_ACTIVE_CUSTOM_FIELD_CHECK_HISTORY'
      ]),
      ...mapActions([
        'requestUpdateCheckHistory',
        'requestDeleteCheckHistoryImage',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._updateCheckHistory()
        } else {
          this.openGlobalModal({})
        }
      },
      // UpdateCheckHistory
      async _updateCheckHistory() {
        this.showDialog = true;
        // 삭제할 이미지 삭제
        this.deleteImages.forEach((item) => {
          console.log("[deleteImages] item : ", item);
          this.requestDeleteCheckHistoryImage({
            basicId: this.getFacility.basic_id,
            checkHistoryId: this.getEditCheckHistory.checkhistory_id,
            imageId: item.infoimage_id
          })
        })

        // 수정할 데이터 수정 및 이미지 추가
        this.getEditCheckHistory.check_date = await moment.tz(`${this.date} ${this.time}`, "Asia/Seoul").format()
        const checkHistory = await JSON.parse(JSON.stringify(this.getEditCheckHistory))

        if (this.getUploadFiles.length > 0) {
          checkHistory['images'] = this.getUploadFiles;
        }
        delete checkHistory['infoimages']

        await this.requestUpdateCheckHistory({
          basicId: this.getFacility.basic_id,
          checkHistory: checkHistory
        })
        this.showDialog = false;
        this.CLOSE_MODAL_CHECK_HISTORY()
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
      inited(viewer) {
        this.$viewer = viewer
      },

      show() {
        this.$viewer.show()
      },

      removeUploadImage() {
        console.log("[removeUploadImage] index : ", this.$viewer.index);
        let deleteItem = this.uploadedImages.splice(this.$viewer.index, 1);
        console.log("[removeUploadImage] item : ", deleteItem);

        if (deleteItem.length > 0) {
          this.viewImages.splice(this.$viewer.index, 1)

          deleteItem.forEach((item) => {
            this.deleteImages.push(item)
          })
        } else {
          let removeIndex = this.$viewer.index - this.uploadedImages.length
          console.log("[removeUploadImage] removeIndex : " + removeIndex);
          this.$store.commit(types.DELETE_UPLOAD_FILE, { index: removeIndex })
        }

      },
      getUploadedUrl(url) {
        return `${Constants.API_SERVER}/api/informations/${url}`;
      }
    },
    components: {
      BaseModal,
      ConfirmModal,
      FileUpload,
      ProgressDialog
    }
  }

</script>

<style scoped>
  .viewer {
    display: block;
    width: 100%;
    margin-bottom: 180px;
  }

  .mediaImage {
    visibility: hidden;
    height: 0px;
  }
</style>
