import Constants from '../../components/common/constants'
import * as types from '../mutation-types'
import MarkerApi from '@/utils/api/markerAPI';


function dateSorting(a, b) {
  if (a.created_at > b.created_at) {
    return 1;
  } else if (a.created_at < b.created_at) {
    return -1;
  } else {
    return 0;
  }
}

const state = {
  showContents: true,
  availableDsmTiff: true,
  currentViewContent: null,
  contentList: [],
};

const getters = {
  isShowContent(state) {
    return state.showContents;
  },

  isAvailableDsmTiff(state) {
    return state.availableDsmTiff;
  },

  getCurrentViewContent(state) {
    return state.currentViewContent;
  },

  getContentList(state) {
    return state.contentList;
  },

};

const mutations = {
  [types.SHOW_CONTENT]: (state, payload) => {
    state.showContents = payload.showContents;
  },

  [types.AVAILABLE_DSM_TIFF]: (state, payload) => {
    state.availableDsmTiff = payload.availableDsmTiff;
  },

  [types.SET_MARKER_CONTENT]: (state, payload) => {
    let markerId = payload.content ? payload.content.marker_id : payload.marker_id;
    let index = state.contentList.findIndex((item) => {
      return item.marker_id === markerId;
    });

    if (payload.content) {
      state.contentList.splice(index, 1, payload.content);
    } else {
      let content = state.contentList[index];
      content.title = payload.title;
    }
  },

  [types.SET_MARKER_CONTENT_LIST]: (state, payload) => {
    let contentList = [];
    payload.contentList.forEach((item) => {
      item.comments.sort(dateSorting);
      contentList.push(item);
    });
    state.contentList = contentList;
  },

  [types.SET_CURRENT_MARKER_CONTENT]: (state, payload) => {
    if (payload.markerId !== null) {
      let content = state.contentList.find((item) => {
        // console.log("[find] item.marker_id : " + item.marker_id);
        // console.log("[find] payload.markerId : " + payload.markerId);
        return item.marker_id === payload.markerId;
      });
      console.log("[types.SET_CURRENT_MARKER_CONTENT] content ", content);
      state.currentViewContent = content
    } else {
      state.currentViewContent = null;
    }
  },

  [types.ADD_MARKER]: (state, payload) => {
    state.contentList.push(payload.content);
  },

  [types.CLEAR_MARKER_LIST]: (state, payload) => {
    state.contentList.splice(0, state.contentList.length)
  },

  [types.ADD_MARKER_COMMENT]: (state, payload) => {
    let index = state.contentList.findIndex((item) => {
      return item.marker_id === payload.markerId;
    });
    console.log("[types.ADD_MARKER_COMMENT] content ", state.contentList[index]);
    state.contentList[index].comments.push(payload.content);
  },

  [types.SET_MARKER_COMMENT_LIST]: (state, payload) => {
    payload.commentList.sort(dateSorting);

    let index = state.contentList.findIndex((item) => {
      return item.marker_id === payload.markerId;
    });
    state.contentList[index].comments.splice(0, state.contentList[index].comments.length);
    Array.prototype.push.apply(state.contentList[index].comments, payload.commentList);
  },
};

const actions = {
  [types.ADD_MARKER]: (context, payload) => {
    MarkerApi.addMarker(payload, (data) => {
      console.log("[addMarker] success");
      context.commit(types.ADD_MARKER, {content: data});
      context.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: data.marker_id});
      payload.callback(data.marker_id);
    }, () => {
      console.log("[addMarker] fail");
    });
  },

  [types.UPDATE_MARKER]: (context, payload) => {
    MarkerApi.updateMarker(payload, (data) => {
      console.log("[updateMarker] success");
      context.commit(types.SET_MARKER_CONTENT, {
        // content: data,
        marker_id: data.marker_id,
        title: data.title
      });
      context.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: data.marker_id});
    }, () => {
      console.log("[updateMarker] fail");
    });
  },

  [types.GET_MARKER_LIST]: (context, payload) => {
    MarkerApi.getMarkerList(payload, (data) => {
      console.log("[getMarkerList] success");
      context.commit(types.SET_MARKER_CONTENT_LIST, {contentList: data});
    }, () => {
      console.log("[getMarkerList] fail");
    });
  },

  [types.DELETE_MARKER]: (context, payload) => {
    MarkerApi.deleteMarker(payload, (data) => {
      console.log("[deleteMarker] success");
      context.dispatch(types.GET_MARKER_LIST, payload);
      context.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: null});
    }, () => {
      console.log("[deleteMarker] fail");
    });
  },

  [types.ADD_MARKER_COMMENT]: (context, payload) => {
    MarkerApi.addMarkerComment(payload, (data) => {
      console.log("[addMarkerComment] success");
      context.commit(types.ADD_MARKER_COMMENT, {
        markerId: payload.marker_id,
        content: data
      });
    }, () => {
      console.log("[addMarkerComment] fail");
    });
  },

  [types.UPDATE_MARKER_COMMENT]: (context, payload) => {
    MarkerApi.updateMarkerComment(payload, (data) => {
      console.log("[updateMarkerComment] success");
      // context.commit(types.SET_MARKER_CONTENT, {content: data});
      // context.commit(types.SET_CURRENT_MARKER_CONTENT, {markerId: data.marker_id});
    }, () => {
      console.log("[updateMarkerComment] fail");
    });
  },

  [types.GET_MARKER_LIST]: (context, payload) => {
    MarkerApi.getMarkerList(payload, (data) => {
      console.log("[getMarkerList] success");
      context.commit(types.SET_MARKER_CONTENT_LIST, {contentList: data});
    }, () => {
      console.log("[getMarkerList] fail");
    });
  },

  [types.GET_MARKER_COMMENT_LIST]: (context, payload) => {
    MarkerApi.getMarkerComment(payload, (data) => {
      console.log("[getMarkerComment] success");
      context.commit(types.SET_MARKER_COMMENT_LIST, {
        markerId: payload.marker_id,
        commentList: data
      });
    }, () => {
      console.log("[getMarkerComment] fail");
    });
  },

  [types.DELETE_MARKER_COMMENT]: (context, payload) => {
    MarkerApi.deleteMarkerComment(payload, (data) => {
      console.log("[deleteMarkerComment] success");
      context.dispatch(types.GET_MARKER_COMMENT_LIST, payload);
    }, () => {
      console.log("[deleteMarkerComment] fail");
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
