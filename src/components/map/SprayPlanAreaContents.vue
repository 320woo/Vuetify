<template>
  <div v-if="getContent">
    <v-container fluid grid-list-xl
                 pt-4
                 py-0
                 px-0
                 ma-0>
      <v-divider></v-divider>
      <v-layout column wrap>
        <v-flex xs12 sm12 md12 py-1>
          <v-layout row wrap align-center justify-center fill-height>
            <v-flex xs12 sm10 pr-0>
              <h3>{{title}}</h3>
            </v-flex>
            <v-flex xs12 sm2 pl-0>
              <v-btn v-if="!isReadonly"
                     flat
                     icon
                     @click="deleteAreaDialog = true">
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap px-2>
            <p>면적</p>
            <v-spacer></v-spacer>
            <p v-html="value"></p>
          </v-layout>
          <v-container
            id="scroll-target"
            style="max-height: 200px; height: 100px;"
            class="scroll-y"
            pa-0
            ma-0>
            <v-layout column wrap justify-start ma-1>
              <v-flex>
                <v-text-field
                  v-model="amount"
                  label="살포량"
                  :readonly="isReadonly"
                  @keyup="amount = amount.replace(/[^0-9.]/g,'')"
                  :append-outer-icon="isReadonly ? '' : 'done'"
                  @click:append-outer="setContent"
                  placeholder="살포량(단위 : ml)">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-layout align-center justify-center fill-height>
            <v-flex xs12>
              <v-textarea
                v-model="comment"
                width="90vh"
                height="23vh"
                no-resize
                outline
                label="설명"
                :readonly="isReadonly"
                :prepend-inner-icon="isReadonly ? '' : 'done'"
                @click:prepend-inner="setContent"
              ></v-textarea>
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
            {{ deleteAreaMessage }}
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
              @click="deleteAreaContent">
              확인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import StringUtil from '@/utils/utils/stringUtil'
  import Constants from '@/components/common/constants'
  import dbAPI from '@/utils/api/dbAPI'

  export default {
    name: 'SprayPlanAreaContents',
    props: {
      sprayPlanId: {
        type: Number
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      deleteAreaDialog: false,
      deleteAreaMessage: '선택된 영역 정보를 삭제하시겠습니까?',
      deleteCommentId: '',
      title: '',
      type: '',
      id: 0,
      value: '0',
      amount: 0,
      comment: '',
      contents: [],
      rules: {
        number: v => (v || '').match(/.*[0-9]$/) || '숫자를 입력하세요.'
      }
    }),
    methods: {
      ...mapMutations([
        'removeSprayPlanArea',
        'setAreaList'
      ]),

      hiddenDialog() {
        this.deleteAreaDialog = false
      },

      deleteAreaContent() {
        if (this.deleteAreaDialog) {
          this.deleteAreaDialog = false
          this.removeSprayPlanArea(this.id)
          this.requestSprayPlanArea()
        }
      },

      getContentTitle(content) {
        if (content !== undefined) {
          let index = this.getSprayPlanAreaList.findIndex((data) => {
            return content.id === data.id
          })

          return '영역#' + index
        }
        return '영역#'
      },

      updateContent(data) {
        console.log('[updateContent] data : ', data)
        this.title = this.getContentTitle(data)
        this.value = data.size + ' m<sup>2</sup>'
        this.amount = data.amount
        this.comment = data.comment
        this.id = data.id
      },

      setContent() {
        let areaList = this.getSprayPlanAreaList
        let index = areaList.findIndex((data) => {
          console.log('[setContent] findIndex  data.id : ' + data.id + ', this.id : ' + this.id)
          return data.id === this.id
        })
        console.log('[setContent] index : ' + index)
        areaList[index].amount = this.amount
        areaList[index].comment = this.comment
        this.setAreaList(areaList)
        this.requestSprayPlanArea()
      },

      async requestSprayPlanArea() {
        let area = this.getSprayPlanAreaList
        console.log('[requestSprayPlanArea] this.sprayPlanId : ' + this.sprayPlanId + ', area : ' + area)

        let sprayPlan = StringUtil.clone(Constants.REQUEST_ANALYSIS_PARAM)
        sprayPlan.spray_area = area.map((data) => {
          let content = StringUtil.clone(Constants.REQUEST_SPRAY_AREA_PARAM)
          content.amount = data.amount
          content.comment = data.comment
          content.size = data.size
          content.area = data.area
          content.base = data.base
          return content
        })
        sprayPlan.altitude = 3  //살포 비행 고도
        sprayPlan.speed = 3 //살포 비행 속도
        sprayPlan.sprayWdith = 5 //살포 가로 반경
        sprayPlan.sprayHeight = 3 //살포 세로 반경 == 살포정보 기록 거리
        
        let result = await dbAPI.query('update.spray_plan.area', {
          'spray_plan_id': this.sprayPlanId,
          'spray_plan_info': sprayPlan
        })

        console.log('[requestSprayPlanArea] result : ', result)
      }
    },
    computed: {
      ...mapGetters([
        'getCurrentSelectedSprayPlanArea',
        'getSprayPlanAreaList'
      ]),

      getContent() {
        let content = this.getCurrentSelectedSprayPlanArea
        if (content) {
          console.log('[getContent] content', content)
          this.updateContent(content)
        }
        return content
      },

      isShowDialog() {
        return this.deleteAreaDialog
      },

      isReadonly() {
        return this.readonly
      }
    }
    // watch: {
    //   getCurrentSelectedArea(val) {
    //     console.log('[getCurrentSelectedArea] val : ', val)
    //     if (val) {
    //       this.updateContent(val)
    //     }
    //   }
    // }
  }
</script>

<style scoped>

</style>
