export default {
  state: {
    missionCustomerFilter: '',
    missionAreaFilter: ''
  },

  getters: {
    getMissionCustomerFilter(state) {
      return state.missionCustomerFilter
    },

    getMissionAreaFilter(state) {
      return state.missionAreaFilter
    }
  },

  mutations: {
    setMissionCustomerFilter(state, payload) {
      state.missionCustomerFilter = payload
    },

    setMissionAreaFilter(state, payload) {
      state.missionAreaFilter = payload
    }
  }
}
