export default {
  state: {
    imageMap: null,
    curImageWidth: '',
    curImageHeight: '',
    curImageInfo: null,
    curSelectGCP: null,
    imageGCPInfo: {},
  },
  getters: {
    gcpImageMap(state) {
      return state.imageMap
    },
    curImageInfo(state) {
      return state.curImageInfo
    },
    curGCPImageWidth(state) {
      return state.curImageWidth
    },
    curGCPImageHeight(state) {
      return state.curImageHeight
    },
    imageGCPInfo(state) {
      return state.imageGCPInfo
    },
    curSelectGCP(state) {
      return state.curSelectGCP
    }

  },
  mutations: {
    SET_GCP_IMAGE_MAP(state, payload) {
      state.imageMap = payload
    },
    SET_CURRENT_IMAGE_INFO(state, payload) {
      state.curImageInfo = payload
    },
    SET_GCP_CURRENT_IMAGE_WIDTH(state, payload) {
      state.curImageWidth = payload
    },
    SET_GCP_CURRENT_IMAGE_HEIGHT(state, payload) {
      state.curImageHeight = payload
    },
    SET_IMAGE_GCP_INFO(state, payload) {
      state.imageGCPInfo = payload
    },
    SET_CUR_SELECT_GCP(state, payload) {
      state.curSelectGCP = payload
    },

    // PUSH_IMAGE_GCP_INFO(state, payload) {
    //   state.imageGCPInfo.push(payload)
    // }
  },
  actions: {
  }
}

