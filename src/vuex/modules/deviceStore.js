import * as types from '../mutation-types'
import DeviceApi from '@/utils/api/deviceAPI';

const state = {
  selectedDeviceId: "",
  deviceInfoList: [],
  sensorInfoList: []
};

const getters = {
  getSelectedDeviceInfo(state) {
    return state.selectedDeviceId;
  },
  getDeviceInfoList(state) {
    return state.deviceInfoList;
  },

  getSensorInfoList(state) {
    return state.sensorInfoList;
  }
};

const mutations = {
  [types.ADD_IOT_DEVICE]: (state, payload) => {
    state.deviceInfoList.push(payload.content);
  },

  [types.UPDATE_IOT_DEVICE]: (state, payload) => {
    let index = state.deviceInfoList.findIndex((item) => {
      return item.deviceid === payload.content.deviceid;
    });

    if (payload.content) {
      state.deviceInfoList.splice(index, 1, payload.content);
    }
  },

  // [types.GET_IOT_DEVICE]: (state, payload) => {
  //   state.deviceInfoList = payload.deviceInfoList;
  // },

  [types.GET_IOT_DEVICE_LIST]: (state, payload) => {
    state.deviceInfoList = payload.content;
  },

  [types.DELETE_IOT_DEVICE]: (state, payload) => {
    let index = state.deviceInfoList.findIndex((item) => {
      return item.deviceid === payload.deviceid;
    });

    if (index >= 0) {
      state.deviceInfoList.splice(index, 1);
    }
  },

  [types.SELECTED_IOT_DEVICE]: (state, payload) => {
    state.selectedDeviceId = payload.deviceId;
  },

  [types.GET_IOT_SENSOR]: (state, payload) => {
    state.sensorInfoList = payload.content;
  },

  // [types.GET_IOT_SENSOR_LIST]: (state, payload) => {
  //   state.deviceInfoList = payload.deviceInfoList;
  // },

  // [types.DELETE_IOT_SENSOR]: (state, payload) => {
  //   state.deviceInfoList = payload.deviceInfoList;
  // },
};

const actions = {
  [types.ADD_IOT_DEVICE]: (context, payload) => {
    DeviceApi.addDevice(payload, (data) => {
      console.log("[addDevice] success");
      context.commit(types.ADD_IOT_DEVICE, {content: data});
    }, () => {
      console.log("[addDevice] fail");
    })
  },

  [types.UPDATE_IOT_DEVICE]: (context, payload) => {
    DeviceApi.updateDevice(payload, (data) => {
      console.log("[updateDevice] success");
      context.commit(types.UPDATE_IOT_DEVICE, {content: data});
    }, () => {
      console.log("[updateDevice] fail");
    })
  },

  // [types.GET_IOT_DEVICE]: (context, payload) => {
  //   DeviceApi.getDeviceInfo(payload, (data) => {
  //     console.log("[getDeviceInfo] success");
  //     context.commit(types.GET_IOT_DEVICE, {content: data});
  //   }, () => {
  //     console.log("[getDeviceInfo] fail");
  //   })
  // },

  [types.GET_IOT_DEVICE_LIST]: (context, payload) => {
    DeviceApi.getDeviceList((data) => {
      console.log("[getDeviceList] success");
      context.commit(types.GET_IOT_DEVICE_LIST, {content: data});
      if (payload.callback) {
        payload.callback(true);
      }
    }, () => {
      console.log("[getDeviceList] fail");
      if (payload.callback) {
        payload.callback(false);
      }
    })
  },

  [types.DELETE_IOT_DEVICE]: (context, payload) => {
    DeviceApi.deleteDevice(payload, (data) => {
      console.log("[deleteDevice] success");
      context.commit(types.DELETE_IOT_DEVICE, {content: payload.deviceid});
      context.dispatch(types.GET_IOT_DEVICE_LIST, {});
      if (payload.callback) {
        payload.callback(true);
      }
    }, () => {
      console.log("[deleteDevice] fail");
      if (payload.callback) {
        payload.callback(false);
      }
    })
  },

  [types.GET_IOT_SENSOR]: (context, payload) => {
    DeviceApi.getSensorInfo(payload, (data) => {
      console.log("[getSensorInfo] success");
      context.commit(types.GET_IOT_SENSOR, {content: data});
    }, () => {
      console.log("[getSensorInfo] fail");
    })
  },

  // [types.GET_IOT_SENSOR_LIST]: (context, payload) => {
  //   DeviceApi.getSensorInfoList(payload, (data) => {
  //     console.log("[getSensorInfoList] success");
  //     context.commit(types.GET_IOT_SENSOR_LIST, {content: data});
  //   }, () => {
  //     console.log("[getSensorInfoList] fail");
  //   })
  // },

  // [types.DELETE_IOT_SENSOR]: (context, payload) => {
  //   DeviceApi.deleteSensorInfo(payload, (data) => {
  //     console.log("[deleteSensorInfo] success");
  //     context.commit(types.DELETE_IOT_SENSOR, {content: payload.deviceid});
  //   }, () => {
  //     console.log("[deleteSensorInfo] fail");
  //   })
  // },
};

export default {
  state,
  getters,
  mutations,
  actions
}
