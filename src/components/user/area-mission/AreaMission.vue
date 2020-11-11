<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- <v-container fluid>
    <v-card class="card-header" color="#E6EDFF"> -->
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center
                    justify-center
                    row
                    wrap>
            <v-flex class="card-header-title">
              <v-layout
                align-center
                jusify-center
                wrap>
                <img src="@/assets/prepand_title.png">
                <span class="ml-1">영역별 임무</span>
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
                      <v-data-table
                        :headers="headers"
                        :items="areaList"
                        :expand="expand"
                        item-key="area_id"
                      >
                        <template v-slot:items="props">
                          <tr @click="setSelectedPropsItem(props)">
                            <td class="text-xs-left">{{ props.item.area_name }}</td>
                            <td class="text-xs-left">{{ props.item.lot_address }}</td>
                            <td class="text-xs-left">{{ props.item.area_size }}</td>
                            <td class="text-xs-right">
                              <v-layout align-center justify-end>
                                <v-tooltip bottom>
                                  <v-btn
                                    slot="activator"
                                    style="min-width: 0!important;
                                      border-radius: 10px !important;
                                      border: 1px solid #E1E2E4;
                                      background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);"
                                    small
                                    @click.native.stop="_onClickTimeSeriesButton(props.item.area_id)"
                                  >
                                    <v-icon dark>
                                      av_timer
                                    </v-icon>
                                  </v-btn>
                                  <span>시계열 보기</span>
                                </v-tooltip>
                                <v-icon small flat v-if="ishaveitems(props.item.area_id) && !props.expanded">
                                  expand_more
                                </v-icon>
                                <v-icon small flat v-else-if="ishaveitems(props.item.area_id) && props.expanded">
                                  expand_less
                                </v-icon>
                                <v-icon small flat color="grey" v-else>remove</v-icon>
                              </v-layout>
                            </td>
                          </tr>
                        </template>


                        <template v-slot:expand="props">
                          <transition-group appear name="list">
                            <template v-for="(item, index) in getMissionData(props.item.area_id)">
                              <picture-mission
                                v-if="isPictureMissionMode(item)"
                                :request-mission-type-id="item.request_mission_type_id"
                                :key="'picture' + index"
                                :missioninfo="item"
                                :selectedIndex="curSelectIndex"
                                :itemIndex="index"
                             >
                              </picture-mission>
                              <create-map-mission
                                v-if="isCreateMapMissionMode(item)"
                                :request-mission-type-id="item.request_mission_type_id"
                                :key="'create-map' + index"
                                :missioninfo="item"
                                :selectedIndex="curSelectIndex"
                                :itemIndex="index"
                              >
                              </create-map-mission>
                              <report-mission
                                v-if="isReportMissionMode(item)"
                                :request-mission-type-id="item.request_mission_type_id"
                                :key="'report' + index"
                                :missioninfo="item"
                                :selectedIndex="curSelectIndex"
                                :itemIndex="index"
                              >
                              </report-mission>
                              <plantation-mission
                                v-if="isPlantationMissionMode(item)"
                                :request-mission-type-id="item.request_mission_type_id"
                                :key="'plantation' + index"
                                :missioninfo="item"
                                :selectedIndex="curSelectIndex"
                                :itemIndex="index"
                              >
                              </plantation-mission>
                            </template>
                          </transition-group>
                        </template>

                        <!-- <template v-slot:expand="props">
                          <v-card flat>
                            <v-card-text>
                              <template v-for="(item, index) in getMissionData(props.item.area_id)">
                                <AreaMissionItem
                                  :key="index"
                                  :areaId="item.area_id"
                                  :missionTypeId="item.mission_type_id"
                                  :missionId="item.mission_id"
                                  :title="item.mission_type_category"
                                  :subTitle="item.mission_type_name"
                                  :subTitleName="item.mission_name"
                                  :date="item.mission_dat !== null ? convertDate(item.mission_dat) : ''"
                                  :state="item.state_name"
                                  :mission="item">
                                </AreaMissionItem>
                                <v-divider></v-divider>
                              </template>
                            </v-card-text>
                          </v-card>
                        </template> -->
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-layout>
    <!--        <time-series-dialog v-if="TimeSeriesDialog"-->
    <!--                            :missionData="this.missionDataByArea"-->
    <!--                            @close="_onCloseTimeSeriesDialog()"/>-->
  </v-container>
  <!-- </v-card>
</v-container> -->
</template>

<script>
  import AreaMissionItem from '@/components/user/area-mission/AreaMissionItem'
  import dbAPI from '@/utils/api/dbAPI'
  import StringUtil from '@/utils/utils/stringUtil'
  import RequestMissionDialog from '@/components/user/dialog/RequestMissionDialog'
  // import PictureMission from "@/components/user/area-mission/PictureMission"
  // import CreateMapMission from "@/components/user/area-mission/CreateMapMission"
  // import PlantationMission from "@/components/user/area-mission/PlantationMission"
  // import ReportMission from "@/components/user/area-mission/ReportMission"
  import PictureMission from '@/components/common/mission/PictureMission'
  import CreateMapMission from '@/components/common/mission/CreateMapMission'
  import PlantationMission from '@/components/common/mission/PlantationMission'
  import ReportMission from '@/components/common/mission/ReportMission'

  import Constants from '@/components/common/constants'
  import TimeSeriesDialog from '@/components/provider/dialog/TimeSeriesDialog'
  import { missionListMixin } from '@/components/common/missionListMixin'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'AreaMission',
    mixins: [
      missionListMixin
    ],
    components: {
      // AreaMissionItem
      ReportMission,
      PlantationMission,
      CreateMapMission,
      PictureMission
      // TimeSeriesDialog
    },
    data: () => ({
      expand: false,
      start: this.currentDate,
      headers: [
        { text: '영역명', align: 'left', sortable: false, value: 'area_name' },
        { text: '주소', align: 'left', sortable: false, value: 'lot_address' },
        { text: '면적 (㎡)', align: 'left', sortable: false, value: 'area_size' },
        { text: '동작', align: 'right', sortable: false, value: 'action' }
      ],

      areaList: [],
      missionData: [],

      curSelectIndex: -2,

      open: [1, 2],
      search: null,
      caseSensitive: false,
      bRequestMissionDialog: false,
      interval: '',

      // TimeSeriesDialog: false,
      missionDataByArea: null
    }),

    // created() {
    //   this.getAreaAll()
    // },
    created() {
      // this.requestMissionList()
      this.getAreaAll()
    },
    mounted() {
      // this.interval = setInterval(() => {
      //   this.requestMissionList()
      // }, 5000)
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.curSelectIndex = vm.getPosition
        console.log('################# committed index #3:'+vm.curSelectIndex)
        // this.requestMissionList()
      })
    },


    methods: {
      setSelectedPropsItem(props) {
        console.log('################# setSelectedPropsItem')
        props.expanded = !props.expanded
        this.$store.commit('setPosition', {
          pos: -2
        })
      },
      ishaveitems(key) {
        var result = false
        var items = this.getMissionData(key)
        if (items.length > 0) {
          result = true
        }
        return result
      },

      async requestMissionList() {
        // let result = await dbAPI.query("select.mission_request.exist_mission")
        // console.log(
        //   "[requestMissionList] select.mission_request.exist_mission : ",
        //   result
        // )

        // if (result.rowCount >= 1) {
        //   this.missionData = result.rows
        // }
        this.getAreaAll()
      },
      moveToMissionHistory() {
        this.$router.push({
          name: 'missionHistory4user',
          params: {
            missionId: '0',
            areaId: '0'
          }
        })
      },
      showRequestMissionDialog() {
        this.bRequestMissionDialog = true
        //alert('showRequestMissionDialog() called')
      },
      async getAreaAll() {
        let result = await dbAPI.query('select.area.me')

        console.log('[getMissionRequestAll] select.area.me result :', result)
        if (result.rowCount >= 1) {
          console.log(result.rows)
          this.areaList = result.rows

          let missionDataResult = await dbAPI.query('select.mission.me')
          if (missionDataResult.rowCount >= 1) {
            console.log(missionDataResult.rows)
            this.missionData = missionDataResult.rows
            console.log('[AreaMission::getAreaAll] ', this.missionData)
            //console.log('MISSION DATA: '+JSON.stringify(this.missionData))
            // this.missionData.forEach((item) => {
            //   alert(item.mission_type_name)
            //   console.log(item.request_mission_type_id + ':'+item.mission_type_name)
            // })
          } else {
            //alert('There is no result..')
          }
        }
      },

      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
      },

      convertCalenderDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY-MM-DD')
      },

      getMissionData(key) {
        // console.log("[getMissionData] key : ", key)
        let items = []

        //key = parseInt(key) + 10

        this.missionData.forEach((item) => {
          // console.log('key:'+key+' ==> area_id:'+ item.area_id)
          if (item.area_id === key) {
            items.push(item)
            //console.log(item.request_mission_type_id + ':'+item.mission_type_name)
            // console.log(item.area_id+':'+item.area_name+':'+item.mission_name)
          }
        })
        console.log('[getMissionData] items: ', items)
        return items
      },
      closeRequestMissionDialog() {
        this.bRequestMissionDialog = false
        this.getMissionRequestAll()
      },
      async _onClickTimeSeriesButton(areaId) {
        this.missionDataByArea = await this.getMissionData(areaId)
        console.log(this.missionDataByArea)
        if (this.missionDataByArea.length > 0) {
          const projectId = await this.missionDataByArea[0].project_id
          await this._goProvider2DMapViewByProjectId(projectId)
          // this.TimeSeriesDialog = await true
        }
      },
      _goProvider2DMapViewByProjectId(projectId) {
        this.$router.push({
          name: 'providerTimelineMap',
          params: {
            projectId: projectId
          }
        })
      }
    },

    computed: {
      ...mapGetters([
        'getPosition'
      ]),

      filter() {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      },

      currentDate() {
        return StringUtil.getConvertDateFormat(new Date(), 'YYYY-MM-DD')
      }
    }
  }
</script>

<style scoped>
  .task_title {
    color: #191d5c;
    font-size: large;
    font-weight: bold;
  }

  .task_title_name {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task_header_card {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }


  .list-move {
    transition: transform 1s;
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 1s;
  }

  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

</style>
