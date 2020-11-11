<template>
  <v-container>
    <v-layout column>
      <v-card class="card-header"
              color="#E6EDFF">
        <v-container>
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
                <span v-if="isAddMode" class="ml-1">임무 등록</span>
                <span v-else class="ml-1">임무 수정</span>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-card>
        <v-container>
          <v-layout column>
            <v-text-field
              v-model="missionName"
              label="임무명"
            ></v-text-field>
            <v-text-field
              v-model="lotAddress"
              label="대상 영역 주소"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="userName"
              label="사용자명"
              readonly
            ></v-text-field>
            <v-layout>
              <v-layout column pr-3>
                <v-text-field
                  v-model="managerName"
                  label="담당자"
                  readonly
                ></v-text-field>
                <v-menu
                  ref="wishDateMenu"
                  :close-on-content-click="false"
                  v-model="wishDateMenu"
                  :nudge-right="40"
                  :return-value.sync="wishDate"
                  lazy
                  transition="scale-transition"
                  offset-y
                  max-width="170ox"
                  min-width="150px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="wishDate"
                    label="희망 작업 날짜"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="wishDateCal"
                    locale="ko-kr"
                    is-inline
                    :attributes='dates'
                    :min-date="new Date()"
                    @input="formatDate(wishDateCal)"
                  >
                  </v-date-picker>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="wishDateMenu = false">취소</v-btn>
                  <v-btn flat color="primary" @click="$refs.wishDateMenu.save(wishDate)">확인</v-btn>
                </v-menu>
                <v-text-field
                  v-model="area"
                  label="면적"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="crop"
                  label="작물명"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="wishSprayMaterial"
                  label="희망 살포제"
                  readonly
                ></v-text-field>
                <v-select
                  :items="missionStatusList"
                  label="진행 상태"
                  v-model="missionStatus"
                  return-object
                  :disabled="!!isAddMode"
                ></v-select>
              </v-layout>
              <v-layout column>
                <v-card-text>작업지역</v-card-text>
                <BaseMap></BaseMap>
                <v-layout column pt-3>
                  <v-textarea
                    v-model="comment"
                    label="기타 요청사항"
                  ></v-textarea>
                </v-layout>
              </v-layout>
            </v-layout>
          </v-layout>
          <v-card-actions style="padding-left: 0!important;">
            <v-btn flat color="orange" @click="close()">닫기</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import dbAPI from '@/utils/api/dbAPI'
  import Constants from '@/components/common/constants'
  import StringUtils from '@/utils/utils/stringUtil'
  import BaseMap from '@/components/map/BaseMap'
  import AreaUtil from '@/utils/utils/areaUtil'

  export default {
    name: 'Mission',
    data: () => ({
      missionName: '',
      lotAddress: '',
      userName: '',
      missionType: '',
      missionTypeName: '',
      managerName: '',
      missionLocation: '',
      wishDateMenu: false,
      wishDate: new Date().toISOString().substr(0, 10),
      missionStatusList: ['준비중', '진행중', '완료', '취소'],
      area: '',
      missionStatus: '',
      _project_id: '',
      crop: '',
      sprayMeterial: '',
      wishSprayMaterial: '',
      requestMissionTypeId: '',
      missionId: '',
      comment: '',

      dates: [],
      wishDateCal: new Date()
    }),
    created() {
      console.log('[created] this.$route.params.requestMissionTypeId : ' + this.$route.params.requestMissionTypeId)
      this.requestMissionTypeId = this.$route.params.requestMissionTypeId
      this.missionId = this.$route.params.missionId
      this.presetMissionData()

      this.getMissionRequestAll()
    },
    computed: {
      ...mapGetters([
        'getCreateMission'
      ]),
      isAddMode() {
        return this.$route.params.missionId === undefined
      }
    },
    methods: {
      ...mapActions([
        'requestCreateMission',
        'openGlobalModal',
        //'requestGetProject',
        'requestCreateTask'
        //'requestPatchTask',
        //'requestDeleteTask'
      ]),

      ...mapMutations([
        'setAreaList'
      ]),

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

      formatDate(date) {
        if (!date) return null
        // console.log("[formatDate] ", date)
        var year = StringUtils.getConvertDateFormat(date, 'YYYY')
        var month = StringUtils.getConvertDateFormat(date, 'MM')
        var day = StringUtils.getConvertDateFormat(date, 'DD')
        // console.log(`${year}-${month}-${day}`)
        this.wishDate = `${year}-${month}-${day}`
        return `${year}-${month}-${day}`
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
          datajs.bar = { color: categorycolor }
          //datajs.dot = { color:categorycolor }
          //datajs.bars = true
          var month = StringUtils.getConvertDateFormat(item.wish_dat, 'MM') - 1
          datajs.dates = new Date(StringUtils.getConvertDateFormat(item.wish_dat, 'YYYY'),
            month,
            StringUtils.getConvertDateFormat(item.wish_dat, 'DD'))
          var stateStr = item.state_name
          if (item.state_name == null)
            stateStr = ''
          datajs.popover = { label: item.area_name + ' ' + targetcomp + ' ' + item.mission_type_category + ' ' + stateStr }
          // console.log("setDateItem : ", datajs)
          this.dates.push(datajs)
        })
        // console.log("setDateItem : ",this.dates)
      },

      // load mission_request info
      async presetMissionData() {
        //alert("PresetMissionData() 함수호출 성공")
        const requestedMissionInfo = { rmt_id: this.requestMissionTypeId }

        //미션 요청 목록에서 row.mission_type정보를 넘겨줘야한다.
        try {
          let result = await dbAPI.query('select.requested_mission', requestedMissionInfo)
          if (result.rowCount > 0) {
            console.log(result.rows)
            //alert("쿼리 성공입니다")
            result.rows.forEach(row => {
              // alert("fullName: "+row.full_name+"\n"
              //       +"lotAddr: "+row.lot_address+"\n"
              //       +"areaBoundary: "+JSON.stringify(row.area_boundary)+"\n"
              //       +"wishDate: "+row.wish_dat+"\n"
              //       +"cropName: "+row.crop_name+"\n"
              //       +"cropNameDetail: "+row.crop_name_detail+"\n"
              //       +"project_id: "+row.project_id+"\n"
              //       +"wishSprayMaterial: "+row.wish_spray_material)

              this.missionName = row.mission_type_name + '_' + row.area_name + '_'
                + row.wish_dat + '_' + row.full_name
              this.missionType = row.mission_type_category
              this.missionType2 = row.mission_type_name
              this.lotAddress = row.lot_address
              this.userName = row.full_name
              this.missionLocation = JSON.stringify(row.area_boundary.area)
              this.wishDate = row.wish_dat
              if (!row.state_name)
                this.missionStatus = '준비중'
              else
                this.missionStatus = row.state_name
              this.crop = row.crop_name
              this.wishSprayMaterial = row.wish_spray_material
              this._project_id = row.project_id
              this.managerName = row.company_name
              this.comment = row.comment

              let areaList = AreaUtil.getConvertDBToMapJson(row.area_boundary.area)
              this.setAreaList(areaList)
            })
          } else {
          }
        } catch (err) {
          console.log(err)
          alert('실패입니다')
          // 실패하면 task id를 삭제 하십시오...
        }
      },//PresetMissionData()

      // Add Mission
      async saveMission() {
        //alert('todo: 수정 내용 DB 저장')
      },
      async close() {
        this.$router.go(-1)
      },
      async registerMission() {

        // let result = await createTask()
        // if (response.statusText === 'Created') {
        //   console.log("임무 생성 전 태스크 생성 성공", response.data)

        // } else {
        //   console.log("태스크 생성 실패")
        //   return
        // }

        // alert("missionName: "+this.missionName+"\n"
        //       +"userName: "+this.userName+"\n"
        //       +"missionType: "+this.missionType+"\n"
        //       +"managerName: "+this.managerName+"\n"
        //       +"missionLocation: "+this.missionLocation+"\n"
        //       +"wishDate: "+this.wishDate+"\n"
        //       +"area: "+this.area+"\n"
        //       +"missionStatus: "+this.missionStatus)


        const missionInfo = JSON.parse(JSON.stringify({
          'mission_request_id': this.mission_request_id,
          'mission_name': this.missionName,
          'userName': this.userName,
          'missionType': this.missionType,
          //'managerName': this.managerName,
          'missionLocation': this.missionLocation,
          'mission_dat': this.wishDate,
          'area': this.area,//면적s
          // 'missionStatus': this.missionStatus,
          // 'crop': this.crop,
          'task_id': null,
          'ref_task_id': null,
          'sprayMeterial': this.sprayMeterial,
          'comment': null,
          'state': this.missionStatus
        }))

        let _mission_id = -1
        try {
          let result = await dbAPI.query('insert.mission', missionInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            _mission_id = result.rows[0].mission_id
            alert('성공입니다. mid: ' + _mission_id)
          }
        } catch (err) {
          console.log(err)
          alert('실패입니다')
          // 실패하면 task id를 삭제 하십시오...
        }

        if (_mission_id != -1) {
          try {
            let info = {
              request_mission_type_id: this.requestMissionTypeId,
              mission_id: _mission_id
            }
            let result = await dbAPI.query('update.request_mission_type', info)
            if (result.rowCount >= 1) {
              console.log(result.rows)
              alert('성공입니다')
            }
          } catch (err) {
            console.log(err)
            alert('실패입니다')
            // 실패하면 task id를 삭제 하십시오...
          }
        }

        //this.registerMission(missionInfo)
      },
      async createTask() {
        // POST /api/projects/{project_id}/tasks/
        // Parameters
        // {
        // "name": "Test", // Task 이름
        // "description": "", // Task 설명
        // "base_date": "2016-12-08T13:32:28.139474Z"
        // }
        var date = new Date()
        let baseDate = date.toISOString()
        console.log(baseDate)

        alert('taskName: ' + this.missionName + '\n'
          + 'description: ' + this.userName + '\n'
          + 'base_date: ' + baseDate)

        let payload = {
          'project_id': this._project_id,
          'task': {
            'name': this.missionName,
            'description': '',
            'base_date': baseDate
          }
        }

        // return axios.post(PROJECT_URL + payload.project_id + '/tasks/',
        //   {
        //     "name": payload.task.name,
        //     "algorithm": payload.task.algorithm,
        //     "base_date": payload.task.base_date
        //   },
        try {
          const result = await this.requestCreateTask(payload)
          console.log('## requestCreateTask() result: ' + JSON.stringify(result))
          if (response.statusText === 'Created') {
            console.log('임무 생성 전 태스크 생성 성공', response.data)
            return response
          } else {
            console.log('태스크 생성 실패')
            return response
          }
        } catch (err) {
          console.log(err)
        }
      },
      async updateMission() {
        const missionInfo = JSON.parse(JSON.stringify({
          'mission_id': this.missionRequestData.mission_id,
          // 'mission_name': this.missionName,
          // 'user_id': this.missionRequestData.user_id,
          // 'mission_request_id': this.missionRequestData.mission_request_id,
          // 'mission_type': this.missionRequestData.mission_type,
          'mission_dat': this.wishDate
          // 'area_id': this.missionRequestData.area_id,
          // 'area_size': this.missionRequestData.area_size,
          // 'crop_id': this.missionRequestData.crop_id,
          // 'spray_material': this.sprayMeterial,
          // 'state': this.getState()
        }))

        console.log('[updateMission] missionInfo : ', missionInfo)

        // this.showDialog = true

        try {
          let result = await dbAPI.query('update.mission.byuser', missionInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            console.log('[updateMission] update.mission 성공입니다.')

            this.successDialog()
          }
        } catch (err) {
          console.log(err)
          console.log('[updateMission] update.mission 실패입니다')

          this.failDialog()
        }
      },

      successDialog() {
        this.showDialogPositive = true
        this.dialogMessage = '성공하였습니다.'
      },

      failDialog() {
        this.showDialogPositive = true
        this.dialogMessage = '실패하였습니다.'
      }
    },
    components: {
      BaseModal,
      BaseMap
    }


  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
