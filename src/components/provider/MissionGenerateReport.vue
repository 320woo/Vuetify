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
          <v-card-actions style="padding: 0!important;">
            <v-btn v-if="isAddMode" flat color="orange" @click="registerMission()">등록</v-btn>
            <v-btn v-if="!isAddMode" flat color="orange" @click="updateMission()">수정</v-btn>
            <v-btn flat color="orange" @click="prev()">취소</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-layout>
    <progress-dialog
      :is-show-dialog="showDialog"
      :message="dialogMessage"
      :is-positive-button="showDialogPositive"
      @close="prev">
    </progress-dialog>
  </v-container>
</template>

<script>
  import BaseModal from "@/components/shared-components/BaseModal"
  import { mapActions, mapGetters, mapMutations } from "vuex"
  import dbAPI from "@/utils/api/dbAPI"
  import ProgressDialog from "@/components/common/ProgressDialog"
  import StringUtil from "@/utils/utils/stringUtil"
  import taskAPI from "@/utils/api/taskAPI"
  import moment from "moment-timezone"
  import Constants from "@/components/common/constants"
  import BaseMap from "@/components/map/BaseMap"
  import AreaUtil from "@/utils/utils/areaUtil"


  const ENUM_MISSION_DETAIL_TYPE = {
    MTYPE_PICTURE: 0,
    MTYPE_PICTURE_NIR: 1,
    MTYPE_ORTHO_MAP: 2,
    MTYPE_NDVI_MAP: 3,
    MTYPE_VEGE_ANALYSIS: 4,
    MTYPE_DAMAGE_ANALYSIS: 5,
    MTYPE_GRADE_ANALYSIS: 6,
    MTYPE_FERTILIZER_NORMAL: 7,
    MTYPE_FERTILIZER_DIFF: 8,
    MTYPE_SOWING: 9,
    MTYPE_PESTICIDE: 10,
    MTYPE_GEOTIFF: 11
  }

  export default {
    name: "Mission",
    props: {
      missionId: {
        type: Number
      }
    },
    data: () => ({
      missionName: "",
      lotAddress: "",
      userName: "",
      missionTypeCategory: "",
      missionTypeName: "",
      missionTypeId: "",
      managerName: "",
      missionLocation: "",
      wishDateMenu: false,
      wishDate: new Date().toISOString().substr(0, 10),
      missionStatusList: ["준비중", "진행중", "완료", "취소"],
      area: "",
      missionStatus: "",
      _project_id: "",
      _task_id: "",
      crop: "",
      sprayMeterial: "",
      wishSprayMaterial: "",
      requestMissionTypeId: "",
      comment: "",

      // Mission Info
      missionRequestData: {},
      missionRequestDataUI: {},

      // Progress Dialog
      showDialog: false,
      showDialogPositive: false,
      dialogMessage: undefined,

      dates: [],
      wishDateCal: new Date()

    }),
    created() {
      console.log("[created] this.$route.params.requestMissionTypeId : " + this.$route.params.requestMissionTypeId)
      this.requestMissionTypeId = this.$route.params.requestMissionTypeId
      this.presetMissionData()

      console.log("[created] wishDate : " + this.wishDate)
      this.getMissionRequestAll()
    },
    computed: {
      ...mapGetters([
        "getCreateMission"
      ]),
      isAddMode() {
        return this.$route.params.missionId === undefined
      }
    },
    methods: {
      ...mapActions([
        "requestCreateMission",
        "openGlobalModal"
        //'requestGetProject',
        // 'requestCreateTask',
        //'requestPatchTask',
        //'requestDeleteTask'
      ]),

      ...mapMutations([
        "setAreaList"
      ]),

      async getMissionRequestAll() {
        let result = await dbAPI.query("select.mission_request.only_request_list")

        console.log("[getMissionRequestAll] select.mission_request.only_request_list result :", result)
        if (result.rowCount >= 1) {
          // console.log(result.rows)
          this.missionRequestDataUI = result.rows

          let missionDataResult = await dbAPI.query("select.mission_request.only_request")
          this.missionData = missionDataResult.rows
          console.log("[getMissionRequestAll] ", this.missionData)
        }
        this.setDateItem()
      },

      formatDate(date) {
        if (!date) return null
        // console.log("[formatDate] ", date)
        var year = StringUtil.getConvertDateFormat(date, "YYYY")
        var month = StringUtil.getConvertDateFormat(date, "MM")
        var day = StringUtil.getConvertDateFormat(date, "DD")
        // console.log(`${year}-${month}-${day}`)
        this.wishDate = `${year}-${month}-${day}`
        return `${year}-${month}-${day}`
      },

      setDateItem() {
        this.missionData.forEach((item) => {
          console.log("setDateItem")
          var datajs = new Object()
          datajs.key = item.mission_type_category

          var categorycolor = "red"
          switch (item.mission_type_category) {
            case Constants.MISSION_CATEGORY_ANALYSIS:
              categorycolor = "blue"
              break
            case Constants.MISSION_CATEGORY_MANURE:
              categorycolor = "pink"
              break
            case Constants.MISSION_CATEGORY_SOWING:
              categorycolor = "green"
              break
            case Constants.MISSION_CATEGORY_PHOTO:
              categorycolor = "red"
              break
            case Constants.MISSION_CATEGORY_MAP:
              categorycolor = "yellow"
              break
            case Constants.MISSION_CATEGORY_PESTICIDE:
              categorycolor = "purple"
              break
          }

          //datajs.highlight = true
          datajs.bar = { color: categorycolor }
          //datajs.dot = { color:categorycolor }
          //datajs.bars = true
          var month = StringUtil.getConvertDateFormat(item.wish_dat, "MM") - 1
          datajs.dates = new Date(StringUtil.getConvertDateFormat(item.wish_dat, "YYYY"),
            month,
            StringUtil.getConvertDateFormat(item.wish_dat, "DD"))
          datajs.popover = { label: item.area_name + " " + item.mission_type_category }
          console.log("setDateItem : ", datajs)
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

      // load mission_request info
      async presetMissionData() {
        console.log("[preset mission data]")
        //alert("PresetMissionData() 함수호출 성공")
        const requestedMissionInfo = await { rmt_id: this.requestMissionTypeId }
        if (this.isAddMode) {
          await this.getMissionRequestData(requestedMissionInfo)
        } else {
          await this.getMissionDataByMissionId(requestedMissionInfo, this.missionId)
        }
      },//PresetMissionData()

      async getMissionRequestData(requestedMissionInfo) {
        //미션 요청 목록에서 row.mission_type정보를 넘겨줘야한다.
        try {
          let result = await dbAPI.query("select.requested_mission", requestedMissionInfo)
          if (result.rowCount > 0) {
            console.log(result.rows)
            this.missionRequestData = result.rows[0]

            this.missionName = this.missionRequestData.area_name + "_" + this.missionRequestData.full_name
            this.missionTypeCategory = this.missionRequestData.mission_type_category
            this.missionTypeName = this.missionRequestData.mission_type_name
            this.missionTypeId = this.missionRequestData.mission_type
            this.lotAddress = this.missionRequestData.lot_address
            this.userName = this.missionRequestData.full_name
            this.missionLocation = JSON.stringify(this.missionRequestData.area_boundary.area)
            this.wishDate = StringUtil.getConvertDateFormat(this.missionRequestData.wish_dat, StringUtil.REQUEST_DATE_FORMAT)
            this.area = this.missionRequestData.area_size

            // this.missionStatus = this.missionRequestData.state_name || this.missionStatusList[0]
            if (this.missionTypeId == 0 || this.missionTypeId == 1) {
              this.missionStatus = this.missionRequestData.state_name || this.missionStatusList[2]
            }
            this.crop = this.missionRequestData.crop_name
            this.wishSprayMaterial = this.missionRequestData.wish_spray_material
            this._project_id = this.missionRequestData.project_id
            this.managerName = this.missionRequestData.company_name
            this.mission_request_id = this.missionRequestData.mission_request_id
            this.comment = this.missionRequestData.comment

            let areaList = AreaUtil.getConvertDBToMapJson(this.missionRequestData.area_boundary.area)
            this.setAreaList(areaList)
          } else {
          }
        } catch (err) {
          console.log(err)
          alert("실패입니다")
        }
      },

      async getMissionDataByMissionId(requestedMissionInfo, missionId) {
        console.log(missionId)
        await this.getMissionRequestData(requestedMissionInfo)
        const result = await dbAPI.query("select.mission", { mission_id: missionId })
        if (result.rowCount > 0) {
          console.log(result.rows)
          this.comment = result.rows[0].comment
        } else {

        }
      },

      // Add Mission
      async registerMission() {

// HTTP method : POST
// HTTP URL : /api/projects/{project_id}/tasks/{task_id}/duplicate

// * Response
// Response Type : Json
// {
//    "returnCode": code
//    "reason": "result string"
// }
        console.log("[registerMission] missionTypeId: " + this.missionTypeId)
        console.log("[registerMission] missionTypeCategory: " + this.missionTypeCategory)

// // Mission Category
// const MISSION_CATEGORY_ANALYSIS = '분석'
// const MISSION_CATEGORY_MANURE = '시비'
// const MISSION_CATEGORY_SOWING = '파종'
// const MISSION_CATEGORY_PHOTO = '촬영'
// const MISSION_CATEGORY_MAP = '지도제작'
// const MISSION_CATEGORY_PESTICIDE = '방제'

        let rmission = null

        if (this.missionTypeCategory === Constants.MISSION_CATEGORY_MAP ||
          this.missionTypeCategory === Constants.MISSION_CATEGORY_ANALYSIS ||
          // this.missionTypeId == ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_DIFF ||
          this.missionTypeCategory === Constants.MISSION_CATEGORY_MANURE ||
          this.missionTypeCategory === Constants.MISSION_CATEGORY_SOWING ||
          this.missionTypeCategory === Constants.MISSION_CATEGORY_PESTICIDE) //MISSION_CATEGORY_MANURE
        {
          let mtype_id = parseInt(this.missionTypeId)

          try {
            let info = {
              mission_request_id: this.mission_request_id
            }

            console.log("mission_request_id: " + info.mission_request_id)
            let result = await dbAPI.query("select.request_mission_type", info)
            if (result.rowCount > 0) {
              console.log("select.request_mission_type result: ", result.rows)
              let isRelative = false
              let isExistCompletedMission = false

              // 정사영상은 일반촬영 task 참조
              // NDVI는 특수촬영 task 참조
              // 생육분석은 NDVI task 참조
              // 피해분석은 NDVI task 참조(추후 정사영상도 추가)
              // 경사도분석은 ORTHO(DSM) task 참조
              // 일반시비, 파종, 방제는 정사영상이 존재하면 정사영상 참조

              for (let i in result.rows) {
                let item = result.rows[i]
                if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_ORTHO_MAP)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_PICTURE)) {
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_NDVI_MAP)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_PICTURE_NIR)) {
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_VEGE_ANALYSIS)
                  && ((item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_NDVI_MAP)
                    || (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_ORTHO_MAP))) {
                  //임시로 정사영상/NDVI 중에 먼저 발견되면 그것으로 복사 및 생성
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_DAMAGE_ANALYSIS)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_NDVI_MAP)) {
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_GRADE_ANALYSIS)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_ORTHO_MAP)) {
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_DIFF)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_VEGE_ANALYSIS)) {
                  isRelative = true
                } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_NORMAL ||
                            mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_SOWING ||
                            mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_PESTICIDE)
                  && (item.mission_type === ENUM_MISSION_DETAIL_TYPE.MTYPE_ORTHO_MAP)) {
                  isRelative = true
                }

                if (isRelative == true && (item.mission_id != null && item.mission_id != "")) {
                  let mr_info = {
                    mission_id: item.mission_id
                  }
                  let result2 = await dbAPI.query("select.mission", mr_info)
                  if (result2.rowCount > 0) {
                    rmission = result2.rows[0]
                    if (rmission.state == 3) {//3:완료
                      isExistCompletedMission = true
                    }
                  }
                }
              } //for (let i in result.rows)

              console.log("#2 mtype_id: " + mtype_id + ", isRelative: " + isRelative
                + ", isExistCompletedMission: " + isExistCompletedMission)
              if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_ORTHO_MAP)
                && (isRelative == true && isExistCompletedMission == false)) {
                alert("일반촬영 임무를 먼저 완료하세요")
                return
              } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_NDVI_MAP)
                && (isRelative == true && isExistCompletedMission == false)) {
                alert("특수촬영 임무를 먼저 완료하세요")
                return
              } else if (((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_VEGE_ANALYSIS)
                || (mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_DAMAGE_ANALYSIS))
                && (isRelative == true && isExistCompletedMission == false)) {
                alert("지도제작(NDVI) 임무를 먼저 완료하세요")
                return
              } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_GRADE_ANALYSIS)
                && (isRelative == true && isExistCompletedMission == false)) {
                alert("지도제작(정사영상) 임무를 먼저 완료하세요")
                return
              } else if ((mtype_id === ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_DIFF)
                && (isRelative == true && isExistCompletedMission == false)) {
                alert("생육분석 임무를 먼저 완료하세요")
                return
              }
            }
          } catch (err) {
            console.log("[ERROR] ", err)
          }


          if (rmission != null) {

            //촬영 미션이 존재하면 연관 정보 설정
            let payload = {
              project_id: rmission.project_id,
              task: {
                task_id: rmission.task_id,
                algorithm: Constants.MISSION_TYPES.findMissionType(this.missionTypeId).algorithm,
                name: this.missionName,
                description: "",
                // base_date: moment().format()
              }
            }

            console.log("taskAPI.duplicateTask payload > " + JSON.stringify(payload))
            let response = await taskAPI.duplicateTask(payload)
            console.log("[duplicateTask response] ", response.data)
            if (response.data.task_id !== null && response.data.task_id !== undefined) {
              this._task_id = response.data.task_id
              console.log("임무 생성 전 태스크 생성(복사) 성공, task_id: " + this._task_id)
              payload.task.task_id = response.data.task_id

              console.log("taskAPI.updateTask payload > " + JSON.stringify(payload))
              let response2 = await taskAPI.updateTask(payload)
              if (response2.statusText === "OK") {
                console.log("태스크 갱신 성공", response2.data)
              } else {
                console.log("태스크 갱신 실패", response2)
                return
              }

            } else {
              console.log("태스크 생성(복사) 실패")
              return
            }
          } else {
            // this.createTask4Mission()
            let payload = {
              project_id: this._project_id,
              task: {
                name: this.missionName,
                description: "",
                base_date: moment().format(),
                algorithm: Constants.MISSION_TYPES.findMissionType(this.missionTypeId).algorithm
              }
            }

            console.log("#2 taskAPI.createTask > " + JSON.stringify(payload))
            let response2 = await taskAPI.createTask(payload)
            if (response2.data.task_id !== null && response2.data.task_id !== undefined) {
              console.log("임무 생성 전 태스크 생성 성공: " + response2.data.task_id)
              this._task_id = response2.data.task_id
            } else {
              console.log("태스크 생성 실패")
              return
            }
          }
        } else {
          // this.createTask4Mission()
          let payload = {
            project_id: this._project_id,
            task: {
              name: this.missionName,
              description: "",
              base_date: moment().format(),
              algorithm: Constants.MISSION_TYPES.findMissionType(this.missionTypeId).algorithm
            }
          }

          console.log("#1 taskAPI.createTask > " + JSON.stringify(payload))
          let response = await taskAPI.createTask(payload)
          if (response.data.task_id !== null && response.data.task_id !== undefined) {
            console.log("임무 생성 전 태스크 생성 성공: " + response.data.task_id)
            this._task_id = response.data.task_id
          } else {
            console.log("태스크 생성 실패")
            return
          }

        }

        // alert("missionName: "+this.missionName+"\n"
        //       +"userName: "+this.userName+"\n"
        //       +"missionTypeCategory: "+this.missionTypeCategory+"\n"
        //       +"managerName: "+this.managerName+"\n"
        //       +"missionLocation: "+this.missionLocation+"\n"
        //       +"wishDate: "+this.wishDate+"\n"
        //       +"area: "+this.area+"\n"
        //       +"missionStatus: "+this.missionStatus)

        console.log("[registerMission] missionRequestData : ", this.missionRequestData)
        console.log("[registerMission] this._task_id : ", this._task_id)
        const missionInfo = JSON.parse(JSON.stringify({
          "mission_name": this.missionName,
          "user_id": this.missionRequestData.user_id,
          "mission_request_id": this.missionRequestData.mission_request_id,
          "mission_type": this.missionRequestData.mission_type,
          "mission_dat": this.wishDate,
          "area_id": this.missionRequestData.area_id,
          "area_size": this.missionRequestData.area_size,
          "crop_id": this.missionRequestData.crop_id,
          "spray_material": this.wishSprayMaterial,//sprayMeterial,
          "task_id": this._task_id,
          "comment": this.comment,
          "state": this.getState()
        }))

        console.log("[registerMission] missionInfo : ", missionInfo)

        this.showDialog = true

        let _mission_id = -1
        try {
          let result = await dbAPI.query("insert.mission", missionInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            _mission_id = result.rows[0].mission_id
            console.log("[registerMission] insert.mission 성공입니다. mid: " + _mission_id)
          }
        } catch (err) {
          console.log(err)
          console.log("[registerMission] insert.mission 실패입니다")

          this.failDialog()
          // 실패하면 task id를 삭제 하십시오...
        }

        // TODO: 위 insert + 아래 update를 하나의 query로 처리 하도록 수정 필요
        if (_mission_id !== -1) {
          try {
            let info = {
              request_mission_type_id: this.requestMissionTypeId,
              mission_id: _mission_id
            }
            let result = await dbAPI.query("update.request_mission_type", info)
            if (result.rowCount >= 1) {
              console.log(result.rows)
              console.log("[registerMission] update.request_mission_type 성공입니다")

              this.successDialog()
            }
          } catch (err) {
            console.log(err)
            console.log("[registerMission] update.request_mission_type 실패입니다")

            this.failDialog()
            // 실패하면 task id를 삭제 하십시오...
          }

        } else {
          this.failDialog()
        }

        if (_mission_id !== -1) {
          //분석임무의 경우 분석 정보를 여기서 미리 생성해 놓아야 한다.
          if (this.missionTypeCategory === Constants.MISSION_CATEGORY_ANALYSIS) {
            try {
              let info = {
                mission_id: _mission_id,
                area_id: this.missionRequestData.area_id,
                task_id: this._task_id,
                content: ""
              }
              console.log("insert analyze info: ", info)
              let result = await dbAPI.query("insert.analyze_opinion", info)
              if (result.rowCount >= 1) {
                console.log(result.rows)
                console.log("[registerMission] insert.analyze_opinion 성공입니다")
              }
            } catch (err) {
              console.log(err)
              console.log("[registerMission] insert.analyze_opinion 실패입니다")
            }
          }

          // 차등시비는 생육분석에서 영역별 시비정보를 미리 설정해 놓고 차등시비 임무 생성시
          // 해당 정보를 복사해서 사용한다.
          else if (this.missionTypeId == ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_DIFF) {
            if (rmission != null) {
              try {
                let info = {
                  mission_id: _mission_id,
                  rmission_id: rmission.mission_id
                }
                console.log("#rmission: ", rmission)
                console.log("#create spray plan from analyze_opinion: ", info)
                let result = await dbAPI.query("insert.spray_plan.with.analyze", info)
                if (result.rowCount >= 1) {
                  console.log(result.rows)
                  console.log("[registerMission] insert.spray_plan.with.analyze 성공입니다")
                }
              } catch (err) {
                console.log(err)
                console.log("[registerMission] insert.spray_plan.with.analyze 실패입니다")
              }
            }
          }
          else if (this.missionTypeCategory === Constants.MISSION_CATEGORY_MANURE ||
                    this.missionTypeCategory === Constants.MISSION_CATEGORY_SOWING ||
                    this.missionTypeCategory === Constants.MISSION_CATEGORY_PESTICIDE) {
            try {
              let info = {
                mission_id: _mission_id,
                spray_plan_info: {}
              }
              console.log("#create spray plan: ", info)
              let result = await dbAPI.query("insert.spray_plan", info)
              if (result.rowCount >= 1) {
                console.log(result.rows)
                console.log("[registerMission] insert.spray_plan 성공입니다")
              }
            } catch (err) {
              console.log(err)
              console.log("[registerMission] insert.spray_plan 실패입니다")
            }
          }
        }
      },

      async updateMission() {
        const missionInfo = JSON.parse(JSON.stringify({
          "mission_id": this.missionRequestData.mission_id,
          "mission_name": this.missionName,
          "user_id": this.missionRequestData.user_id,
          "mission_request_id": this.missionRequestData.mission_request_id,
          "mission_type": this.missionRequestData.mission_type,
          "mission_dat": this.wishDate,
          "area_id": this.missionRequestData.area_id,
          "area_size": this.missionRequestData.area_size,
          "crop_id": this.missionRequestData.crop_id,
          "spray_material": this.wishSprayMaterial,//sprayMeterial,
          "comment": this.comment,
          "state": this.getState()
        }))

        console.log("[updateMission] missionInfo : ", missionInfo)

        this.showDialog = true

        try {
          let result = await dbAPI.query("update.mission", missionInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            console.log("[updateMission] update.mission 성공입니다.")

            this.successDialog()
          }
        } catch (err) {
          console.log(err)
          console.log("[updateMission] update.mission 실패입니다")

          this.failDialog()
        }
      },
      getState() {
        let state = this.missionStatusList.findIndex((item) => {
          return item === this.missionStatus
        })

        return state + 1
      },

      prev() {
        this.$router.go(-1)
      },

      successDialog() {
        this.showDialogPositive = true
        this.dialogMessage = "성공하였습니다."
      },

      failDialog() {
        this.showDialogPositive = true
        this.dialogMessage = "실패하였습니다."
      }
    },
    components: {
      BaseMap,
      BaseModal,
      ProgressDialog
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
