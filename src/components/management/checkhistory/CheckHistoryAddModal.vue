<template>
  <div>
    <progress-dialog :is-show-dialog="showDialog"></progress-dialog>
    <base-modal>
      <div slot="title"
           class="headline">점검내역 등록
      </div>
      <v-container
        class="py-1 mb-1"
        slot="content"
        grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="점검자"
                          v-model="getAddCheckHistory.checker"
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
                             locale="ko-kr"
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
              <v-time-picker v-model="time" locale="ko-kr" format="24hr">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="timeModal = false">취소</v-btn>
                <v-btn flat color="primary" @click="$refs.timeDialog.save(time)">확인</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs12>

            <v-text-field label="상태"
                          v-model="getAddCheckHistory.check_type"
                          :rules="[rules.required]">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea box
                        label="상세내역"
                        v-model="getAddCheckHistory.check_detail"
                        :rules="[rules.required]">
            </v-textarea>
          </v-flex>
          <v-flex v-for="(item, index) in getCheckHistoryCustomFieldKeyList"
                  :key="index" xs12>
            <v-text-field :label=item
                          v-model="getAddCheckHistory.custom_info[item]"
                          :rules="[rules.required]">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-layout
              v-if="getUploadFiles.length > 0 && showImageViewer"
              pa-0>
              <viewer
                :options="Options"
                :images="getUploadFiles"
                @inited="inited"
                class="viewer"
                ref="viewer">
                <template
                  v-for="(src, index) in getUploadFiles">
                  <img class="mediaImage" :src="src.blob" :key="index">
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
              <div class="pl-2 py-3"> {{ getUploadFiles.length }}</div>
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
             @click="_closeModal()">
        닫기
      </v-btn>
      <v-btn slot="positive-button"
             color="blue darken-1"
             flat
             @click="onClickConfirm">
        추가
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
  import FileUpload from '@/components/common/FileUpload'
  import * as types from '@/vuex/mutation-types'
  import ProgressDialog from '@/components/common/ProgressDialog'

  export default {
    extends: BaseComponent,
    props: [],
    data: () => ({
      date: null,
      time: null,
      dateModal: false,
      timeModal: false,
      showText: false,
      showImageViewer: false,
      showDialog: false,
      rules: {
        required: value => !!value || '필수 입력',
        min: v => v.length >= 4 || 'Min 4 characters',
      },
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
    computed: {
      ...mapGetters([
        'getFacility',
        'getAddCheckHistory',
        'getCheckHistoryCustomFieldKeyList',
        'isActiveCheckHistoryCustomField'
      ]),
      getUploadFiles() {
        return this.$store.getters.getUploadFiles
      }
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_CHECK_HISTORY',
        'SET_IS_ACTIVE_CUSTOM_FIELD_CHECK_HISTORY'
      ]),
      ...mapActions([
        'requestGetCheckHistoryAll',
        'requestAddCheckHistory',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this.addCheckHistory()
        } else {
          this.openGlobalModal({})
        }
      },
      // Add CheckHistory
      async addCheckHistory() {
        console.log("[addCheckHistory] image length : " + this.getUploadFiles.length);
        this.getAddCheckHistory.check_date = await moment.tz(`${this.date} ${this.time}`, "Asia/Seoul").format()
        const checkHistory = await JSON.parse(JSON.stringify(this.getAddCheckHistory))

        if (this.getUploadFiles.length > 0) {
          checkHistory['images'] = this.getUploadFiles;
        }

        console.log(checkHistory)
        this.showDialog = true;
        await this.requestAddCheckHistory({
          basicId: this.getFacility.basic_id,
          checkHistory: checkHistory
        });
        this.showDialog = false;
        this._closeModal()

      },
      _closeModal() {
        this.CLOSE_MODAL_CHECK_HISTORY()
        for (let key in this.getAddCheckHistory) {
          if (this.getAddCheckHistory[key] instanceof Object) {
            for (let inKey in this.getAddCheckHistory[key]) {
              this.getAddCheckHistory[key][inKey] = '';
            }
          }
          else
            this.getAddCheckHistory[key] = '';
        }
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
        this.$store.commit(types.DELETE_UPLOAD_FILE, {index: this.$viewer.index})
      },
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
