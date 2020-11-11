import containerAPI from '@/utils/api/containerAPI'
import Constant from '@/components/common/constants.js'

const _setResult = async (context, response) => {
  console.log(`setResult: ${response}`)
  if (response.status === 401) {
    context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
    context.dispatch('requestGetContainerAll')
  }
}
const _setResultContainerList = async (context, response) => {
  if (response.status === 200) {
    const containers = response.data.containers.map((element) => {
      let container = Object.assign({id: element.id}, element)
      return container
    })
    context.commit('SET_CONTAINER_LIST', containers)
  } else if (response.status === 401 || response.status === 419) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
  }
}

export default {
  state: {
    containerList: [],

    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,

    //Edit 기능
    editContainer: {
      id: '',
      server_type: '',
      hostname: '',
      port: ''
    },
    addContainer: {
      server_type: '',
      hostname: '',
      port: ''
    },
    removeContainer: {
      id: ''
    },
    serverTypeItem: [
      Constant.CONTAINER_SERVER_TYPE_ODM,
      Constant.CONTAINER_SERVER_TYPE_SCAN,
      Constant.CONTAINER_SERVER_TYPE_NDVI,
      Constant.CONTAINER_SERVER_TYPE_THERMAL,
      Constant.CONTAINER_SERVER_TYPE_GEOTIFF,
      Constant.CONTAINER_SERVER_TYPE_AI,
    ]
  },
  getters: {
    getContainerList(state) {
      console.log(state.containerList)
      return state.containerList
    },
    isOpenAddContainerModal(state) {
      return state.addModal
    },
    isOpenEditContainerModal(state) {
      return state.editModal
    },
    isOpenRemoveContainerModal(state) {
      return state.removeModal
    },
    getAddContainer(state) {
      return state.addContainer
    },
    getEditContainer(state) {
      return state.editContainer
    },
    getRemoveContainer(state) {
      return state.removeContainer
    },
    getServerTypeItem(state) {
      return state.serverTypeItem
    }
  },
  mutations: {
    SET_CONTAINER_LIST: (state, payload) => {
      state.containerList = payload
    },
    SET_ADD_CONTAINER: (state, payload) => {
      state.addContainer = payload
    },
    SET_EDIT_CONTAINER: (state, payload) => {
      state.editContainer = payload
    },
    SET_REMOVE_CONTAINER: (state, payload) => {
      state.removeContainer = payload
    },
    OPEN_ADD_MODAL_CONTAINER: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL_CONTAINER: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL_CONTAINER: (state) => {
      state.removeModal = true
    },
    CLOSE_MODAL_CONTAINER: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    }
  },
  actions: {
    async requestGetContainerAll(context) {
      const response = await containerAPI.getContainerList()
      await _setResultContainerList(context, response)
    },
    async requestAddContainer(context, payload) {
      const response = await containerAPI.addContainer(payload)
      await _setResult(context, response)
    },
    async requestUpdateContainer(context, payload) {
      const response = await containerAPI.updateContainer(payload)
      await _setResult(context, response)
    },
    async requestDeleteContainer(context, payload) {
      const response = await containerAPI.deleteContainer(payload)
      await _setResult(context, response)
    }
  }
}
