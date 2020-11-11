import Constants from '../../components/common/constants'
import * as types from '../mutation-types'
import UtilsAPI from '@/utils/api/utilsAPI';


const state = {
  calculateVolume: 0,
};

const getters = {
  getCalculateVolume(state) {
    return state.calculateVolume;
  },
};

const mutations = {
  [types.CALCULATE_VOLUME]: (state, payload) => {
    state.calculateVolume = payload.calculateVolume;
  },
};

const actions = {
  [types.CALCULATE_VOLUME]: (context, payload) => {
    UtilsAPI.calculateVolume(payload, (data) => {
      console.log("[calculateVolume] success");
      // context.commit(types.CALCULATE_VOLUME, {calculateVolume: data.volume});
      payload.callback(data.volume);
    }, () => {
      console.log("[calculateVolume] fail");
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}
