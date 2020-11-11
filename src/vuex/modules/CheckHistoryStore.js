import checkHistoryAPI from '@/utils/api/checkHistoryAPI'
import facilityAPI from '@/utils/api/facilityAPI'

const _setResult = async (context, response) => {
  console.log(response)
  if (response.status === 200 || response.status === 204 || response.status === 201 || response.status === 206 ) {
    context.dispatch('requestGetCheckHistoryAll', context.getters.getFacility.basic_id)
  }
  else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
  }
}
const _setResultCheckHistoryList = async (context, response) => {
  console.log(response)
  if (response.status === 200) {
    context.commit('SET_CHECK_HISTORY_LIST', response.data)
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '작업내역 조회 오류'
    })
  }
}

export default {
  state: {
    facility: {},
    checkHistoryList: [],
    customFieldList: [],
    customFieldKeyList: [],

    isActiveCustomField: false,
    customFieldSize: 0,

    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,

    //Edit 기능
    editCheckHistory: {
      checkhistory_id: "",
      checker: "",
      check_date: "",
      check_type: "",
      check_detail: "",
      custom_info: {}
    },
    addCheckHistory: {
      checkhistory_id: "",
      checker: "",
      check_date: "",
      check_type: "",
      check_detail: "",
      custom_info: {}
    },
    removeCheckHistory: {
      basic_id: '',
      checkhistory_id: ''
    }
  },
  getters: {
    getFacility(state) {
      console.log(state.facility)
      return state.facility
    },
    getCheckHistoryList(state) {
      console.log(state.checkHistoryList)
      return state.checkHistoryList
    },
    getCheckHistoryCustomFieldList(state) {
      console.log(state.customFieldList)
      return state.customFieldList
    },
    getCheckHistoryCustomFieldKeyList(state) {
      console.log(state.customFieldKeyList)
      return state.customFieldKeyList
    },
    getCheckHistoryCustomFieldSize(state) {
      return state.customFieldSize
    },
    isActiveCheckHistoryCustomField(state) {
      console.log(state.isActiveCustomField)
      return state.isActiveCustomField
    },
    isOpenAddCheckHistoryModal(state) {
      return state.addModal
    },
    isOpenEditCheckHistoryModal(state) {
      return state.editModal
    },
    isOpenRemoveCheckHistoryModal(state) {
      return state.removeModal
    },
    getAddCheckHistory(state) {
      return state.addCheckHistory
    },
    getEditCheckHistory(state) {
      return state.editCheckHistory
    },
    getRemoveCheckHistory(state) {
      return state.removeCheckHistory
    }
  },
  mutations: {
    SET_FACILITY: (state, payload) => {
      state.facility = payload
    },
    SET_CHECK_HISTORY_LIST: (state, payload) => {
      state.checkHistoryList = payload
    },
    SET_CUSTOM_FIELD_LIST_CHECK_HISTORY: (state, payload) => {
      state.customFieldList = payload
    },
    SET_CUSTOM_FIELD_KEY_LIST_CHECK_HISTORY: (state, payload) => {
      state.customFieldKeyList= payload
    },
    SET_CUSTOM_FIELD_LIST_SIZE_CHECK_HISTORY: (state, payload) => {
      state.customFieldSize = payload
    },
    SET_ADD_CHECK_HISTORY: (state, payload) => {
      state.addCheckHistory = payload
    },
    SET_EDIT_CHECK_HISTORY: (state, payload) => {
      state.editCheckHistory = payload
    },
    SET_REMOVE_CHECK_HISTORY: (state, payload) => {
      state.removeCheckHistory = payload
    },
    SET_IS_ACTIVE_CUSTOM_FIELD_CHECK_HISTORY: (state, payload) => {
      state.isActiveCustomField = payload
    },
    OPEN_ADD_MODAL_CHECK_HISTORY: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL_CHECK_HISTORY: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL_CHECK_HISTORY: (state) => {
      state.removeModal = true
    },
    CLOSE_MODAL_CHECK_HISTORY: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    },
  },
  actions: {
    async requestGetFacility({commit}, payload) {
      const facility = await facilityAPI.getFacility(payload)
      commit('SET_FACILITY', facility)
    },
    async requestGetCheckHistory({commit}, payload) {
      return await checkHistoryAPI.getCheckHistory(payload)
    },
    async requestGetCheckHistoryAll(context, payload) {
      const response = await checkHistoryAPI.getCheckHistoryList(payload)
      await _setResultCheckHistoryList(context, response)
    },
    async requestAddCheckHistory(context, {basicId, checkHistory}) {
      const response = await checkHistoryAPI.createCheckHistory({basicId: basicId, checkHistory: checkHistory})
      await _setResult(context, response)
    },
    async requestUpdateCheckHistory(context, {basicId, checkHistory}) {
      const response = await checkHistoryAPI.updateCheckHistory({basicId: basicId, checkHistory: checkHistory})
      await _setResult(context, response)
    },
    async requestDeleteCheckHistory(context, {basicId, checkHistoryId}) {
      const response = await checkHistoryAPI.deleteCheckHistory({basicId: basicId, checkHistoryId: checkHistoryId})
      await _setResult(context, response)
    },
    async requestDeleteCheckHistoryImage(context, {basicId, checkHistoryId, imageId}) {
      const response = await checkHistoryAPI.deleteCheckHistoryImage({basicId: basicId, checkHistoryId: checkHistoryId, imageId: imageId})
      await _setResult(context, response)
    },
    async requestGetCustomFieldsCheckHistory({commit}) {
      const customFieldList = await checkHistoryAPI.getCustomFieldsCheckHistory()
      await commit('SET_CUSTOM_FIELD_LIST_CHECK_HISTORY', customFieldList)

      let keyList = await []
      await customFieldList.forEach((element) => { keyList.push(element.column_name) })
      console.log(keyList)
      await commit('SET_CUSTOM_FIELD_KEY_LIST_CHECK_HISTORY', keyList)
    }
  }
}
