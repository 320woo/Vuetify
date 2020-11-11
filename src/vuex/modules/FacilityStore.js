import facilityAPI from '@/utils/api/facilityAPI'

const _setResult = async (context, response) => {
  console.log(response)
  if (response.status === 200 || response.status === 204 || response.status === 201) {
    context.dispatch('requestGetFacilityAll')
  }
  else {
    await context.dispatch('openGlobalModal', {
      modalTitle: response.status,
      modalContent: response.statusText
    })
  }
}
const _setResultFacilityList = async (context, response) => {
  console.log(response)
  if (response.status === 200) {
    context.commit('SET_FACILITY_LIST', response.data)
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '시설물 정보 조회 오류'
    })
  }
}

export default {
  state: {
    facilityList: [],
    customFieldList: [],
    customFieldKeyList: [],

    isActiveCustomField: false,
    customFieldSize: 0,

    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,

    //Edit 기능
    editFacility: {
      basic_id: '',
      name: '',
      position: '',
      admin: '',
      owner: '',
      install_date: new Date().toISOString().substr(0, 10),
      lastest_date: '',
      custom_info: {},
      checkhistorys: []
    },
    addFacility: {
      basic_id: '',
      name: '',
      position: '',
      admin: '',
      owner: '',
      install_date: '',
      lastest_date: '',
      custom_info: {},
      checkhistorys: []
    },
    removeFacility: {
      basic_id: ''
    }
  },
  getters: {
    getFacilityList(state) {
      console.log(state.facilityList)
      return state.facilityList
    },
    getFacilityCustomFieldList(state) {
      console.log(state.customFieldList)
      return state.customFieldList
    },
    getFacilityCustomFieldKeyList(state) {
      console.log(state.customFieldKeyList)
      return state.customFieldKeyList
    },
    getCustomFieldSize(state) {
      return state.customFieldSize
    },
    isActiveFacilityCustomField(state) {
      console.log(state.isActiveCustomField)
      return state.isActiveCustomField
    },
    isOpenAddFacilityModal(state) {
      return state.addModal
    },
    isOpenEditFacilityModal(state) {
      return state.editModal
    },
    isOpenRemoveFacilityModal(state) {
      return state.removeModal
    },
    getAddFacility(state) {
      return state.addFacility
    },
    getEditFacility(state) {
      return state.editFacility
    },
    getRemoveFacility(state) {
      return state.removeFacility
    }
  },
  mutations: {
    SET_FACILITY_LIST: (state, payload) => {
      state.facilityList = payload
    },
    SET_CUSTOM_FIELD_LIST_FACILITY: (state, payload) => {
      state.customFieldList = payload
    },
    SET_CUSTOM_FIELD_KEY_LIST_FACILITY: (state, payload) => {
      state.customFieldKeyList= payload
    },
    SET_CUSTOM_FIELD_LIST_SIZE_FACILITY: (state, payload) => {
      state.customFieldSize = payload
    },
    SET_ADD_FACILITY: (state, payload) => {
      state.addFacility = payload
    },
    SET_EDIT_FACILITY: (state, payload) => {
      state.editFacility = payload
    },
    SET_REMOVE_FACILITY: (state, payload) => {
      state.removeFacility = payload
    },
    SET_IS_ACTIVE_CUSTOM_FIELD: (state, payload) => {
      state.isActiveCustomField = payload
    },
    OPEN_ADD_MODAL_FACILITY: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL_FACILITY: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL_FACILITY: (state) => {
      state.removeModal = true
    },
    CLOSE_MODAL_FACILITY: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    },
  },
  actions: {
    async requestGetFacilityAll(context) {
      const response = await facilityAPI.getFacilityList()
      await _setResultFacilityList(context, response)
    },
    async requestAddFacility(context, payload) {
      const response = await facilityAPI.createFacility(payload)
      await _setResult(context, response)
    },
    async requestUpdateFacility(context, payload) {
      const response = await facilityAPI.updateFacility(payload)
      await _setResult(context, response)
    },
    async requestDeleteFacility(context, payload) {
      const response = await facilityAPI.deleteFacility(payload)
      await _setResult(context, response)
    },
    async requestGetCustomFieldsFacility({commit}) {
      const customFieldList = await facilityAPI.getCustomFieldsFacility()
      await commit('SET_CUSTOM_FIELD_LIST_FACILITY', customFieldList)

      let keyList = await []
      await customFieldList.forEach((element) => { keyList.push(element.column_name) })
      console.log(keyList)
      await commit('SET_CUSTOM_FIELD_KEY_LIST_FACILITY', keyList)
    }
  }
}
