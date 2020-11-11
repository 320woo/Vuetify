<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="card-header"
              color="#E6EDFF">
        <v-container fluid>
          <v-layout>
            <v-flex class="card-header-title">
              <v-layout
                align-center
                justify-center
                row
                fill-height
                wrap>
                <img src="@/assets/prepand_title.png">
                <span class="ml-1">요청 목록</span>
                <v-spacer/>
                <v-date-picker
                  v-model="picker"
                  locale="ko-kr"
                  :attributes='dates'
                  :popover="{ placement: 'bottom', visibility: 'click' }"
                  class="mr-5">
                  <v-btn
                    color="blue-grey"
                    class="white--text"
                    ripple>
                    일정확인
                    <v-icon right dark>calendar_today</v-icon>
                  </v-btn>
                </v-date-picker>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-card>
        <v-container fluid>
          <v-layout column wrap>
            <v-flex>
              <v-card-title>
                <v-layout column wrap>
                  <!-- 현재 영역의 해상도 기반으로 동작하는데 여기선 md로 인식됨 12칸중 3칸 차지  xs sm md 등등..-->
                  <v-flex md10 mt-3>
                    <v-expansion-panel popout v-model="expandedMissionIndex">
                      <v-expansion-panel-content
                        v-for="(item, i) in calData"
                        :key="i"
                        :ref="'mission_request_id_' + item.mission_request_id"
                        :style="{
                                    background: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(200, 200, 200, 0.5)), url('${_convertCropsURL(item.crop_id)}')`,
                                    backgroundPosition: 'top left',
                                    backgroundSize: 'initial',
                                  }"
                      >
                        <template v-slot:header>
                          <v-layout
                            justify-center
                            align-content-start
                            column
                            spacer
                          >
                            <v-flex xs4 sm2 md1 ma-1>
                              <v-layout>
                                <v-flex xs6 sm6 md6>
                                  <v-layout row fill-height>
                                    <v-icon small>crop_original</v-icon>
                                    <strong v-html="item.area_name"/>
                                    <v-layout
                                      class="grey--text"
                                      ellipsis
                                    >
                                      &mdash;
                                      {{ item.area_size }} (㎡)
                                    </v-layout>
                                  </v-layout>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                  <v-icon small>calendar_today</v-icon>
                                  <strong v-html="convertDate(item.wish_dat)"/>
                                </v-flex>
                                <v-flex xs3 sm3 md3>
                                  <v-icon small>blur_on</v-icon>
                                  <strong v-html="item.wish_spray_material"/>
                                  <v-spacer v-if="!item.wish_spray_material"/>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                            <v-flex xs4 sm2 md1 ma-1 my-3>
                              <v-tooltip bottom>
                                <v-layout slot="activator">
                                  <v-icon small>comment</v-icon>
                                  <span>{{ item.comment.substring(0, 30) }} {{ item.comment.length > 30 ? '...':'' }} </span>
                                </v-layout>
                                <span>{{ item.comment }}</span>
                              </v-tooltip>
                            </v-flex>
                            <v-flex xs4 sm2 md1 ma-1>
                              <v-layout align-center>
                                <v-flex xs3 sm3 md3>
                                  <v-avatar color="blue" size="32px">
                                    <span class="white--text">{{ item.full_name.charAt(0) }}</span>
                                  </v-avatar>
                                  <strong v-html="item.full_name"/>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                  <v-icon small>telephone</v-icon>
                                  <strong v-html="item.tel_num"/>
                                </v-flex>
                                <v-divider vertical/>
                                <v-flex xs3 sm3 md3>
                                  <v-layout justify-center align-center fill-height row>
                                    <template
                                      v-for="(item_mission2, index2) in getMissionData(item.mission_request_id)">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-img :src="_convertURL(item_mission2.mission_type_category)" v-on="on"
                                                 max-width="20px" max-height="20px" min-width="20px" min-height="20px"/>
                                        </template>
                                        <span>{{ item_mission2.mission_type_category }}({{ item_mission2.mission_type_name }})</span>
                                      </v-tooltip>
                                    </template>
                                  </v-layout>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                          </v-layout>
                        </template>

                        <v-container fluid grid-list-sm>
                          <v-layout row wrap>
                            <v-flex v-for="(item_mission, i) in getMissionData(item.mission_request_id)"
                                    :key="i">
                              <v-hover>
                                <v-card class="mx-auto" width="150px" slot-scope="{ hover }" tile>
                                  <v-layout fill-height align-center>
                                    <v-spacer/>
                                    <v-img :src="_convertURL(item_mission.mission_type_category)"
                                           max-width="40px" max-height="40px" min-width="40px" min-height="40px">
                                    </v-img>
                                    <v-spacer/>
                                    <v-chip
                                      :color="_calBadgeColorByCategory(item_mission.mission_type_category)"
                                      label
                                      text-color="white"
                                    >
                                      <v-layout column>
                                        <strong>{{ item_mission.mission_type_category }}</strong>
                                        <span class="v-chip--List-small">({{ item_mission.mission_type_name }})</span>
                                      </v-layout>
                                    </v-chip>
                                    <v-btn small flat icon color="primary"
                                           @click="onClickAddMissionReport(item_mission.mission_request_id, item_mission.request_mission_type_id)">
                                      <v-icon>check_circle_outline</v-icon>
                                    </v-btn>

                                  </v-layout>
                                </v-card>
                              </v-hover>
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
                </v-layout>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import ScheduleItem from '@/components/provider/schedule/ScheduleItem'
  import dbAPI from '@/utils/api/dbAPI'
  import StringUtil from '@/utils/utils/stringUtil'
  import Constants from '@/components/common/constants'

  export default {
    name: 'Schedule',
    components: {
      ScheduleItem
    },
    data: () => ({
      overlay: false,
      expand: false,
      start: this.currentDate,
      headers: [
        { text: '사용자', align: 'center', sortable: false, value: 'full_name' },
        { text: '지역', align: 'center', sortable: false, value: 'area_name' },
        { text: '희망일', align: 'center', sortable: false, value: 'wish_dat' },
        { text: '면적 (㎡)', align: 'center', sortable: false, value: 'area_size' },
        { text: '전화번호', align: 'center', sortable: false, value: 'tel_num' },
        // {text: '의견', align: 'center', sortable: false, value: 'comment'},
        { text: '살포제', align: 'center', sortable: false, value: 'wish_spray_material' }
      ],

      missionRequestData: [],
      missionData: [],
      expandedMissionIndex: -1,

      dates: [
        {
          key: 'today',
          highlight: true,
          dates: new Date(),
          contentStyle: { color: 'red' },
          popover: { label: 'Today' }
        }
      ],

      curPageNum: 1,
      dataPerPage: 10,
      curSelectIndex: 0,

      picker: new Date().toISOString().substr(0, 10)
    }),

    created() {
      console.log('query mission_reuest_id:', this.$route.query.mission_request_id)
      this.getMissionRequestAll()
    },

    methods: {
      onClickAddMissionReport(missionRequestId, requestMissionTypeId) {
        this.$router.push({
          name: 'addMissionGenerateReport',
          params: {
            'missionRequestId': missionRequestId.toString(),
            'requestMissionTypeId': requestMissionTypeId.toString()
          }
        })
      },

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

      async getMissionRequestAll() {
        let result = await dbAPI.query('select.mission_request.only_request_list')

        console.log('[getMissionRequestAll] select.mission_request.only_request_list result :', result)
        if (result.rowCount >= 1) {
          // console.log(result.rows)
          this.missionRequestData = result.rows
          if (this.$route.query.mission_request_id != null) {
            let missionIndex = this.missionRequestData.findIndex(v => v.mission_request_id == this.$route.query.mission_request_id)
            if (missionIndex >= 0) {
              const page = Math.floor((missionIndex - 1) / this.dataPerPage) + 1
              this.curPageNum = page
              this.expandedMissionIndex = missionIndex % this.dataPerPage
              this.$nextTick(() => {
                console.log('refs: ', this.$refs)
                let target = this.$refs['mission_request_id_' + this.$route.query.mission_request_id]
                if (Array.isArray(target)) {
                  target = target[0]
                }
                this.$vuetify.goTo(target)
              })
            }
          }

          let missionDataResult = await dbAPI.query('select.mission_request.only_request')
          this.missionData = missionDataResult.rows
          console.log('[getMissionRequestAll] ', this.missionData)
        }
        this.setDateItem()
      },

      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
      },

      convertCalenderDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY-MM-DD')
      },

      setDateItem() {

        var index = 0
        this.missionData.forEach((item) => {
          console.log('setDateItem')
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

          //datajs.highlight = true
          datajs.bar = { color: categorycolor }
          //datajs.dot = { color:categorycolor }
          //datajs.bars = true
          var month = StringUtil.getConvertDateFormat(item.wish_dat, 'MM') - 1
          datajs.dates = new Date(StringUtil.getConvertDateFormat(item.wish_dat, 'YYYY'),
            month,
            StringUtil.getConvertDateFormat(item.wish_dat, 'DD'))
          datajs.popover = { label: item.area_name + ' ' + item.mission_type_category }
          console.log('setDateItem : ', datajs)
          this.dates.push(datajs)

          // test code for ui
          // var newdate = new Object()
          // //newdate.bar = datajs.bar
          // newdate.dot = datajs.dot
          // newdate.dates = datajs.dates
          // newdate.popover = { label:item.area_name + " " + item.mission_type_category + "1" }
          // this.dates.push(newdate)

          // var newdate2 = new Object()
          // //newdate2.bar = datajs.bar
          // newdate2.dot = datajs.dot
          // newdate2.dates = datajs.dates
          // newdate2.popover = { label:item.area_name + " " + item.mission_type_category + "1" }
          // this.dates.push(newdate2)

          // var newdate3 = new Object()
          // //newdate3.bar = datajs.bar
          // newdate3.dot = datajs.dot
          // newdate3.dates = datajs.dates
          // newdate3.popover = { label:item.area_name + " " + item.mission_type_category + "1" }
          // this.dates.push(newdate3)

        })
      },

      getMissionData(key) {
        console.log('[getMissionData] key : ', key)
        let items = []

        this.missionData.forEach((item) => {
          if (item.mission_request_id === key) {
            items.push(item)
          }
        })
        return items
      }
    },

    computed: {
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

    },

    watch: {
      curPageNum(val) {
        this.expandedMissionIndex = -1
      }
    }
  }
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    position: absolute;
    width: 100%;
    background-color: rgba(255, 197, 67, 0.5);
  }

  .v-chip--List-small {
    font-size: 10px
  }

</style>


