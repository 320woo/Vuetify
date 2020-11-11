import Constants from '@/components/common/constants'

export const missionListMixin = {
  methods: {
    getMissionType(item) {
      return Constants.MISSION_TYPES.findMissionType(item.mission_type_id)
    },
    isPictureMissionMode(item) {
      let type = this.getMissionType(item).typeDefine
      return type === Constants.ENUM_MISSION_TYPE.PICTURE
    },
    isCreateMapMissionMode(item) {
      let type = this.getMissionType(item).typeDefine
      return type === Constants.ENUM_MISSION_TYPE.CREATE_MAP
    },
    isReportMissionMode(item) {
      let type = this.getMissionType(item).typeDefine
      return type === Constants.ENUM_MISSION_TYPE.REPORT
    },
    isPlantationMissionMode(item) {
      let type = this.getMissionType(item).typeDefine
      return (
        type === Constants.ENUM_MISSION_TYPE.PLANTATION_FERTILIZATION ||
        type === Constants.ENUM_MISSION_TYPE.PLANTATION_SOWING ||
        type === Constants.ENUM_MISSION_TYPE.PLANTATION_CONTROL
      )
    },
    task_algorithm(item) {
      return this.getMissionType(item).algorithm || ''
    }
  }
}
