import axios from "axios";
import Constants from "@/components/common/constants";

axios.interceptors.response.use(
  (response) => {
    return response
  }
  , (error) => {
    return error.response
  }
)

const getUser = (account_id) => {
  return axios.get(`${Constants.AUTH_URL}/users/${account_id}`)
    .then((response) => {
      return response.data
    })
}

const getUserList = () => {
  return axios.get(`${Constants.AUTH_URL}/admin/users`)
    .then((response) => {
      return response.data
    })
}

const addUser = (user) => {
  return axios.post(`${Constants.AUTH_URL}/users`,
    {
      'account_id': user.account_id,
      'password': user.password,
      'email': user.email,
      'full_name': user.full_name,
      'user_type': user.user_type,
      'tel_num': user.tel_num,
      'post_num': user.post_num,
      'address_basic': user.address_basic,
      'address_detail': user.address_detail,
      'company_name': user.company_name,
      'company_num': user.company_num,
      'company_tel_number': user.company_tel_number,
      'company_email': user.company_email,
      'company_fax_number': user.company_fax_number
  },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.data
    })
}

const updateUser = (user) => {
  return axios.patch(`${Constants.AUTH_URL}/users/${user.account_id}`,
    {
      'password': user.password,
      'email': user.email,
      'full_name': user.full_name,
      'tel_num': user.tel_num,
      'post_num': user.post_num,
      'address_basic': user.address_basic,
      'address_detail': user.address_detail
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.data
    })
}

const deleteUser = (user) => {
  return axios.delete(`${Constants.AUTH_URL}/users/${user.account_id}`,
    {
      data: {
        "password": user.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.data
    })
}

const updatePasswordUser = ({ account_id, editPasswordUser }) => {
  return axios.patch(`${Constants.AUTH_URL}/users/${account_id}`,
  // password, newPassword 필요
    JSON.stringify(editPasswordUser),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response.data
    })
}

export default {
  getUser,
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  updatePasswordUser
}
