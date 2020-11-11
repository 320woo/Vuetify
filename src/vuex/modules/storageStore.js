import storageAPI from '@/utils/api/storageAPI'
import Constant from '@/components/common/constants'
import * as types from '@/vuex/mutation-types'

const _setResult = async (context, response, key, value) => {
  // console.log("[requestGetStorageFileList] _setResult : in ", response.status)
  if (response.status === 200) {
    // console.log("[requestGetStorageFileList] _setResult : ", value)
    await context.commit(key, value)
  } else if (response.status === 401) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '파일 정보 조회 오류'
    })
  }
}


export default {
  state: {
    storagefileList : [],
    storagereportfileList : [],
    // uploadFiles: [],
  },
  getters: {
    getStorageList(state) {
      // console.log("[requestGetStorageFileList] getStorageList : ", state.storagefileList);
      return state.storagefileList
    },
    getStorageReportList(state) {
      // console.log("[requestGetStorageFileList] getStorageList : ", state.storagefileList);
      return state.storagereportfileList
    },

    // getUploadFiles(state) {
    //   return state.uploadFiles
    // }
  },
  mutations: {
    SET_STORAGEFILE_LIST(state, payload) {
      // console.log("[requestGetStorageFileList] SET_STORAGEFILE_LIST : ", payload);
      state.storagefileList = payload
    },

    SET_STORAGEREPORTFILE_LIST(state, payload) {
      // console.log("[requestGetStorageFileList] SET_STORAGEFILE_LIST : ", payload);
      state.storagereportfileList = payload
    },

    // [types.SET_UPLOAD_FILES](state, payload) {
    //   state.uploadFiles = payload
    // },

    // [types.ADD_UPLOAD_FILE](state, payload) {
    //   state.uploadFiles.push(payload)
    // },

    // [types.CLEAR_UPLOAD_FILES](state, payload) {
    //   state.uploadFiles.splice(0, state.uploadFiles.length)
    // },

    // [types.DELETE_UPLOAD_FILE](state, payload) {
    //   state.uploadFiles.splice(payload.index, 1)
    // },
  },
  actions: {
    async requestGetStorageFileList(context, stroageIds) {
      console.log("[requestGetStorageFileList] reqeust : ", stroageIds);
      if (stroageIds == null) {
        console.log("[requestGetStorageFileList] request storageIds is null");
        const response = {}
        response.status = 200
        await _setResult(context, response, 'SET_STORAGEFILE_LIST', [])
        return
      }
      const response = await storageAPI.searchImagesByStorageIds(stroageIds)
      // console.log("[requestGetStorageFileList] response : ", response);
      await _setResult(context, response, 'SET_STORAGEFILE_LIST', response.data.files)
    },
    async requestGetStorageReportFileList(context, stroageIds) {
      console.log("[requestGetStorageReportFileList] reqeust : ", stroageIds);
      if (stroageIds == null) {
        console.log("[requestGetStorageReportFileList] request storageIds is null");
        const response = {}
        response.status = 200
        await _setResult(context, response, 'SET_STORAGEREPORTFILE_LIST', [])
        return
      }
      const response = await storageAPI.searchFilesByStorageIds(stroageIds)
      // console.log("[requestGetStorageReportFileList] response : ", response);
      await _setResult(context, response, 'SET_STORAGEREPORTFILE_LIST', response.data.files)
    },
  }
}
