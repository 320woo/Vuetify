export default {
  state: {
    name: '',
    pos: -2,
    page: 1
  },

  getters: {
    getName(state) {
      return state.name
    },
    getPosition(state) {
      return state.pos
    },
    getCurPageNum(state) {
      return state.page
    }
  },

  mutations: {
    setPosition: (state, payload) => {
      state.pos = payload.pos
    },
    setPageNum: (state, payload) => {
      state.page = payload.page
    },
    clearPosition(state) {
      state.name = ''
      state.pos = 0
      state.page = 1
    }
  }
}
