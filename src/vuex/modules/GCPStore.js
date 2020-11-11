import gcpAPI from '@/utils/api/gcpAPI'

const modalTextMap = {
  'add': {
    common: {
      title: 'GCP Interface',
      content: 'GCP 정보 저장 완료'
    },
    error: {
      title: 'GCP Interface 오류',
      content: 'GCP 정보 저장 실패'
    }
  },

}

const _setResult = (context, response, name) => {
  if (response.status === 200 || response.status === 204 || response.status === 201) {
    console.log(response, name)
    context.dispatch('openGlobalModal', {
      modalTitle: modalTextMap[name].common.title,
      modalContent: modalTextMap[name].common.content
    })
  } else if (response.status === 401) {
    context.dispatch('openGlobalModal', {})
  } else {
    context.dispatch('openGlobalModal', {
      modalTitle: modalTextMap[name].error.title,
      modalContent: modalTextMap[name].error.content
    })
  }
}

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async requestGetAllGCPInfo(context, payload) {
      await console.log('[GCPStore], requestGetAllGCPInfo RequestBody: ', payload)
      const response = await gcpAPI.requestGetAllGCPInfo(payload)
      await console.log('[GCPStore], requestGetAllGCPInfo Response: ', response)
      return response.data
    },
    async requestAddGCPInfo(context, payload) {
      await console.log('[GCPStore], requestAddGCPInfo RequestBody: ', payload)
      const response = await gcpAPI.requestAddGCPInfo(payload)
      await console.log('[GCPStore], requestAddGCPInfo Response: ', response)
      _setResult(context, response, 'add')
    },
    async requestDeleteGCPInfo(context, payload) {
      await console.log('[GCPStore], requestDeleteGCPInfo RequestBody: ', payload)
      const response = await gcpAPI.requestDeleteGCPInfo(payload)
      await console.log('[GCPStore], requestDeleteGCPInfo Response: ', response)
    },
    async requestGCPFileExport(context, payload) {
      await console.log('[GCPStore], requestGCPFileExport RequestBody: ', payload)
      const response = await gcpAPI.requestGCPFileExport(payload)
      await console.log('[GCPStore], requestGCPFileExport Response: ', response)
    }
  }
}

