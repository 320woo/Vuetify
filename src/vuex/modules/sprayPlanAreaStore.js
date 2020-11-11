export default {
  state: {
    currentSelectedSprayPlanArea: null,
    sprayPlanAreaList: []
  },

  getters: {
    getCurrentSelectedSprayPlanArea(state) {
      return state.currentSelectedSprayPlanArea
    },
    getSprayPlanAreaList(state) {
      return state.sprayPlanAreaList
    }
  },

  mutations: {
    setCurrentSelectedSprayPlanArea(state, payload) {
      console.log('[setCurrentSelectedSprayArea] payload : ', payload)
      if (payload.id !== null) {
        console.log('[setCurrentSelectedSprayArea] sprayPlanAreaList : ', state.sprayPlanAreaList)
        let content = state.sprayPlanAreaList.find((item) => {
          return item.id === payload.id
        })
        console.log('[setCurrentSelectedSprayArea] content ', content)
        state.currentSelectedSprayPlanArea = content
      } else {
        state.currentSelectedSprayPlanArea = null
      }
    },
    setSprayPlanAreaList(state, payload) {
      state.sprayPlanAreaList = payload
    },
    addSprayPlanArea(state, payload) {
      if (state.sprayPlanAreaList == null) {
        state.sprayPlanAreaList = []
      }
      state.sprayPlanAreaList.push(payload)
    },
    removeSprayPlanArea(state, payload) {
      let index = state.sprayPlanAreaList.findIndex((date) => {
        return date.id === payload
      })

      if (index >= 0) {
        state.sprayPlanAreaList.splice(index, 1)
      }
    },
    clearSprayPlanArea(state, payload) {
      state.sprayPlanAreaList.splice(0, state.sprayPlanAreaList.length)
    }
  }
}
