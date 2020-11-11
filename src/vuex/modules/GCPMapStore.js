export default {
  state: {
    map: null,
    vectorSourceForMap: null,
  },
  getters: {
    gcpMap(state) {
      return state.map
    },
    vectorSourceForMap(state) {
      return state.vectorSourceForMap
    }
  },
  mutations: {
    SET_GCP_MAP(state, payload) {
      state.map = payload
    },
    SET_VECTOR_SOURCE_FOR_MAP(state, payload) {
      state.vectorSourceForMap = payload
    }
  },
  actions: {

  }
}

