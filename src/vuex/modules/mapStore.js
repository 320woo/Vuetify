import Constants from '../../components/common/constants'
import * as types from '../mutation-types'
import axios from 'axios'

const TOOLS_MODE = [
  Constants.MODE_MAP_TOOL_NONE,
  Constants.MODE_MAP_TOOL_DISTANCE,
  Constants.MODE_MAP_TOOL_METRIC,
  Constants.MODE_MAP_TOOL_VOLUME,
  Constants.MODE_MAP_TOOL_MARKER,
  Constants.MODE_MAP_TOOL_WAYPOINT_PLAN,
  Constants.MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN,
  Constants.MODE_MAP_TOOL_ANALYSIS_SPAY_DIFFERENT_PLAN,
  Constants.MODE_MAP_TOOL_SPAY_BASE_PLAN,
  Constants.MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN];

function parsingUrl(url, projectId, tasksId) {
  return Constants.TMS_SERVER_URL + url.toString()
    .replace(Constants.PROJECTS_ID, projectId)
    .replace(Constants.TASKS_ID, tasksId)
}

function requestGetTileJson(context, projectId, taskInfo, mapMode) {
  let tile_type
  switch (mapMode) {
    case 1: tile_type = Constants.GET_TILE_JSON; break
    case 2: tile_type = Constants.GET_NDVI_TILE_JSON; break
    case 3: tile_type = Constants.GET_DSM_TILE_JSON; break    
    case 4: tile_type = Constants.GET_EO_TILE_JSON; break
    default: tile_type = Constants.GET_TILE_JSON; break
  }
  let url = parsingUrl(tile_type, projectId, taskInfo);
  console.log("[getMapLayer] url : " + url);

  // VWorld 데이터 정보 가져오기 처리
  // let testUrl = 'http://api.vworld.kr/req/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=LT_C_UQ111&BBOX=14301253.09249198,4255581.790985889,14301255.481149115,4255584.179643023&PROPERTYNAME=MNUM,SIDO_CD,SIGUNGU_CD,DYEAR,DNUM,UCODE,BON_BUN,BU_BUN,UNAME,SIDO_NAME,SIGG_NAME,AG_GEOM&VERSION=1.1.0&MAXFEATURES=1&SRSNAME=EPSG:900913&OUTPUT=text/xml;subType=gml/3.1.1/profiles/gmlsf/1.0.0/0&EXCEPTIONS=text/xml&SORTBY=DYEAR&KEY=A91904A4-2131-3FE1-BD71-5DBE051C7139';
  // let invocation = new XMLHttpRequest();
  // if (invocation) {
  //   console.log("[Test] send : ");
  //   invocation.open('GET', testUrl, true);
  //   invocation.onreadystatechange = () => {
  //     console.log("[Test] response : ", invocation.response);
  //   };
  //   invocation.send();
  // }

  return axios.get(url).then((response) => {
    console.info("[getMapLayer] response :  " + JSON.stringify(response.data));
    context.commit(types.MAP_LAYER, {layer: response.data});
  })
}

// const state = ;
//
// const getters =

export default {
  state: {
    mapToolMode: TOOLS_MODE[0],
    mapFeatureRemove: false,
    mapLayerList: [],
    selectProjectId: null,
    selectTaskId: null,
    selectedFeature: null,
    mapMode: 1
  },
  getters: {
    getToolMode(state) {
      return state.mapToolMode;
    },

    getLayerList(state) {
      return state.mapLayerList;
    },

    isMapFeatureRemove(state) {
      return state.mapFeatureRemove
    },

    getProjectId(state) {
      return state.selectProjectId;
    },

    getSelectTaskId(state) {
      return state.selectTaskId;
    },

    getSelectedFeature(state) {
      return state.selectedFeature;
    }
  },

  mutations: {
    [types.MAP_TOOL_MODE]: (state, payload) => {
      state.mapToolMode = TOOLS_MODE[payload.mode];
    },

    setMapFeatureRemove(state, payload) {
      console.log("[setMapFeatureRemove] payload : " + payload)
      state.mapFeatureRemove = payload
    },

    [types.MAP_LAYER]: (state, payload) => {
      if (payload.layer["returnCode"]) {
        if (payload.layer["returnCode"] !== 0) {
          console.log("[MAP_LAYER] returnCode" + payload.layer["returnCode"]);
          return;
        }
      }
      console.log('tiles:' + payload.layer['tiles'])
      state.mapLayerList.pop()
      state.mapLayerList.push(payload.layer);
    },

    [types.MAP_LAYER_LIST]: (state, payload) => {
      state.mapLayerList = payload.layerList;
      state.mapMode = payload.mapMode
    },

    [types.MAP_LAYER_LIST_CLEAR]: (state) => {
      state.mapLayerList.splice(0, state.mapLayerList.length);
    },

    [types.SELECT_PRODUCT_ID]: (state, payload) => {
      state.selectProjectId = payload.projectId;
    },

    [types.SELECT_TASK_ID]: (state, payload) => {
      state.selectTaskId = payload.taskId;
    },

    [types.MAP_SELECTED_FEATURE]: (state, payload) => {
      state.selectedFeature = payload;
    },
  },

  actions: {
    [types.MAP_LAYER_LIST]: (context, payload) => {
      if (payload.tasksInfo instanceof Array) {
        payload.tasksInfo.forEach((taskInfo) => {
          console.log('mapMode: ' + payload.mapMode)
          requestGetTileJson(context, payload.projectId, taskInfo.task_id, payload.mapMode);
        });
      } else {
        requestGetTileJson(context, payload.projectId, payload.tasksInfo, payload.mapMode);
      }
    }
  }
}
