import AnalysisMissionDialog from '@/components/provider/dialog/AnalysisMissionDialog'
import MapDialog from '@/components/provider/dialog/2DMapDialog'
import NdviDialog from '@/components/provider/dialog/NDVIDialog'
import WaypointPlanDialog from '@/components/common/WaypointPlanDialog'
import WaypointDialog from '@/components/provider/dialog/WaypointDialog'
import SprayPlanDialog from '@/components/provider/dialog/SprayPlanDialog'
import SprayDialog from '@/components/provider/dialog/SprayDialog'
import ImageImportDialog from '@/components/provider/dialog/ImageImportDialog'
import FileUpload from '@/components/common/FileUpload'
import dbAPI from '@/utils/api/dbAPI'
import { mapActions } from 'vuex'
import StringUtil from '@/utils/utils/stringUtil'
import Constants from '@/components/common/constants'
import icons from '@/icons'
import MissionStatus from '@/components/common/mission/MissionStatus'
import MissionInformation from '@/components/common/mission/MissionInformation'
import taskAPI from '../../../utils/api/taskAPI'
import ConfirmDeleteMissionDialog from '@/components/provider/dialog/ConfirmDeleteMissionDialog'

export const missionMixin = {
  props: {
    requestMissionTypeId: {
      type: Number,
      default: null
    },
    missioninfo: {
      type: Object,
      default: null
    }
  },

  components: {
    AnalysisMissionDialog,
    MapDialog,
    NdviDialog,
    WaypointPlanDialog,
    WaypointDialog,
    SprayPlanDialog,
    SprayDialog,
    ImageImportDialog,
    FileUpload,
    MissionStatus,
    MissionInformation,
    ConfirmDeleteMissionDialog
  },

  data: () => ({
    analysisDialog: false,
    mapDialog: false,
    ndviDialog: false,
    waypointPlanDialog: false,
    waypointDialog: false,
    sprayPlanDialog: false,
    sprayDialog: false,
    imageImportDialog: false,
    deleteDialog: false,

    missionItem: {},
    task: {},
    icons: icons
  }),

  created() {
    console.log('[created] ')
    this.requestMissionItem()
  },

  methods: {
    ...mapActions(['requestGCPFileExport', 'requestGetTask', 'requestDeleteTask']),

    isuser() {
      if (this.$session.get('user_type') == "consumer") {
        return true
      }
      return false
    },

    gcpExport() {
      let data = {
        missionId: this.mission.mission_id,
        body: {
          project_id: '', // projectId 추후 추가
          task_id: '' // taskId 추후 추가
        }
      }

      this.requestGCPFileExport(data)
    },

    async requestMissionItem() {
      // let result = await dbAPI.query('select.mission_request.item', {
      //   request_mission_type_id: this.requestMissionTypeId
      // })
      // console.log(
      //   '[requestMissionItem] select.mission_request.item : ',
      //   result
      // )

      // if (result.rowCount >= 1) {
      //   this.missionItem = result.rows
      // }
      console.log('[requestMissionItem] get proc missioninfo ', this.missioninfo)
      this.missionItem  = await this.missioninfo
      await this.requestTaskInfo()
    },

    async requestTaskInfo() {
      if (this.mission !== undefined && this.mission.task_id && this.mission.project_id) {
        await this.requestGetTask(
          {
            project_id: this.mission.project_id,
            task_id: this.mission.task_id
          },
          Constants.TASK_INFO_ALL
        );
        this.task = await this.$store.getters.getTask
      }
      else {
        console.log('[MISSION INFO]: Fail to get Task info')
      }
    },

    moveToMissionHistory() {
      this.$router.push({
        name: 'missionHistory',
        params: {
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToAnalysisMap() {
      this.$router.push({
        name: 'analysisMap',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToAnalysisTimeSeries() {
      this.$router.push({
        name: 'analysisTimeSeries',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToAnalysisDiary() {
      this.$router.push({
        name: 'analysisDiary',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToAnalysisCompare() {
      this.$router.push({
        name: 'analysisCompare',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToAnalysisDEM() {
      this.$router.push({
        name: 'analysisDEM',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    async moveTo2DMap() {
      this.$router.push({
        name: 'provider2DMap',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          areaId: this.mission.area_id
        }
      })
    },

    moveToSpayPlanMap() {
      this.$router.push({
        name: 'sprayPlanMap',
        params: {
          projectId: this.mission.project_id,
          taskId: this.mission.task_id,
          missionId: this.mission.mission_id,
          missionTypeId: this.mission.mission_type
        }
      })
    },

    showAnalysisDialog() {
      this.analysisDialog = true
    },
    show2DMapDialog() {
      // this.mapDialog = true
      this.moveTo2DMap()
    },
    showNDVIDialog() {
      this.ndviDialog = true
    },
    showWaypointPlanDialog() {
      this.waypointPlanDialog = true
    },
    showWaypointDialog() {
      this.waypointDialog = true
    },
    showSprayPlanDialog() {
      this.sprayPlanDialog = true
    },
    showSprayDialog() {
      this.sprayDialog = true
    },
    showImageImportDialog() {
      // this.imageImportDialog = true
      this.getChild('FileUpload').addPhoto()
    },
    showDeleteDialog() {
      this.deleteDialog = true
    },
    getChild(name) {
      for (let child of this.$children) {
        if (child.$options.name === name) {
          console.log('[getChild] child : ', child)
          return child
        }
      }
    },
    getDate(date) {
      return StringUtil.getConvertDateFormat(
        date,
        StringUtil.REQUEST_DATE_FORMAT
      )
    },
    getDateLabel() {
      var label = "예정일"
      var date = undefined
      if (this.mission.mission_end_dat != undefined && this.mission.mission_end_dat != null) {
        label = "완료일"
        date = this.mission.mission_end_dat
      }
      else if (this.mission.mission_dat != undefined && this.mission.mission_dat != null) {
        label = "예정일"
        date = this.mission.mission_dat
      }
      else if (this.mission.wish_dat != undefined && this.mission.wish_dat != null) {
        label = "희망일"
        date = this.mission.wish_dat
      }
      return label
    },
    getDateString() {
      var label = "예정일"
      var date = undefined
      if (this.mission.mission_end_dat != undefined && this.mission.mission_end_dat != null) {
        switch (this.mission.status) {
          case 4:
            label = "취소일"
            break
          case 3:
            label = "완료일"
            break
          case 2:
            label = "종료예정일"
            break
        }
        date = this.mission.mission_end_dat
      }
      else if (this.mission.mission_dat != undefined && this.mission.mission_dat != null) {
        label = "예정일"
        date = this.mission.mission_dat
      }
      else if (this.mission.wish_dat != undefined && this.mission.wish_dat != null) {
        label = "희망일"
        date = this.mission.wish_dat
      }
      var datestring = StringUtil.getConvertDateFormat(
        date,
        StringUtil.REQUEST_DATE_FORMAT
      )
      return datestring
    },
    getAddressString() {
      if (this.mission.address_basic == undefined || this.mission.address_detail == undefined)
        return ""

      var address = this.mission.address_basic + ' ' + this.mission.address_detail
      // console.log(address + ' ' + address.length)
      // console.log(typeof(address))
      // console.log(address.substr(0, 12))
      // console.log(address.length > 12 ? '...':'')
      var shortaddress = address.substr(0, 12)
      var postfix = address.length > 12 ? '...':''
      var result = shortaddress + postfix
      return result
    },
    getSmallString(targetString, length) {
      if (targetString == undefined)
        return ""

      var shortaddress = targetString.substr(0, length)
      var postfix = targetString.length > 12 ? '...':''
      var result = shortaddress + postfix
      return result
    },

    editMissionReport() {
      console.log(
        '[editMissionReport] this.requestMissionTypeId : ' +
        this.requestMissionTypeId
      )
      this.$router.push({
        name: 'editMissionGenerateReport',
        params: {
          missionRequestId: this.mission.mission_request_id,
          requestMissionTypeId: this.mission.request_mission_type_id,
          missionId: this.mission.mission_id
        }
      })
    },
    async deleteMission() {
      console.log(
        '[deleteMission] this.mission_id : ' + this.mission.mission_id
      )

      //delete a task
      // http://211.189.132.21:8095/api/projects/35e24a36-3df7-4b71-885e-d7c646072880/tasks/5fbd803b-2d53-4392-97ea-bfdc25effe31/
      console.log('[deleteMission] requestDeleteTask - project_id:'
                                                    + this.mission.project_id
                                                    + ', task_id:'
                                                    + this.mission.task_id)

      let payload = {
        project_id: this.mission.project_id,
        task_id: this.mission.task_id
      }
      this.requestDeleteTask(payload)

      let result = await dbAPI.query('delete.mission', {
        mission_id: this.mission.mission_id
      })

      try {
        let info = {
          request_mission_type_id: this.mission.request_mission_type_id,
          mission_id: null
        }
        let result = await dbAPI.query('update.request_mission_type', info)
        console.log(result.rows)
      } catch (err) {
        console.log(err)
      }

      if (result.status === 200) {
        this.requestMissionItem()
      }

      this.$emit("on-refresh")
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
    }
  },

  computed: {
    mission() {
      return this.missionItem
    }
  }
}
