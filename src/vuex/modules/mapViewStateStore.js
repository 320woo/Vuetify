import * as types from '../mutation-types'

const state = {
  isMoveMyLocation: false,
  isEnableBaseMap: false,
  isEnableHybridMap: false,
  isEnable2DMap: false,
  isEnableEoMap: false,
  isEnableDsmMap: false,
  isEnableTimeline: false,
  isEnableImagePosition: false,
  opacity: 100
};

const getters = {
  isMoveMyLocation(state) {
    return state.isMoveMyLocation;
  },

  isEnableBaseMap(state) {
    return state.isEnableBaseMap;
  },

  isEnableHybridMap(state) {
    return state.isEnableHybridMap;
  },

  isEnable2DMap(state) {
    return state.isEnable2DMap;
  },

  isEnableEoMap(state) {
    return state.isEnableEoMap;
  },

  isEnableDsmMap(state) {
    return state.isEnableDsmMap;
  },

  isEnableTimeLayer(state) {
    return state.isEnableTimeline;
  },

  isEnableImagePosition(state) {
    return state.isEnableImagePosition;
  },

  getOpacity(state) {
    return state.opacity;
  }
};

const mutations = {
  [types.MAP_MY_LOCATION]: (state, payload) => {
    state.isMoveMyLocation = payload.isMoveMyLocation;
  },

  [types.MAP_VIEW_BASE_MAP]: (state, payload) => {
    state.isEnableBaseMap = payload.isEnableBaseMap;
  },

  [types.MAP_VIEW_HYBRID_MAP]: (state, payload) => {
    state.isEnableHybridMap = payload.isEnableHybridMap;
  },

  [types.MAP_VIEW_2D_MAP]: (state, payload) => {
    state.isEnable2DMap = payload.isEnable2DMap;
  },

  [types.MAP_VIEW_EO_MAP]: (state, payload) => {
    state.isEnableEoMap = payload.isEnableEoMap;
  },

  [types.MAP_VIEW_DSM_MAP]: (state, payload) => {
    state.isEnableDsmMap = payload.isEnableDsmMap;
  },

  [types.MAP_OPACITY]: (state, payload) => {
    state.opacity = payload.opacity;
  },

  [types.MAP_TIMELINE]: (state, payload) => {
    state.isEnableTimeline = payload.isEnableTimeline;
  },

  [types.MAP_IMAGE_POSITION]: (state, payload) => {
    state.isEnableImagePosition = payload.isEnableImagePosition;
  },
};


export default {
  state,
  getters,
  mutations
}
