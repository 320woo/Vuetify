import axios from "axios";
import Constants from "@/components/common/constants";

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

axios.interceptors.response.use(
  (response) => {
    return response
  }
  ,(error) => {
    return error.response
  }
)

const getFacilityList = () => {
  return axios.get(`${Constants.INFO_URL}`)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

const getFacility = (basicId) => {
  return axios.get(`${Constants.INFO_URL}${basicId}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

const createFacility = (info) => {
  return axios.post(`${Constants.INFO_URL}`, JSON.stringify(info),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response)
}

const updateFacility = (info) => {
  return axios.patch(`${Constants.INFO_URL}${info.basic_id}/`, JSON.stringify(info),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response)
}

const deleteFacility = (basicId) => {
  return axios.delete(`${Constants.INFO_URL}${basicId}/`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response)
}

const getCustomFieldsFacility = () => {
  return axios.get(`${Constants.CUSTOM_FIELD_FACILITY_URL}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}


export default {
  getFacility,
  getFacilityList,
  getCustomFieldsFacility,
  createFacility,
  updateFacility,
  deleteFacility
}
