import fileAPI from '@/utils/api/fileAPI'
import Constant from '@/components/common/constants'
import * as types from '@/vuex/mutation-types'
import StringUtils from '@/utils/utils/stringUtil'

const _setResult = async (context, response, key, value) => {
  if (response.status === 200) {
    console.log(value)
    await context.commit(key, value)
  } else if (response.status === 401) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: '오류',
      modalContent: '이미지 파일 정보 조회 오류'
    })
  }
}


export default {
  state: {
    imageList: [],
    projectImageList: {},
    imageInfoList: [],
    uploadFiles: []
  },
  getters: {
    getImageList(state) {
      return state.imageList
    },

    getProjectImageList(state) {
      return state.projectImageList
    },

    getImageInfoList(state) {
      return state.imageInfoList
    },

    getUploadFiles(state) {
      return state.uploadFiles
    }
  },
  mutations: {
    SET_IMAGE_LIST(state, payload) {
      state.imageList = payload
    },

    SET_PROJECT_IMAGE_LIST(state, payload) {
      state.projectImageList = payload
      state.imageInfoList = state.projectImageList[Object.keys(state.projectImageList)[0]]
    },

    SET_IMAGE_INFO_LIST(state, payload) {
      state.imageInfoList = payload
    },

    setTaskOfProjectImageInfo(state, payload) {
      if (state.projectImageList[payload] !== undefined) {
        state.imageInfoList = state.projectImageList[payload]
      }
    },

    [types.SET_UPLOAD_FILES](state, payload) {
      state.uploadFiles = payload
    },

    [types.ADD_UPLOAD_FILE](state, payload) {
      state.uploadFiles.push(payload)
    },

    [types.CLEAR_UPLOAD_FILES](state, payload) {
      state.uploadFiles.splice(0, state.uploadFiles.length)
    },

    [types.DELETE_UPLOAD_FILE](state, payload) {
      state.uploadFiles.splice(payload.index, 1)
    },

    clearImageInfoList(state) {
      state.imageInfoList.splice(0, state.imageInfoList.length)
    }
  },
  actions: {
    async requestGetImageFileList(context, { projectId, taskId }) {
      console.log('[requestGetImageFileList] ')
      const response = await fileAPI.fetchTaskFileList({ projectId: projectId, taskId: taskId })
      console.log('[requestGetImageFileList] response : ', response)
      await _setResult(context, response, 'SET_IMAGE_LIST', response.data.files)
    },

    async requestGetProjectImageFileList(context, { tasks }) {
      let dataTaskFiles = {}
      let response
      if (tasks.length == 0) return;
      for (const data of tasks) {
        response = await fileAPI.getFileInfoList(data.taskfiles.storagefiles)
        dataTaskFiles[data.task_id] = response.data.files
      }

      console.log('[requestGetProjectImageFileList] dataTaskFiles : ', dataTaskFiles)
      await _setResult(context, response, 'SET_PROJECT_IMAGE_LIST', dataTaskFiles)
    },

    async requestGetFileSearchList(context, storageIds) {
      if (storageIds == null || storageIds.length == 0) return;
      const response = await fileAPI.getFileInfoList(storageIds)
      console.log('[requestGetFileSearchList] response : ', response)
      await _setResult(context, response, 'SET_IMAGE_INFO_LIST', response.data.files)
    }
  }
}
