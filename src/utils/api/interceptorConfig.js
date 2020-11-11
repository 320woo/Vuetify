// import axios from 'axios'

export default (axios, store) => {
  axios.interceptors.response.use(
    (response) => {
      console.log("전역 Interceptor Response", response)

      if (response.status === 401) {
        console.log("로그인 세션 만료")
        store.dispatch('openGlobalModal', {})
      }

      return response
    }
  )
}
