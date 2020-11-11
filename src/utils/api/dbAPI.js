import axios from "axios";
import router from '@/router'
import Constants from "@/components/common/constants";

const query = (name, params) => {
  const logined = router.app.$session && router.app.$session.get('account_id')
  console.log('auth_required query req:', name, params || {})
  return axios.post(`${Constants.DB_SERVER_URL}/private/query`,
    {
      "name": name,
      "params": params || {}
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      console.log('query res:', name, response)
      return response.data
    })
}

const publicQuery = (name, params) => {
  console.log('public query req:', name, params || {})
  return axios.post(`${Constants.DB_SERVER_URL}/public/query`,
    {
      "name": name,
      "params": params || {}
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      console.log('query res:', name, response)
      return response.data
    })
}

export default {
  query,
  publicQuery
}
