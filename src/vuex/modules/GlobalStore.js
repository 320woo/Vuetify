import Constant from '@/components/common/constants'
import router from '@/router/index'

export default {
  state: {
    isMobileBrowser: false,
    isOpenGlobalModal: false,
    modalTitle: '',
    modalContent: ''
  },
  getters: {
    isMobileBrowser(state) {
      return state.isMobileBrowser
    },
    isOpenGlobalModal(state) {
      return state.isOpenGlobalModal
    },
    getGlobalModalTitle(state) {
      return state.modalTitle
    },
    getGlobalModalContent(state) {
      return state.modalContent
    }
  },
  mutations: {
    IS_MOBILE_BROWSER: (state, payload) => {
      state.isMobileBrowser = payload
    },
    OPEN_GLOBAL_MODAL: (state) => {
      state.isOpenGlobalModal = true
    },
    CLOSE_GLOBAL_MODAL: (state) => {
      state.isOpenGlobalModal = false
    },
    SET_GLOBAL_MODAL_TITLE: (state, payload) => {
      state.modalTitle = payload
    },
    SET_GLOBAL_MODAL_CONTENT: (state, payload) => {
      state.modalContent = payload
    },
  },
  actions: {
    async openGlobalModal({commit}, {
      modalTitle = Constant.SESSION_EXPIRE_MODAL_TITLE,
      modalContent = Constant.SESSION_EXPIRE_MODAL_CONTENT
    }) {
      await commit('SET_GLOBAL_MODAL_TITLE', modalTitle)
      await commit('SET_GLOBAL_MODAL_CONTENT', modalContent)
      commit('OPEN_GLOBAL_MODAL')
    },
    async closeGlobalModal(context) {
      if (context.getters.getGlobalModalTitle === (Constant.SESSION_EXPIRE_MODAL_TITLE)) {
        let redirect = router.currentRoute.fullPath
        if (router.currentRoute.name === 'login') {
          redirect = router.currentRoute.query.redirect
        }
        await router.replace({
          name: 'login',
          query: {redirect: redirect}
        })
        context.commit('CLOSE_GLOBAL_MODAL')
      } else {
        context.commit('CLOSE_GLOBAL_MODAL')
      }
    }
  }
}
