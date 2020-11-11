export default {
  state: {
    areaList: [],
    areaSize: [],
  },

  getters: {
    getAreaList(state) {
      return state.areaList
    },

    getAreaSize(state) {
      return state.areaSize
    }
  },

  mutations: {
    setAreaList(state, payload) {
      state.areaList = payload
    },

    addAreaList(state, payload) {
      state.areaList.push(payload)
    },

    addAreaSize(state, payload) {
      state.areaSize.push(payload)
    },

    removeAreaItem(state, payload) {
      console.log("[removeAreaItem] state.areaList : ", state.areaList)
      let index = state.areaList.findIndex(item => {
        console.log("[removeAreaItem] item :", item)
        console.log("[removeAreaItem] payload.id : " + payload.id + ", item.id : " + item.id)
        return payload.id === item.id
      })

      if (index >= 0) {
        state.areaList.splice(index, 1)
      }
    },

    clearAreaList(state) {
      state.areaList = []
    },

    clearAreaSize(state) {
      state.areaSize = 0
    }
  }
}
