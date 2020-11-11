import axios from "axios";
import Constants from "@/components/common/constants";

// axios.interceptors.response.use(
//   (response) => {
//     return response
//   }
//   ,(error) => {
//     return error
//   }
// )

axios.defaults.withCredentials = true

const login = (id, password) => {
  console.log(id, password)
  return axios.post(`${Constants.AUTH_URL}/users/${id}/signin/`,
    {
      "password": password,
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      console.log(response)
      return response.data
    })
}

const logout = (account_id) => {
  return axios.get(`${Constants.AUTH_URL}/users/${account_id}/signout/`)
    .then((response) => {
      return response.data
    })
}


const confirmAccessToken = (jwt, id) => {
  return axios.get(`${Constants.AUTH_URL}/users/${id}/me/`,
    {
      // headers: {
      // 'Authorization': jwt
      // }
    })
    .then((response) => {
      console.log(response)
      return response.data
    })
}

const confirmAccountAuth = (id) => {
  return axios.get(`${Constants.AUTH_URL}/users/${id}/`)
}

export default {
  login,
  logout,
  confirmAccessToken,
  confirmAccountAuth
}
