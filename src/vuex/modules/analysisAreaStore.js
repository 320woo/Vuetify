export default {
  state: {
    currentSelectedArea: null,
    analysisAreaList: []
  },

  getters: {
    getCurrentSelectedArea(state) {
      return state.currentSelectedArea
    },
    getAnalysisAreaList(state) {
      return state.analysisAreaList
    }
  },

  mutations: {
    setCurrentSelectedArea(state, payload) {
      console.log('[setCurrentSelectedArea] payload : ', payload)
      if (payload.id !== null) {
        console.log('[setCurrentSelectedArea] analysisAreaList : ', state.analysisAreaList)
        let content = state.analysisAreaList.find((item) => {
          return item.id === payload.id
        })
        console.log('[setCurrentSelectedArea] content ', content)
        state.currentSelectedArea = content
      } else {
        state.currentSelectedArea = null
      }
    },
    setAnalysisAreaList(state, payload) {
      state.analysisAreaList = payload
    },
    addAnalysisArea(state, payload) {
      state.analysisAreaList.push(payload)
    },
    removeAnalysisArea(state, payload) {
      let index = state.analysisAreaList.findIndex((date) => {
        return date.id === payload
      })

      if (index >= 0) {
        state.analysisAreaList.splice(index, 1)
      }
    },
    clearAnalysisArea(state, payload) {
      state.analysisAreaList.splice(0, state.analysisAreaList.length)
    }
  }
}
