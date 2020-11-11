import projectAPI from '@/utils/api/projectAPI'
import taskAPI from '@/utils/api/taskAPI'
import Constant from '@/components/common/constants.js'
import StringUtils from '@/utils/utils/stringUtil'

const _setResult = async (context, response) => {
  console.log(response)
  if (response.status === 200 || response.status === 204 || response.status === 201) {
    if (context.getters.getProject.project_id !== undefined)
      context.dispatch('requestGetProject', context.getters.getProject.project_id)
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
  }
}
const _setResultTaskList = async (context, response) => {
  console.log('[_setResultTaskList] ')
  if (response.status === 200) {
    await context.commit('SET_PROJECTS', response.data)
  } else if (response.status === 401) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '프로젝트 정보 조회 오류'
    })
  }
}
const _setResultTask = async (context, response) => {
  if (response.status === 200) {
    await context.commit('SET_TASK', response.data)
  } else if (response.status === 401) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '테스크 정보 조회 오류'
    })
  }
}


export default {
  state: {
    project: {},
    task: {},
    // task_name: '',
    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,

    //Edit 기능
    editTask: {
      project_id: '',
      task: {
        name: '',
        algorithm: ''
      }
    },
    addTask: {
      project_id: '',
      task: {
        name: '',
        algorithm: ''
      }
    },
    removeTask: {
      project_id: '',
      task_id: ''
    },
    algorithmItem: [
      Constant.TASK_ALGORITHM_ODM,
      Constant.TASK_ALGORITHM_SCAN,
      Constant.TASK_ALGORITHM_NDVI,
      Constant.TASK_ALGORITHM_TEMPERATURE,
      Constant.TASK_ALGORITHM_GEOTIFF
    ],
    filterAlgorithmMode: null,
    algorithmFilters: [
      // Constant.ENUM_FILTER_ALGORITHM_MODE.ODM,
      // Constant.ENUM_FILTER_ALGORITHM_MODE.NDVI,
      // Constant.ENUM_FILTER_ALGORITHM_MODE.GEOTIFF
    ]
  },
  getters: {
    getTask(state) {
      return state.task
    },
    getProject(state, getters) {
      console.log('[getProject] getters : ', getters)
      if (getters.getFilterAlgorithmMode !== null) {
        let project = new StringUtils.clone(state.project)
        if (project.hasOwnProperty('tasks')) {
          project.tasks = project.tasks.filter((data) => {
            return data.algorithm === getters.getFilterAlgorithmMode.name
          })
        }
        return project
      } else {
        return state.project
      }
    },
    isOpenAddModal(state) {
      return state.addModal
    },
    isOpenEditModal(state) {
      return state.editModal
    },
    isOpenRemoveModal(state) {
      return state.removeModal
    },
    getEditTask(state) {
      return state.editTask
    },
    getRemoveTask(state) {
      return state.removeTask
    },
    getAlgorithmItem(state) {
      return state.algorithmItem
    },
    getFilterAlgorithmMode(state) {
      console.log('[getFilterAlgorithmMode] filterAlgorithmMode', state.filterAlgorithmMode)
      return state.filterAlgorithmMode
    },
    getAlgorithmFilters(state) {
      return state.algorithmFilters
    }
  },
  mutations: {
    SET_PROJECTS: (state, payload) => {
      state.project = payload

      if (state.project.hasOwnProperty('tasks')) {
        state.project.tasks.forEach((data) => {
          switch (data.algorithm.toLowerCase()) {
            case Constant.ENUM_FILTER_ALGORITHM_MODE.ODM.name.toLowerCase():
              if (!state.algorithmFilters.includes(Constant.ENUM_FILTER_ALGORITHM_MODE.ODM)) {
                state.algorithmFilters.push(Constant.ENUM_FILTER_ALGORITHM_MODE.ODM)
              }
              break
            case Constant.ENUM_FILTER_ALGORITHM_MODE.NDVI.name.toLowerCase():
              if (!state.algorithmFilters.includes(Constant.ENUM_FILTER_ALGORITHM_MODE.NDVI)) {
                state.algorithmFilters.push(Constant.ENUM_FILTER_ALGORITHM_MODE.NDVI)
              }
              break
            case Constant.ENUM_FILTER_ALGORITHM_MODE.GEOTIFF.name.toLowerCase():
              if (!state.algorithmFilters.includes(Constant.ENUM_FILTER_ALGORITHM_MODE.GEOTIFF)) {
                state.algorithmFilters.push(Constant.ENUM_FILTER_ALGORITHM_MODE.GEOTIFF)
              }
              break
            case Constant.ENUM_FILTER_ALGORITHM_MODE.NONETYPE.name.toLowerCase():
              if (!state.algorithmFilters.includes(Constant.ENUM_FILTER_ALGORITHM_MODE.NONETYPE)) {
                state.algorithmFilters.push(Constant.ENUM_FILTER_ALGORITHM_MODE.NONETYPE)
              }
              break
            }
        })
      }
    },
    SET_TASK: (state, payload) => {
      state.task = payload
    },
    SET_EDIT_TASK: (state, payload) => {
      state.editTask = payload
    },
    SET_REMOVE_TASK: (state, payload) => {
      state.removeTask = payload
    },
    OPEN_ADD_MODAL: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL: (state) => {
      state.removeModal = true
    },
    CLOSE_MODAL: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    },
    setFilterAlgorithmMode(state, payload) {
      console.log('[setFilterAlgorithmMode] payload', payload)
      state.filterAlgorithmMode = payload
    }
  },
  actions: {
    async requestGetTask(context, payload, option) {
      const response = await taskAPI.fetchTask(payload, option)
      await _setResultTask(context, response)
    },
    async requestGetProject(context, payload) {
      const response = await projectAPI.getProject(payload, Constant.TASK_INFO_SUMMARY)
      await _setResultTaskList(context, response)
    },
    async requestGetProjectAll(context, payload) {
      console.log('[requestGetProjectAll] ')
      const response = await projectAPI.getProject(payload, Constant.TASK_INFO_ALL)
      if (response.status === 200) {
        response.data.tasks.sort((a, b) => {
          return ('' + b.base_date).localeCompare(a.base_date)
        })
      }
      await _setResultTaskList(context, response)
    },
    async requestCreateTask(context, payload) {
      const response = await taskAPI.createTask(payload)
      await _setResult(context, response)
    },
    async requestPatchTask(context, payload) {
      const response = await taskAPI.updateTask(payload)
      await _setResult(context, response)
    },
    async requestDeleteTask(context, payload) {
      const response = await taskAPI.deleteTask(payload)
      await _setResult(context, response)
    },
    async requestStartTask(context, payload) {
      const response = await taskAPI.startTask(payload)
      await _setResult(context, response)
    },
    async requestCancelTask(context, payload) {
      const response = await taskAPI.cancelTask(payload)
      await _setResult(context, response)
    }
  }
}
