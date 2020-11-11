<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay>
    <v-card>
      <v-toolbar color="toolbar" dark>
        <v-btn icon dark @click="closePopup()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>영농일지 글쓰기</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :disabled="!valid" dark flat @click="saveDiary()">저장</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- <v-card-title>
          <span class="headline">영농일지 글쓰기</span>
      </v-card-title>-->
      <v-layout row>
        <!--        <v-flex xs6>-->
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-layout column>
                <v-layout row wrap>
                  <v-text-field v-model="cropName" label="작물" readonly disabled/>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="showWorkingDateMenu"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="170ox"
                    min-width="150px"
                  >
                    <template v-slot:activator="{ on }" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
                      <v-text-field
                        label="작업 날짜"
                        prepend-icon="event"
                        readonly
                        :value="convertDate(diaryItem.working_date)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="diaryItem.working_date"
                      is-inline
                      @input="inputWorkingDate()"
                    >
                    </v-date-picker>
                  </v-menu>
                  <v-text-field v-model="diaryItem.sunshine" type="string" :rules="[rules.doubleNumber]"
                                label="일조량(시간)"/>
                  <v-text-field v-model="diaryItem.rainfall" type="string" :rules="[rules.doubleNumber]"
                                label="강수량(mm)"/>
                  <v-text-field v-model="diaryItem.temperature" type="string" :rules="[rules.doubleNumber]"
                                label="기온(℃)"/>
                  <v-btn color="blue darken-1" flat @click="openWeatherPopup()">날씨 정보 가져오기..</v-btn>
                </v-layout>
                <v-layout row wrap>
                  <v-text-field v-model="diaryItem.number_of_persons" type="string"
                                :rules="[rules.max3, rules.integerNumber]" label="전체 작업 인원(명)"/>
                  <v-text-field v-model="diaryItem.number_of_employees" type="string"
                                :rules="[rules.max3, rules.integerNumber]" label="고용 인원(명)"/>
                  <v-text-field v-model="diaryItem.number_of_persons - diaryItem.number_of_employees" label="자가 인원(명)"
                                readonly disabled/>
                </v-layout>
                <v-layout row wrap>
                  <v-flex>작업 내용:</v-flex>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex v-for="(item, i) in farmingTaskEnums" :key="i" px-2>
                        <v-checkbox v-model="diaryItem.farming_tasks" :label="item" :value="item"/>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field v-model="diaryItem.farming_task_other" label="기타 작업"/>
                  </v-flex>
                </v-layout>
                <v-flex xs12>
                  <v-text-field v-model="diaryItem.subject" label="일지 제목" required></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <quill-editor v-model="diaryItem.content" :options="editorOption"></quill-editor>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <!--        </v-flex>-->
        <!--        <v-flex xs6>-->
        <!--          <v-card-text>-->
        <!--            <v-container>-->
        <!--              <div class="ql-editor" v-html="content"></div>-->
        <!--            </v-container>-->
        <!--          </v-card-text>-->
        <!--        </v-flex>-->
      </v-layout>
      <!-- <v-card-actions>
      <v-spacer></v-spacer>-->
      <!-- <v-btn color="blue darken-1" flat @click="closePopup()">취소</v-btn> -->
      <!-- <v-btn color="blue darken-1" flat @click="saveDiary()">저장</v-btn> -->
      <!-- </v-card-actions> -->
      <v-dialog v-model="weatherPopup" max-width="600">
        <past-weather-view :date="diaryItem.working_date" :area_coord="areaCoord()" @onClose="onCloseWeatherPopup"></past-weather-view>
      </v-dialog>
    </v-card>
  </v-dialog>
  <!-- <file-upload></file-upload> -->
  <!-- </v-layout> -->
</template>

<script>
  import FileUpload from '@/components/common/FileUpload'
  import dbAPI from '@/utils/api/dbAPI'
  import storageAPI from '@/utils/api/storageAPI'
  import moment from 'moment-timezone'
  import {quillEditor} from 'vue-quill-editor'
  import Quill from 'quill'
  import {ImageDrop} from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
  import StringUtil from '@/utils/utils/stringUtil'
  import PastWeatherView from '@/components/common/PastWeatherView'

  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)

  export default {
    name: 'DiaryWritingDialog',
    components: {
      FileUpload,
      quillEditor,
      PastWeatherView
    },
    props: {
      areaId: Number,
      cropName: String,
      diary: Object,
      area_boundary: Object
    },
    data: () => ({
      dialog: false,
      diaryItem: {
        diary_id: null,
        subject: '',
        content: '',
        sunshine: null,
        rainfall: null,
        temperature: null,
        number_of_persons: null,
        number_of_employees: null,
        farming_tasks: [],
        farming_task_other: null,
        working_date: new Date()
      },
      valid: true,
      showWorkingDateMenu: false,
      farmingTaskEnums: [
        '종자예조 및 소독',
        '묘상준비 및 설치',
        '파종',
        '접목',
        '가식',
        '묘판관리',
        '경운/정지',
        '퇴비 및 기비살포',
        '정식',
        '지주/네트 세우기',
        '추비살포',
        '병충해방제',
        '제초',
        '비닐 및 흙덮기',
        '적심/적아',
        '물관리',
        '하우스설치 및 관리',
        '온도관리',
        '수확',
        '선별 및 포장',
        '저장',
        '드론 일반촬영',
        '드론 특수촬영'
      ],
      weatherPopup: false,
      rules: {
        required: value => !!value || '필수 입력',
        max3: v => !v || v.length <= 3 || 'Max 3 characters',
        integerNumber: v => !v || /^[0-9]+$/.test(v) || 'integer numbers only',
        doubleNumber: v => !v || /^[0-9]+(\.[0-9]+)?$/.test(v) || 'double numbers only',
      },

      // HTML Editor 요소
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{header: 1}, {header: 2}],
            [{list: 'ordered'}, {list: 'bullet'}],
            [{script: 'sub'}, {script: 'super'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{direction: 'rtl'}],
            [{size: ['small', false, 'large', 'huge']}],
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            [{font: []}],
            [{color: []}, {background: []}],
            [{align: []}],
            ['clean'],
            ['link', 'image', 'video']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        },
        placeholder: '일지 내용을 적습니다'
      }
    }),
    created() {
      console.log('[created] DiaryWritingDialog')
      this.farmingTaskEnums.sort()
      this.dialog = true
      if (this.diary) {
        this.diaryItem = Object.assign({}, this.diary)
      }
    },
    mounted() {
      console.log('[mounted] DiaryWritingDialog')
    },
    watch: {
      diary(newValue) {
        this.diaryItem = Object.assign({}, newValue)
      }
    },
    methods: {
      async saveDiary() {
        console.log('saveDiary() called => area_id: ' + this.areaId)
        console.log(this.diary)

        if (!this.$refs.form.validate()) {
          return
        }

        if (Array.isArray(this.diaryItem.farming_tasks) && this.diaryItem.farming_tasks.length == 0) {
          this.diaryItem.farming_tasks = null
        }

        // 신규 글쓰기
        if (this.diary == null) {
          // Request: POST /api/filemanager/storage/files
          // multipart/form-data
          // params:
          //     req_time=
          //     tag=
          //     comment=
          //     images (파일 첨부)

          this.diaryItem.area_id = this.areaId
          this.diaryItem.task_id = null //this.task_id

          try {
            let result = await dbAPI.query('insert.farm_diary', this.diaryItem)
            console.log('[saveDiary] insert.farm_diary :', result)
            if (result.rowCount == 1) {
              console.log(result.rows)

              console.log(
                'this.getUploadFiles.length: ' + this.getUploadFiles.length
              )
              if (this.getUploadFiles.length > 0) {
                let diary_id = result.rows[0].diary_id

                console.log('call uploadImages()..')
                let storageIds = []
                let payload = {
                  req_time: moment().format(),
                  tag: 'area:' + this.areaId + ', diary:' + diary_id,
                  images: this.getUploadFiles,
                  comment: 'uploaded from web'
                }

                console.log('#payload: ' + JSON.stringify(payload))

                let response = await storageAPI.uploadImages(payload)
                console.log('#result: ' + JSON.stringify(response))
                if (response.message.indexOf('OK') > -1) {
                  response.files.forEach(item => {
                    storageIds.push(item.storage_id)
                  })
                }
              }
            }
          } catch (err) {
            console.log(err)
          }
        } else {
          // 글 업데이트
          try {
            let result = await dbAPI.query('update.farm_diary', this.diaryItem)

            console.log('[updateDiary] update.farm_diary :', result)
            if (result.rowCount >= 1) {
              console.log(result.rows)
            }
          } catch (err) {
            console.log(err)
          }
        }

        this.closePopup()
      },
      inputWorkingDate() {
        this.showWorkingDateMenu = false
      },
      closePopup() {
        this.dialog = false
        this.$emit('close')
      },
      addFile() {
        this.getChild('FileUpload').addPhoto()
      },
      getChild(name) {
        for (let child of this.$children) {
          if (child.$options.name === name) {
            console.log('[getChild] child : ', child)
            return child
          }
        }
      },
      areaCoord() {
        return this.area_boundary.area[0][0]
      },
      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
      },
      handleImageAdded(file) {
        console.log(file)
      },
      openWeatherPopup() {
        let today = new Date()
        let today00 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        console.log(today00)
        if (this.diaryItem.working_date >= today00) {
          // 예보는 아직 미지원
          alert('과거 날씨만 가져올 수 있습니다.')
        }
        else {
          this.weatherPopup = true
          console.log('open weather popup')
        }
      },
      onCloseWeatherPopup(weatherInfo) {
        this.weatherPopup = false
        if (weatherInfo) {
          this.diaryItem.sunshine = weatherInfo.sunshine
          this.diaryItem.rainfall = weatherInfo.rainfall
          this.diaryItem.temperature = weatherInfo.temperature
        }
        console.log('weatherInfo:', weatherInfo)
      }
    },
    computed: {
      getUploadFiles() {
        return this.$store.getters.getUploadFiles
      },
      getFileName() {
        if (this.getUploadFiles.length > 0) {
          let names = this.getUploadFiles.map(file => {
            return file.name
          })
          return names.toString()
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  .map-annotation-button {
    margin-bottom: 5px;
    min-width: 0 !important;
    min-height: 0 !important;
    border-radius: 10px !important;
    border: 1px solid #e1e2e4;
    background: linear-gradient(to top right, #e6edff 0%, #ffffff 100%);
  }

  .menubar__button {
    padding: 0px;
    margin: 0px;
    min-width: 40px !important;
    /* max-width: 70px; */
  }
</style>
