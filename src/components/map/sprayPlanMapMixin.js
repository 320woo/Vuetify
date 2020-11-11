import Constants from '@/components/common/constants'
import * as types from '@/vuex/mutation-types'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import StringUtil from '@/utils/utils/stringUtil'
import ImageUtil from '@/utils/api/fileAPI'
import dbAPI from '@/utils/api/dbAPI'
import AreaUtil from '@/utils/utils/areaUtil'


const ENUM_MISSION_DETAIL_TYPE = {
  MTYPE_PICTURE: 0,
  MTYPE_PICTURE_NIR: 1,
  MTYPE_ORTHO_MAP: 2,
  MTYPE_NDVI_MAP: 3,
  MTYPE_VEGE_ANALYSIS_: 4,
  MTYPE_DAMAGE_ANALYSIS_: 5,
  MTYPE_GRADE_ANALYSIS_: 6,
  MTYPE_FERTILIZER_NORMAL: 7,
  MTYPE_FERTILIZER_DIFF: 8,
  MTYPE_SOWING: 9,
  MTYPE_PESTICIDE: 10,
  MTYPE_GEOTIFF: 11,
  MTYPE_AI_MAP: 12
}

export const sprayPlanMapMixin = {
  data: () => ({
    selectedProjectId: null,
    selectedTaskId: null,
    detailTask: false,
    progressBar: false,
    isEnableImagePosition: false,
    isEnableGraph: false,
    sprayPlanId: -1,
    mapMode: Constants.ENUM_MAP_MODE.TASK_MAP,
    Constants
  }),
  created() {
    console.info('[created] params projectId : ' + this.$route.params.projectId)
    console.info('[created] params taskId : ' + this.$route.params.taskId)

    let projectId = this.$route.params.projectId
    let taskId = this.$route.params.taskId

    this.setSelectTask(taskId, true)

    this.clearSprayPlanArea()

    this.requestProjectList()
    this.requestSprayPlanInfo()
    this.setCurrentSelectedSprayPlanArea({ id: null })

    this.$store.commit(types.SET_PROJECTS, {})
    this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
    this.$store.commit(types.MAP_OPACITY, { opacity: this.opacity })
    this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, { markerId: null })
    this.$store.commit(types.MAP_TIMELINE, { isEnableTimeline: false })
    this.$store.commit(types.MAP_IMAGE_POSITION, { isEnableImagePosition: false })
    this.$store.commit(types.CLEAR_MARKER_LIST)
    this.$store.commit(types.SHOW_CONTENT, { showContents: true })
  },

  destroyed() {
    this.clearSprayPlanArea()
    this.setCurrentSelectedSprayPlanArea({ id: null })
  },

  methods: {
    ...mapMutations([
      'setAreaList',
      'setSprayPlanAreaList',
      'clearSprayPlanArea',
      'setCurrentSelectedSprayPlanArea'
    ]),

    ...mapActions([
      'requestGetProjectAll',
      'requestGetFileSearchList'
    ]),

    isUser() {
      console.log('[isUser] this.$session.get(\'user_type\') : ' + this.$session.get('user_type'))
      return this.$session.get('user_type') === 'consumer'
    },

    goToPrevPage() {
      this.$router.go(-1)
    },

    setSelectTask(taskId, detail) {
      console.log('[setSelectTask] taskId : ' + taskId + ', detail : ' + detail)
      this.selectedTaskId = taskId
      this.detailTask = detail

      this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, { markerId: null })
      this.$store.dispatch(types.GET_MARKER_LIST, {
        project_id: this.projectId,
        task_id: this.selectedTaskId
      })
    },

    async requestProjectList() {
      this.progressBar = true
      let projectId = this.$route.params.projectId

      this.requestGetProjectAll(projectId)
    },

    getTaskAddress(taskId) {
      let task = this.getTaskInfo(taskId)

      if (task.address instanceof Object) {
        return task.address.result[0]
      } else {
        return { text: '' }
      }
    },

    _convertDate(date) {
      return StringUtil.getConvertDate(new Date(date))
    },

    validStatusFilter(tasks) {
      if (tasks === undefined) return
      return tasks.filter(task => task.status === Constants.ENUM_TASK_STATUS.COMPLETED.value)
    },
    async showImageLayout(_, fileId) {
      console.log('[showImageLayout] ')
      await this.getImageList(fileId)

      const fileManager = ImageUtil.FileManagerUrl({}, {
        [ImageUtil.FILE_ID]: fileId
      })
      this.imageUrl = fileManager.storageImageUrl
      this.enableImageLayout = true
    },
    async requestSprayPlanInfo() {
      let missionId = this.$route.params.missionId
      let missionTypeId = this.$route.params.missionTypeId

      console.log('[requestSprayPlanInfo] missionId : ' + missionId)
      let queryString = (missionTypeId == ENUM_MISSION_DETAIL_TYPE.MTYPE_FERTILIZER_DIFF) ?
        'select.spray_plan' : 'select.spray_plan.normal'
      console.log('[requestSprayPlanInfo] queryString : ' + queryString)
      let result = await dbAPI.query(queryString, { 'mission_id': missionId })
      console.log('[requestSprayPlanInfo] result : ', result)

      if (result.rowCount > 0) {
        this.sprayPlanId = result.rows[0].spray_plan_id
        this.analysisComment = result.rows[0].content
        let sprayPlanAreaList = result.rows[0].spray_plan_info.spray_area

        console.log('[requestSprayPlanInfo] sprayPlanAreaList : ', sprayPlanAreaList)
        this.setSprayPlanAreaList(sprayPlanAreaList)

        let areaList = AreaUtil.getConvertDBToMapJson(result.rows[0].area_boundary.area)
        this.setAreaList(areaList)
      }
    },

    async getImageList(fileId) {
      this.imageList = this.getImageInfoList
      if (fileId) {
        this.imageList = this.imageList.filter((item) => {
          return item.id === fileId
        })
      }
    },

    async goToDetailView(fileId) {
      console.log('[goToDetailView] ')
      await this.getImageList(fileId)
      this.enableDetailView = true
    }
  },
  computed: {
    ...mapGetters([
      'getProject',
      'isShowContent',
      'getSprayPlanAreaList',
      'getImageInfoList',
      'getCurrentSelectedSprayPlanArea'
    ]),

    getProjectInfo() {
      console.log('[getProjectInfo]')
      return this.getProject
    },

    getTaskInfo() {
      return (taskId) => {
        let taskList = this.getTaskList
        let task = null
        if (taskList !== undefined && taskId !== undefined) {
          task = taskList.filter((data) => {
            return data.task_id === taskId
          })
        }
        return task === null ? null : task[0]
      }
    },

    getTaskList() {
      console.log('[getTaskList]')
      if (this.getProjectInfo === undefined) return
      this.progressBar = false
      const tasks = this.getProjectInfo.tasks
      console.log('[getTaskList] task : ', tasks)
      return tasks
    },

    mergeProjectInfo() {
      let project = this.getProjectInfo
      if (!project.tasks) return null

      let tasks = this.validStatusFilter(project.tasks)

      this.projectInfo.projectId = project.project_id

      let taskId = this.$route.params.taskId

      tasks.forEach((task) => {
        if (task.task_id === taskId) {
          this.projectInfo.tasks.push(task)
        }
      })
      return this.projectInfo
    },

    isShowMarkerContent() {
      let isShow = this.isShowContent
      console.log('[isShowMarkerContent] isShow : ' + isShow)
      return isShow
    },

    originalImageViewIcon() {
      return require('@/assets/originalImage.png')
    },

    getContent() {
      let content = this.getCurrentSelectedSprayPlanArea
      console.log('[getContent] content', content)
      return content
    }
  },
  watch: {
    getSelectTaskId(val, oldVal) {
      if (val !== this.selectedTaskId) {
        this.setSelectTask(val, this.detailTask)
      }
    },

    getTaskList(val, oldVal) {
      if (oldVal === undefined && val !== undefined) {
        let taskInfo = val.filter((data) => {
          return data.task_id === this.selectedTaskId
        })
        if (taskInfo.length > 0) {
          if (taskInfo[0].taskfiles.storagefiles !== undefined) {
            this.isEnableImagePosition = true
            this.requestGetFileSearchList(taskInfo[0].taskfiles.storagefiles)
          }
        }
      }
    },
    isShowMarkerContent(val, oldVal) {
    }
  }
}
