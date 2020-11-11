import projectAPI from '@/utils/api/projectAPI'
import Constant from '@/components/common/constants.js'

const _setResult = async (context, response) => {
  console.log(response)
  if (response.status === 200 || response.status === 204 || response.status === 201) {
    context.dispatch('requestGetProjectList')
  }
  else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
  }
}
const _setResultProjectList = async (context, response) => {
  console.log(response.status)
  if (response.status === 200) {
    await context.commit('SET_PROJECT_LIST', response.data.results)
  } else if (response.status === 401) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '프로젝트 정보 조회 오류'
    })
  }
}

const getDefaultState = () => {
  return {
    projectList: [],

    //ADD, EDIT Project List
    newProject: {
      description: '',
      name: '',
    },
    editProject: {
      project_id: '',
      description: '',
      name: '',
      tasks: []
    },
    removeProjectId: '',

    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,
  }
}

const state = getDefaultState()

export default {
  state,
  getters: {
    getProjectList(state) {
      return state.projectList;
    },
    isOpenAddProjectModal(state) {
      return state.addModal
    },
    isOpenEditProjectModal(state) {
      return state.editModal
    },
    isOpenRemoveProjectModal(state) {
      return state.removeModal
    },
    getNewProject(state) {
      return state.newProject
    },
    getEditProject(state) {
      return state.editProject
    },
    getRemoveProjectId(state) {
      return state.removeProjectId
    }
  },
  mutations: {
    SET_PROJECT_LIST: (state, payload) => {
      state.projectList = payload;
    },
    SET_EDIT_PROJECT: (state, payload) => {
      state.editProject = payload
    },
    SET_REMOVE_PROJECT_ID: (state, payload) => {
      state.removeProjectId = payload
    },
    SET_ADD_PROJECT: (state, payload) => {
      state.newProject = payload
    },
    OPEN_ADD_MODAL_PROJECT: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL_PROJECT: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL_PROJECT: (state) => {
      state.removeModal = true
    },
    CLOSE_MODAL_PROJECT: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    },
    CLEAR_PROJECT_STATE: (state) => {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    async requestGetProjectList(context) {
      const response = await projectAPI.fetchProjectList(Constant.TASK_INFO_SUMMARY)
      await _setResultProjectList(context, response)
    },
    async requestGetProjectListAll(context) {
      const response = await projectAPI.fetchProjectList(Constant.TASK_INFO_ALL)
      await _setResultProjectList(context, response)
    },
    async requestAddProject(context, payload) {
      const response = await projectAPI.addProject(payload)
      await _setResult(context, response)
    },
    async requestUpdateProject(context, payload) {
      const response = await projectAPI.updateProject(payload)
      await _setResult(context, response)
    },
    async requestDeleteProject(context, payload) {
      const response = await projectAPI.deleteProject(payload)
      await _setResult(context, response)
    }
  }
}

