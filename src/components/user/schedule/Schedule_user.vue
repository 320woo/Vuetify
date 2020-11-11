<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid class="font1">
    <v-layout column wrap class="ml-auto">
      <v-card class="card-header" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center
                    justify-center
                    row
                    wrap>
            <v-flex class="card-header-title">
              <v-layout
                align-center
                justify-start
                wrap>
                <img src="@/assets/prepand_title.png">
                <span class="ml-1">작업 요청 목록</span>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-card>
        <v-container fluid>
          <v-layout row>
            <v-flex>
              <v-card-title>
                <v-layout column>
                  <v-layout row>
                    <!-- 현재 영역의 해상도 기반으로 동작하는데 여기선 md로 인식됨 12칸중 3칸 차지  xs sm md 등등..-->
                    <v-flex>
                      <v-expansion-panel>
                        <v-expansion-panel-content
                          v-for="(item, i) in calData"
                          :key="i"
                          :style="{
                                    background: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(200, 200, 200, 0.5))')`,
                                    backgroundPosition: 'top left',
                                    backgroundSize: 'initial'
                                  }"
                        >
                          <template v-slot:header>
                            <v-layout
                              style="border: 1px solid darkgrey;"
                              justify-center
                              align-content-start
                              column
                              spacer
                            >
                              <v-flex xs4 sm2 md1>
                                <v-layout style="background-color:#EEEEEE">
                                  <v-flex pa-3
                                          ellipsis>
                                    <div style="margin-top: 10px">
                                      <v-icon small>crop_original</v-icon>
                                      관리영역:&nbsp;<strong v-html="item.area_name"/>
                                      {{ item.area_size }}&mdash;&nbsp;(㎡)
                                    </div>
                                  </v-flex>
                                  <v-spacer/>
                                  <v-flex pa-3 style="margin-left: 580px">
                                    <v-spacer/>
                                    희망 작업일 :
                                    <strong v-html="convertDate(item.wish_dat)"/>
                                    <v-btn small color="primary" dark
                                           @click.native.stop="showRequestMissionDialog(item)">
                                      <v-icon>create</v-icon>&nbsp;수정
                                    </v-btn>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-divider></v-divider>
                              <v-flex xs4 sm2 md1>
                                <v-layout align-center>
                                  <v-flex pa-3 slot="activator">
                                    • 공급자 :
                                    <v-avatar color="blue" size="32px">
                                      <span class="white--text">{{ item.company_name.charAt(0) }}</span>
                                    </v-avatar>
                                    <strong v-html="item.company_name" style="margin-right: 120px"/>
                                    • 작물 : <strong style="color:#42A5F5;" v-html="item.crop_name"/>(<strong
                                    style="color:#42A5F5;" v-html="item.variety"/>)<strong
                                    style="margin-right: 120px"></strong>
                                    • 병종 : <strong style="color:#42A5F5; margin-right: 120px;"
                                                   v-html="item.blight_name"/>
                                    • 희망 살포제 :
                                    <v-icon small>blur_on</v-icon>
                                    <strong v-html="item.wish_spray_material" style="color:#42A5F5;"/>
                                    <v-spacer v-if="!item.wish_spray_material"/>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                              <v-divider style="margin-bottom: 5px"></v-divider>
                              <v-flex pa-3>
                                <div>• 요청사항 :</div>
                                <span>&nbsp;&nbsp;{{
                                    item.comment.substring(0, 30)
                                  }} {{ item.comment.length > 28 ? '...' : '' }} </span>
                              </v-flex>
                              <v-divider style="margin-top: 5px; margin-bottom: 5px"></v-divider>
                              <v-flex pa-3 xs4 sm2 md1>
                                <v-layout align-center>
                                  <v-layout fill-height row>
                                    <template
                                      v-for="(item_mission2, index2) in getMissionData(item.mission_request_id)">
                                      <v-tooltip>
                                        <template v-slot:activator="{ on }">
                                          <v-img :src="_convertURL(item_mission2.mission_type_category)" v-on="on"
                                                 max-width="20px" max-height="20px" min-width="20px" min-height="20px"/>
                                          <div style="margin-right:10px ">{{
                                              item_mission2.mission_type_category
                                            }}({{ item_mission2.mission_type_name }}) : 요청중</div>
                                        </template>
                                      </v-tooltip>
                                    </template>
                                  </v-layout>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </template>
                          <v-container fluid grid-list-sm>
                            <v-layout row wrap>
                              <v-flex v-for="(item_mission, i) in getMissionData(item.mission_request_id)"
                                      :key="i">
                                <v-card class="mx-auto" width="170px">
                                  <v-layout fill-height align-center>
                                    <v-img :src="_convertURL(item_mission.mission_type_category)" max-width="40px"
                                           max-height="40px" min-width="40px" min-height="40px">
                                    </v-img>
                                    <v-layout column fill-height align-center>
                                      <v-chip
                                        :color="_calBadgeColorByCategory(item_mission.mission_type_category)"
                                        small
                                        label
                                        text-color="white"
                                      >
                                        <strong>{{ item_mission.mission_type_category }}</strong>&nbsp;
                                        <span>({{ item_mission.mission_type_name }})</span>
                                      </v-chip>
                                      <template v-if="item_mission.mission_id">
                                        <span>{{ item.mission_dat !== null ? convertDate(item.mission_dat) : '' }} {{
                                            item_mission.state_name
                                          }}</span>
                                        <v-btn round color="primary" dark
                                               @click="onClickEditMissionReport(item_mission.mission_request_id, item_mission.request_mission_type_id, item_mission.mission_id)">
                                          상세보기
                                        </v-btn>
                                      </template>
                                      <template v-else>
                                        <span>요청중</span>
                                      </template>
                                    </v-layout>
                                  </v-layout>
                                </v-card>
                              </v-flex>
                            </v-layout>
                          </v-container>

                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-layout align-center justify-center mt-2>
                        <v-pagination
                          v-model="curPageNum"
                          :length="numOfPages">
                        </v-pagination>
                      </v-layout>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex>
                      <v-calendar
                        locale="ko-kr"
                        :rows='2'
                        :attributes='dates'
                      >
                      </v-calendar>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-layout>
    <v-layout class="new-request-button">
      <v-tooltip top>
        <v-btn fab
               dark
               color="indigo"
               slot="activator"
               @click="showRequestMissionDialog(null)">
          <v-icon dark>
            add
          </v-icon>
        </v-btn>
        <span>새 요청하기</span>
      </v-tooltip>
    </v-layout>
    <request-mission-dialog v-if="bRequestMissionDialog" :mission_request="selected_mission_request"
                            @close="closeRequestMissionDialog()"/>
  </v-container>
</template>

<script>
import ScheduleItem from '@/components/user/schedule/ScheduleItem_user'
import dbAPI from '@/utils/api/dbAPI'
import StringUtil from '@/utils/utils/stringUtil'
import RequestMissionDialog from '@/components/user/dialog/RequestMissionDialog'
import Constants from '@/components/common/constants'

export default {
  name: 'Schedule_user',
  components: {
    ScheduleItem,
    RequestMissionDialog
  },
  data: () => ({
    expand: false,
    start: this.currentDate,
    headers: [
      // {text: '사용자', align: 'center', sortable: false, value: 'full_name'},
      {text: '지역', align: 'center', sortable: false, value: 'area_name'},
      {text: '공급자', align: 'center', sortable: false, value: 'company_name'},
      {text: '희망일', align: 'center', sortable: false, value: 'wish_dat'},
      {text: '면적 (㎡)', align: 'center', sortable: false, value: 'area_size'},
      // {text: '전화번호', align: 'center', sortable: false, value: 'tel_num'},
      // {text: '의견', align: 'center', sortable: false, value: 'comment'},
      {text: '살포제', align: 'center', sortable: false, value: 'wish_spray_material'},
      {text: '상태', align: 'center', sortable: false, value: 'mr_state_name'}
    ],

    missionRequestData: [],
    missionData: [],

    open: [1, 2],
    search: null,
    caseSensitive: false,
    bRequestMissionDialog: false,

    selected_mission_request: null,

    dates: [
      {
        key: 'today',
        highlight: true,
        dates: new Date(),
        contentStyle: {color: 'red'},
        popover: {label: 'Today'}
      }
    ],

    curPageNum: 1,
    dataPerPage: 10,
    curSelectIndex: 0
  }),

  created() {
    this.getMissionRequestAll()
  },

  methods: {
    _convertURL(mission_type_category) {
      // console.log("CHK => mission_type_category", mission_type_category)
      switch (mission_type_category) {
        case Constants.MISSION_CATEGORY_ANALYSIS:
          return require('@/assets/AGDrone-Report.svg')
        case Constants.MISSION_CATEGORY_MANURE:
          return require('@/assets/AGDrone-Manure.png')
        case Constants.MISSION_CATEGORY_SOWING:
          return require('@/assets/AGDrone-Manure.png')
        case Constants.MISSION_CATEGORY_PHOTO:
          return require('@/assets/AGDrone-Picture.svg')
        case Constants.MISSION_CATEGORY_MAP:
          return require('@/assets/AGDrone-CreateMap.svg')
        case Constants.MISSION_CATEGORY_PESTICIDE:
          return require('@/assets/AGDrone-Pesticide.png')
      }
      return require('@/assets/AGDrone-Picture.svg')
    },

    _convertCropsURL(crops_id) {
      switch (crops_id) {
        case 3:
        case 7:
          return require('@/assets/rice.jpg')
        case 2:
          return require('@/assets/bean.jpg')
        case 1:
        case 6:
          return require('@/assets/cabbage.jpg')
      }
    },

    _calBadgeColorByCategory(category) {
      switch (category) {
        case Constants.MISSION_CATEGORY_ANALYSIS:
          return '#4479cb'
        case Constants.MISSION_CATEGORY_MANURE:
          return '#FF8F93'
        case Constants.MISSION_CATEGORY_SOWING:
          return '#81CAAF'
        case Constants.MISSION_CATEGORY_PHOTO:
          return '#FC4B8F'
        case Constants.MISSION_CATEGORY_MAP:
          return '#EDAF20'
        case Constants.MISSION_CATEGORY_PESTICIDE:
          return '#9c1fed'
      }
    },

    onClickEditMissionReport(missionRequestId, requestMissionTypeId, missionId) {
      console.log('[onClickEditMissionReport] this.requestMissionTypeId : ' + requestMissionTypeId)
      this.$router.push({
        name: 'editMissionGenerateReport4user',
        params: {
          'missionRequestId': missionRequestId.toString(),
          'requestMissionTypeId': requestMissionTypeId.toString(),
          'missionId': missionId.toString()
        }
      })
    },

    showRequestMissionDialog(mission_request) {
      this.bRequestMissionDialog = true
      this.selected_mission_request = mission_request
      this.selected_mission_request['missions'] = this.getMissionData(mission_request.mission_request_id)
    },
    async getMissionRequestAll() {
      let result = await dbAPI.query('select.mission_request.mylist')

      console.log('[getMissionRequestAll] select.mission_request.mylist result :', result)
      if (result.rowCount >= 1) {
        console.log(result.rows)
        this.missionRequestData = result.rows

        let missionDataResult = await dbAPI.query('select.mission_request.myall')
        if (missionDataResult.rowCount >= 1) {
          this.missionData = missionDataResult.rows

          this.missionData.forEach((item) => {
            //alert(item.mission_type_name)
            // console.log(item.request_mission_type_id + ':'+item.mission_type_name+ "  " + item.full_name)
          })
        } else {
          //alert('There is no result..')
        }
      }
      this.setDateItem()
    },

    setDateItem() {
      var index = 0
      this.missionData.forEach((item) => {
        // console.log("setDateItem - original item : ", item)
        var datajs = new Object()
        index++
        datajs.key = item.mission_type_category + index

        var categorycolor = 'red'
        switch (item.mission_type_category) {
          case Constants.MISSION_CATEGORY_ANALYSIS:
            categorycolor = 'blue'
            break
          case Constants.MISSION_CATEGORY_MANURE:
            categorycolor = 'pink'
            break
          case Constants.MISSION_CATEGORY_SOWING:
            categorycolor = 'green'
            break
          case Constants.MISSION_CATEGORY_PHOTO:
            categorycolor = 'red'
            break
          case Constants.MISSION_CATEGORY_MAP:
            categorycolor = 'yellow'
            break
          case Constants.MISSION_CATEGORY_PESTICIDE:
            categorycolor = 'purple'
            break
        }

        var targetcomp = ''
        this.missionRequestData.forEach((mrd_item) => {
          if (mrd_item.mission_request_id == item.mission_request_id) {
            targetcomp = mrd_item.company_name
          }
        })

        //datajs.highlight = true
        datajs.bar = {color: categorycolor}
        //datajs.dot = { color:categorycolor }
        //datajs.bars = true
        var month = StringUtil.getConvertDateFormat(item.wish_dat, 'MM') - 1
        datajs.dates = new Date(StringUtil.getConvertDateFormat(item.wish_dat, 'YYYY'),
          month,
          StringUtil.getConvertDateFormat(item.wish_dat, 'DD'))
        var stateStr = item.state_name
        if (item.state_name == null)
          stateStr = ''
        datajs.popover = {label: item.area_name + ' ' + targetcomp + ' ' + item.mission_type_category + ' ' + stateStr}
        // console.log("setDateItem : ", datajs)
        this.dates.push(datajs)
      })
      // console.log("setDateItem : ",this.dates)
    },

    convertDate(date) {
      return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
    },

    convertCalenderDate(date) {
      return StringUtil.getConvertDateFormat(date, 'YYYY-MM-DD')
    },

    getMissionData(key) {
      console.log('[getMissionData] key : ', key)
      let items = []

      //key = parseInt(key) + 10

      this.missionData.forEach((item) => {
        // console.log('key:'+key+' ==> mr_id:'+ item.mission_request_id)
        if (item.mission_request_id === key) {
          items.push(item)
          //console.log(item.request_mission_type_id + ':'+item.mission_type_name)
          console.log(item.mission_request_id + ':' + item.mission_id + ':' + item.request_mission_type_id + ':' + item.mission_type_name)
        }
      })
      console.log('[getMissionData] item : ', items)
      return items
    },
    closeRequestMissionDialog() {
      this.bRequestMissionDialog = false
      this.getMissionRequestAll()
    }

  },

  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },

    currentDate() {
      return StringUtil.getConvertDateFormat(new Date(), 'YYYY-MM-DD')
    },

    startOffset() {
      return ((this.curPageNum - 1) * this.dataPerPage)
    },
    endOffset() {
      return (this.startOffset + this.dataPerPage)
    },
    numOfPages() {
      return Math.ceil(this.missionRequestData.length / this.dataPerPage)
    },
    calData() {
      return this.missionRequestData.slice(this.startOffset, this.endOffset)
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
  background-color: rgba(255, 197, 67, 0.5);
}

.new-request-button {
  position: fixed;
  bottom: 30px;
  right: 40px;
}

.font1 {
  font-family: 'GmarketSansMedium';
}

</style>


