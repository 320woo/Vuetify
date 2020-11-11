<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center justify-center row wrap>
            <v-flex class="task_title">
              <v-layout row align-center jusify-center>
                <img src="@/assets/prepand_title.png"/>
                <v-flex class="ml-1 task_title_name">작업 목록</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm4>
              <!-- <v-card-text>
                고객 이름
              </v-card-text> -->
              <v-overflow-btn
                v-model="customer"
                :items="customerList"
                @change="area = '';curPageNum=1"
                label="고객 이름"
                editable
                item-value="text"
                hint="고객 이름"
                persistent-hint
              />
            </v-flex>
            <v-flex xs12 sm4 offset-xs1>
              <!-- <v-card-text>
                지역 이름
              </v-card-text> -->
              <v-overflow-btn
                v-model="area"
                :items="filterAreaList(customer)"
                @change="curPageNum=1"
                label="지역 이름"
                editable
                item-value="text"
                hint="지역 이름"
                persistent-hint
              />
            </v-flex>
            <v-layout justify-end align-center>
              <v-btn
                class="task-card-menu-button"
                color="taskButton"
                dark
                ripple
                small
                @click="_onClickTimeSeriesButton()"
              >
                <v-icon dark>av_timer</v-icon>
                시계열 보기
              </v-btn>
            </v-layout>
          </v-layout>
        </v-container>
      </v-card>
      <transition-group appear name="list">
        <template v-for="(item, index) in calData">
          <!-- <template v-for="(item) in filterList(customer, area)"> -->
          <picture-mission
            v-if="isPictureMissionMode(item)"
            :request-mission-type-id="item.request_mission_type_id"
            :missioninfo="item"
            :key="'picture' + item.request_mission_type_id"
            :selectedIndex="curSelectIndex"
            :itemIndex="index"
            @on-refresh="requestMissionList()"
          >
          </picture-mission>
          <create-map-mission
            v-if="isCreateMapMissionMode(item)"
            :request-mission-type-id="item.request_mission_type_id"
            :missioninfo="item"
            :key="'create-map' + item.request_mission_type_id"
            :selectedIndex="curSelectIndex"
            :itemIndex="index"
            @on-refresh="requestMissionList()"
          >
          </create-map-mission>
          <report-mission
            v-if="isReportMissionMode(item)"
            :request-mission-type-id="item.request_mission_type_id"
            :missioninfo="item"
            :key="'report' + item.request_mission_type_id"
            :selectedIndex="curSelectIndex"
            :itemIndex="index"
            @on-refresh="requestMissionList()"
          >
          </report-mission>
          <plantation-mission
            v-if="isPlantationMissionMode(item)"
            :request-mission-type-id="item.request_mission_type_id"
            :missioninfo="item"
            :key="'plantation' + item.request_mission_type_id"
            :selectedIndex="curSelectIndex"
            :itemIndex="index"
            @on-refresh="requestMissionList()"
          >
          </plantation-mission>
        </template>
      </transition-group>
      <v-divider/>
      <v-layout align-center justify-center>
        <v-pagination
          v-model="curPageNum"
          :length="numOfPages"
          @input="_onInputPagination()"
        >
        </v-pagination>
      </v-layout>

    </v-layout>
    <time-series-dialog v-if="TimeSeriesDialog"
                        :missionData="this.missionData"
                        @close="_onCloseTimeSeriesDialog()"/>
  </v-container>
</template>

<script>
  import dbAPI from '@/utils/api/dbAPI'
  import PictureMission from '@/components/common/mission/PictureMission'
  import CreateMapMission from '@/components/common/mission/CreateMapMission'
  import PlantationMission from '@/components/common/mission/PlantationMission'
  import ReportMission from '@/components/common/mission/ReportMission'
  import Constants from '@/components/common/constants'
  import MPMqttClient from '@/utils/utils/mqttUtil'
  import { missionListMixin } from '@/components/common/missionListMixin'
  import { mapGetters, mapMutations } from 'vuex'
  import StringUtils from '@/utils/utils/stringUtil'
  import TimeSeriesDialog from '@/components/provider/dialog/TimeSeriesDialog'

  export default {
    name: 'MissionList',
    scrollToTop: false,
    mixins: [
      missionListMixin
    ],
    components: {
      ReportMission,
      PlantationMission,
      CreateMapMission,
      PictureMission,
      TimeSeriesDialog
    },
    data: () => ({
      TimeSeriesDialog: false,
      // Dropdown box
      customer: 'All',
      customerList: [],
      area: 'All',
      areaList: [],

      // Mqtt
      mqttClient: null,

      // mission
      missionData: [],
      interval: '',

      // Keep filter component
      keepFilterComponent: [
        'provider2DMap',
        'analysisMap',
        'providerTimelineMap',
        'analysisDiary',
        'sprayPlanMap'
      ],

      curPageNum: 1,
      dataPerPage: 10,
      curSelectIndex: -2,
      searchUserName: 'All',
      searchAreaName: 'All',
    }),

    created() {
      console.log('[MissionList] curPageNum: '+this.curPageNum)
      console.log('[MissionList] curSelectIndex: '+this.curSelectIndex)

      this.requestMissionList()
      // this.initMqtt()
    },

    // 필터 내용 유지하기 위해 이전 필터 값 가져와서 저장
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.curPageNum = vm.getCurPageNum
        vm.curSelectIndex = vm.getPosition
        console.log('################# committed page:'+vm.curPageNum)
        console.log('################# committed index #3:'+vm.curSelectIndex)
        // this.requestMissionList()

        let isKeepFilter = vm.keepFilterComponent.some((data) => {
          if (data && from.name)
            return StringUtils.isIgnoreCaseEqual(data, from.name)
        })
        if (isKeepFilter) {
          vm.customer = vm.getMissionCustomerFilter
          vm.area = vm.getMissionAreaFilter
        }

        vm.setMissionCustomerFilter('')
        vm.setMissionAreaFilter('')
      })
    },

    // 필터 내용을 유지하기 위해 필터값 vuex에 값 저장
    beforeRouteLeave(to, from, next) {
      console.log('################# page: '+this.curPageNum)
      this.$store.commit('setPageNum', {
        page: this.curPageNum
      })
      console.log('############# stored page: '+this.$store.getters.getCurPageNum)

      let isKeepFilter = this.keepFilterComponent.some((data) => {
        return StringUtils.isIgnoreCaseEqual(data, to.name)
      })

      if (isKeepFilter) {
        this.setMissionCustomerFilter(this.customer)
        this.setMissionAreaFilter(this.area)
      }

      next()
    },

    destroyed() {
      // this.mqttClient.delete()
      // window.removeEventListener('scroll', this.handleScroll)
    },
    mounted() {
      // this.interval = setInterval(() => {
      //   this.requestMissionList()
      // }, 5000)
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    // activated() {
    //   const pos = this.$store.state.getters.getScrollY
    //   // const name = this.$route.name
    //   console.log('$$$$$$$$$$$$$$$$ activated pos:'+pos)
    //   window.scrollTo(0, pos)
    //   this.curPageNum = this.$store.state.getters.getCurPageNum
    //   console.log('$$$$$$$$$$$$$$$$ activated page:'+this.curPageNum)
    // },

    methods: {
      ...mapMutations([
        'setMissionCustomerFilter',
        'setMissionAreaFilter'
      ]),

      initMqtt() {
        this.mqttClient = new MPMqttClient()
        this.mqttClient.setTopic(Constants.TOPIC_TASK_STATUS)
        this.mqttClient.setMessageCallback(this.onMqttMessage)
      },

      // handleScroll (event) {
      //   this.scrollY = window.scrollY.toFixed(0) //(window.scrollY > 0)
      //   // console.log('$$$ calling handleScroll Y: ', this.scrollY)
      // },

      async requestMissionList() {
        let result = []
        let userId = this.$route.params.user_id
        console.log('[requestMissionList] userId : ' + userId)

        if (userId === undefined) {
          result = await dbAPI.query('select.mission_request.exist_mission_extra')
          console.log('[requestMissionList] select.mission_request.exist_mission_extra : ', result)
        } else {
          result = await dbAPI.query('select.mission_request.exist_mission_extra.user',
            { user_id: userId })
          console.log('[requestMissionList] select.mission_request.exist_mission_extra.user : ', result)
        }

        if (result.rowCount >= 1) {
          this.missionData = result.rows

          if (userId !== undefined) {
            this.missionData = this.missionData.filter((data) => {
              return parseInt(data.user_id) === parseInt(userId)
            })
          }

          this.customerList = this.missionData.map((data) => {
            return data.full_name
          })

          if (userId !== undefined && this.customerList.length > 0) {
            this.customer = this.customerList[0]
          }

          this.customerList = this.customerList.filter((data, index, array) => {
            return array.indexOf(data) === index
          })

          this.customerList.forEach((userName) => {
            this.areaList[userName] = this.missionData.map((data) => {
              if (userName !== undefined && userName === data.full_name) {
                return data.area_name
              }
            }).filter((data, index, array) => {
              if (data === undefined) return false
              return array.indexOf(data) === index
            })
            this.areaList[userName].splice(0, 0, 'All')
          })

          if (userId === undefined) this.customerList.splice(0, 0, 'All')
          this.areaList['All'] = this.missionData.map((data) => {
            return data.area_name
          }).filter((data, index, array) => {
            return array.indexOf(data) === index
          })
          this.areaList['All'].splice(0, 0, 'All')

          console.log('[requestMissionList] customerList : ', this.customerList)
          console.log('[requestMissionList] areaList : ', this.areaList)
        }
      },

      moveToMissionHistory() {
        this.$router.push({
          name: 'missionHistory',
          params: {
            missionId: '0',
            areaId: '0'
          }
        })
      },
      onMqttMessage(topic, message) {
        let stringMsg = new TextDecoder('utf-8').decode(message)
        console.log('[onMqttMessage] topic:', topic, 'message:', JSON.stringify(stringMsg))
        if (MPMqttClient.matchTopic(topic, Constants.TOPIC_TASK_STATUS)) {
          // let regTopic = MPMqttClient.regexTopic(Constants.TOPIC_TASK_STATUS)
          let regUUID = '([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}'
          let regData = topic.match(regUUID)
          console.log('[onMqttMessage] topic: ' + topic)
          console.log('[onMqttMessage] regUUID: ' + regUUID)
          console.log('[onMqttMessage] regData: ' + regData)
          if (regData !== null) {
            let taskId = regData[1]
            console.log('[onMqttMessage] taskId : ' + taskId)
            this.taskStatus(taskId, message)
          }
        } else {
          console.log('[onMqttMessage] there is no match topic: ' + Constants.TOPIC_TASK_STATUS)
        }
      },
      taskStatus(taskId, status) {
        console.log('[taskStatus] taskId : ' + taskId + ', status' + status)
        let jsonStatus = JSON.parse(status)
        let statusName = ''
        switch (jsonStatus.jobstatus) {
          case Constants.ENUM_TASK_STATUS.QUEUED.value:
            statusName = Constants.ENUM_TASK_STATUS.QUEUED.name
            break
          case Constants.ENUM_TASK_STATUS.RUNNING.value:
            statusName = Constants.ENUM_TASK_STATUS.RUNNING.name
            break
          case Constants.ENUM_TASK_STATUS.FAILED.value:
            statusName = Constants.ENUM_TASK_STATUS.FAILED.name
            break
          case Constants.ENUM_TASK_STATUS.COMPLETED.value:
            statusName = Constants.ENUM_TASK_STATUS.COMPLETED.name
            break
          case Constants.ENUM_TASK_STATUS.CANCELED.value:
            statusName = Constants.ENUM_TASK_STATUS.CANCELED.name
            break
          default:
            break
        }
        console.log('[taskStatus] stats name : ' + statusName)

        this.updateMissionState(taskId, jsonStatus.jobstatus)
      },
      async updateMissionState(_task_id, status) {
        //임무상태 (0:요청/1:준비중/2:진행중/3:완료/4:취소)
        let _state = -1
        switch (status) {
          case Constants.ENUM_TASK_STATUS.QUEUED.value:
          case Constants.ENUM_TASK_STATUS.RUNNING.value:
          case Constants.ENUM_TASK_STATUS.FAILED.value:
          case Constants.ENUM_TASK_STATUS.CANCELED.value:
            _state = 2
            break
          case Constants.ENUM_TASK_STATUS.COMPLETED.value:
            _state = 3
            break
          default:
            break
        }

        let _mission_id = -1
        for (let i in this.missionData) {
          if (_task_id == this.missionData[i].task_id) {
            _mission_id = this.missionData[i].mission_id
            break
          }
        }

        if (_mission_id != -1 && _state != -1) {
          try {
            let info = {
              mission_id: _mission_id,
              state: _state
            }
            let result = await dbAPI.query('update.mission.state', info)
            if (result.rowCount >= 1) {
              console.log('[update.mission.state]', result.rows)
              // alert('성공입니다')
            }
          } catch (err) {
            console.log('[update.mission.state]', err)
            // alert('실패입니다')
            // 실패하면 task id를 삭제 하십시오...
          }
        } else {
          console.log('[ERR] mission_id: ' + _mission_id + ', state: ' + _state)
        }

      },
      filterList(searchUserName, searchAreaName, bOnlyPageCal = false) {
        let missionData = this.getMissionData
        let userName = searchUserName === 'All' ? '' : searchUserName
        let areaName = searchAreaName === 'All' ? '' : searchAreaName

        if (bOnlyPageCal == false) {
          this.searchUserName = userName
          this.searchAreaName = areaName
        }

        if (missionData) {
          missionData = this.getMissionData.filter(data => {
            if (userName === '' && areaName === '') {
              return true
            } else if (userName !== '' && areaName !== '') {
              return data.full_name.includes(userName) && data.area_name.includes(areaName)
            } else {
              return (userName !== '' && data.full_name.includes(userName)) ||
                (areaName !== '' && data.area_name.includes(areaName))
            }
          })
        }
        return missionData
      },
      filterAreaList(searchUserName) {
        if (searchUserName === '') {
          return this.areaList['All']
        }
        return this.areaList[searchUserName]
      },
      _onClickTimeSeriesButton() {
        console.log(this.TimeSeriesDialog)
        this.TimeSeriesDialog = true
      },
      _onCloseTimeSeriesDialog() {
        console.log('_onCloseTimeSeriesDialog')
        this.TimeSeriesDialog = false
      },
      _onInputPagination() {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$ _onInputPagination init pos')
        if (window.scrollTo) window.scrollTo(0, 0)
        this.$store.commit('setPosition', {
          pos: -2
        })
      }
    },
    computed: {
      ...mapGetters([
        'getMissionCustomerFilter',
        'getMissionAreaFilter',
        'getCurPageNum',
        'getPosition'
      ]),

      getMissionData() {
        return this.missionData
      },

      startOffset() {
        return ((this.curPageNum - 1) * this.dataPerPage)
      },
      endOffset() {
        return (this.startOffset + this.dataPerPage)
      },
      numOfPages() {
        var missionData = this.filterList(this.customer, this.area)
        return Math.ceil(missionData.length / this.dataPerPage)
      },
      calData() {
        var missionData = this.filterList(this.customer, this.area)
        console.log('calData : length ', missionData.length)
        return missionData.slice(this.startOffset, this.endOffset)
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
