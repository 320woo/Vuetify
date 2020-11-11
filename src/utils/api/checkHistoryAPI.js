import axios from "axios";
import Constants from "@/components/common/constants";
import StringUtil from "@/utils/utils/stringUtil"

// axios.interceptors.response.use(
//   (response) => {
//     return response
//   }
//   ,(error) => {
//     return error.response
//   }
// )
/*
response {
config: (...)
data: data
headers: (...)
request: (...)
status: 200
statusText: 'OK'
}

fail
  "returnCode": code
   "reason": “result string”

 */

const getCheckHistoryList = (basicId) => {
  return axios.get(`${Constants.INFO_URL}${basicId}/checkhistorys/`)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

const getCheckHistory = (basicId) => {

}

const createCheckHistory = ({basicId, checkHistory}) => {
  console.log(basicId)
  console.log(checkHistory);

  return axios.post(`${Constants.INFO_URL}${basicId}/checkhistorys/`,
    StringUtil.converterFormData(checkHistory, Constants.KEY_FORM_DATA_IMAGES))
    .then((response) => response)
}

const updateCheckHistory = ({basicId, checkHistory}) => {
  return axios.patch(`${Constants.INFO_URL}${basicId}/checkhistorys/${checkHistory.checkhistory_id}/`,
    StringUtil.converterFormData(checkHistory, Constants.KEY_FORM_DATA_IMAGES))
    .then((response) => response)
}

const deleteCheckHistory = ({basicId, checkHistoryId}) => {
  return axios.delete(`${Constants.INFO_URL}${basicId}/checkhistorys/${checkHistoryId}/`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response)
}

const deleteCheckHistoryImage = ({basicId, checkHistoryId, imageId}) => {
  return axios.delete(`${Constants.INFO_URL}${basicId}/checkhistorys/${checkHistoryId}/images/${imageId}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response)
}

const getCustomFieldsCheckHistory = () => {
  return axios.get(`${Constants.CUSTOM_FIELD_CHECK_HISTORY_URL}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}


export default {
  getCheckHistory,
  getCheckHistoryList,
  getCustomFieldsCheckHistory,
  createCheckHistory,
  updateCheckHistory,
  deleteCheckHistory,
  deleteCheckHistoryImage
}
