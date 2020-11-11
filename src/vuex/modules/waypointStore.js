export default {
  state: {
    waypointList: [],
    waypointResultList: [],
    sprayResultList: []
  },

  getters: {
    getWaypointList(state) {
      return state.waypointList
    },
    getWaypointResultList(state) {
      return state.waypointResultList
    },
    getSprayResultList(state) {
      return state.sprayResultList
    }
  },

  mutations: {
    setWaypointList: (state, payload) => {
      state.waypointList = payload
    },
    addWaypointList: (state, payload) => {
      state.waypointList.push(payload)
    },
    clearWaypointList(state) {
      state.waypointList = []
    },

    setWaypointResultList: (state, payload) => {
      state.waypointResultList = payload
    },
    addWaypointResultList: (state, payload) => {
      state.waypointResultList.push(payload)
    },
    clearWaypointResultList(state) {
      state.waypointResultList = []
    },

    setSprayResultList: (state, payload) => {
      state.sprayResultList = payload
    },
    addSprayResultList: (state, payload) => {
      state.sprayResultList.push(payload)
    },
    clearSprayResultList(state) {
      state.sprayResultList = []
    },
  }
}
