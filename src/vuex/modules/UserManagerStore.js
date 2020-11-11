import userAPI from '@/utils/api/userAPI'

const _setResult = async (context, responseData) => {
  if (responseData.code === 401) {
    context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: responseData.code,
      modalContent: responseData.message
    })
    context.dispatch('requestGetUserAll')
  }
}
const _setResultUserList = async (context, responseData) => {
  if (responseData.code === 200) {
    const users = responseData.users.map((element) => {
      let user = Object.assign({name: element.full_name}, element)
      return user
    })
    context.commit('SET_USER_LIST', users)
  } else if (responseData.code === 401 || responseData.code === 419) {
    await context.dispatch('openGlobalModal', {})
  } else {
    await context.dispatch('openGlobalModal', {
      modalTitle: responseData.code,
      modalContent: responseData.message
    })
  }
}

export default {
  state: {
    userList: [],

    //Modal 속성
    addModal: false,
    editModal: false,
    removeModal: false,
    editPasswordModal: false,

    //Edit 기능
    editUser: {
      account_id: '',
      password: '',
      email: '',
      full_name: '',
    },
    addUser: {
      account_id: '',
      password: '',
      email: '',
      full_name: '',
    },
    removeUser: {
      account_id: '',
      password: ''
    },
    editPasswordUser: {
      password: '',
      newPassword: ''
    }
  },
  getters: {
    getUserList(state) {
      console.log(state.userList)
      return state.userList
    },
    isOpenAddUserModal(state) {
      return state.addModal
    },
    isOpenEditUserModal(state) {
      return state.editModal
    },
    isOpenRemoveUserModal(state) {
      return state.removeModal
    },
    isOpenEditPasswordUserModal(state) {
      return state.editPasswordModal
    },
    getAddUser(state) {
      return state.addUser
    },
    getEditUser(state) {
      return state.editUser
    },
    getRemoveUser(state) {
      return state.removeUser
    },
    getEditPasswordUser(state) {
      return state.editPasswordUser
    }
  },
  mutations: {
    SET_USER_LIST: (state, payload) => {
      state.userList = payload
    },
    SET_ADD_USER: (state, payload) => {
      state.addUser = payload
    },
    SET_EDIT_USER: (state, payload) => {
      state.editUser = payload
    },
    SET_REMOVE_USER: (state, payload) => {
      state.removeUser = payload
    },
    SET_EDIT_PASSWORD_USER: (state, payload) => {
      state.editPasswordUser = payload
    },
    OPEN_ADD_MODAL_USER: (state) => {
      state.addModal = true
    },
    OPEN_EDIT_MODAL_USER: (state) => {
      state.editModal = true
    },
    OPEN_REMOVE_MODAL_USER: (state) => {
      state.removeModal = true
    },
    OPEN_EDIT_PASSWORD_MODAL_USER: (state) => {
      state.editPasswordModal = true
    },
    CLOSE_MODAL_USER: (state) => {
      state.addModal = false
      state.editModal = false
      state.removeModal = false
    },
    CLOSE_EDIT_PASSWORD_MODAL_USER: (state) => {
      state.editPasswordModal = false
    },
  },
  actions: {
    async requestGetUser({commit}, payload) {
      return await userAPI.getUser(payload)
    },
    async requestGetUserAll(context) {
      const responseData = await userAPI.getUserList()
      await _setResultUserList(context, responseData)
    },
    async requestAddUser(context, payload) {
      const responseData = await userAPI.addUser(payload)
      await _setResult(context, responseData)
    },
    async requestUpdateUser(context, payload) {
      const responseData = await userAPI.updateUser(payload)
      await _setResult(context, responseData)
    },
    async requestDeleteUser(context, payload) {
      const responseData = await userAPI.deleteUser(payload)
      await _setResult(context, responseData)
    },
    async requestUpdatePasswordUser(context, {account_id, editPasswordUser}) {
      const responseData = await userAPI.updatePasswordUser({
        account_id: account_id,
        editPasswordUser: editPasswordUser
      })
      await _setResult(context, responseData)
    },
  }
}
