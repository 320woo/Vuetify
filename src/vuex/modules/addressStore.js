import AddressAPI from '@/utils/api/addressAPI'

export default {
  state: {
    addressData: null,
    selectAddress: null,
    addressGeoData: null,
    reverseGeoData: null
  },
  getters: {
    getAddressData(state) {
      return state.addressData
    },
    getSelectedAddressInfo(state) {
      return state.selectAddress
    },
    getAddressGeoData(state) {
      return state.addressGeoData
    },
    getReverseGeoData(state) {
      return state.reverseGeoData
    }
  },
  mutations: {
    addSearchData(state, payload) {
      state.addressData = payload.content
    },

    clearSearchData(state, payload) {
      state.addressData = null
    },

    clearGeoJsonData(state, payload) {
      state.addressGeoData = null
    },

    setSelectedAddressInfo(state, payload) {
      state.selectAddress = payload
    },

    setGeoData(state, payload) {
      state.addressGeoData = payload.content
    },

    setReverseGeoData(state, payload) {
      state.reverseGeoData = payload.content
    }

  },
  actions: {
    async requestGetAddressCoordinate(context, { addressName }) {
      console.log('[requestGetAddressCoordinate] ')
      context.commit('clearSearchData', {})

      await AddressAPI.requestGetAddressCoordinate(addressName, ((data) => {
        console.log('[requestGetAddressCoordinate] success : ', data)
        context.commit('addSearchData', { content: data })

        // context.dispatch('requestGetAddressGeoData', {addressName})
      }), (() => {
        console.log('[requestGetAddressCoordinate] fail')
      }))
    },

    async requestGetAddressGeoData(context, { addressName, serviceCode, point }) {
      console.log('[requestGetAddressGeoData] ')

      await AddressAPI.requestGetAddressGeoData(addressName, serviceCode, point, ((data) => {
        console.log('[requestGetAddressGeoData] success : ', data)
        data['point'] = point
        context.commit('setGeoData', { content: data })
      }), (() => {
        console.log('[requestGetAddressGeoData] fail')
      }))
    },

    async requestGetReverseGeoData(context, { longitude, latitude }) {
      console.log('[requestGetReverseGeoData] ')

      await AddressAPI.requestGetReverseGeoData(longitude, latitude, ((data) => {
        console.log('[requestGetAddressGeoData] success : ', data)
        context.commit('setReverseGeoData', { content: data })
      }), (() => {
        console.log('[requestGetAddressGeoData] fail')
      }))
    }
  }
}
