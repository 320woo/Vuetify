export default {
  state: {
    currentIndex: 0
  },
  getters: {
    getCurrentIndex(state) {
      return state.currentIndex;
    }
  },
  mutations: {
    setCurrentIndex(state, payload) {
      console.log("[setCurrentIndex] mutation : payload : " ,payload)
      state.currentIndex = payload.index;
    }
  }
}
