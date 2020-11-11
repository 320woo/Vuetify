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

const requestGetAllGCPInfo = async (payload) => {
  return axios.get(`${Constants.API_SERVER}/api/projects/${payload.projectId}/tasks/${payload.taskId}/GCPs/`)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

const requestAddGCPInfo = (payload) => {
  console.log(JSON.stringify(payload.mappedGCPInfoArr))
  return axios.post(`${Constants.API_SERVER}/api/projects/${payload.projectId}/tasks/${payload.taskId}/GCPs/`, JSON.stringify(payload.mappedGCPInfoArr),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

const requestDeleteGCPInfo = (payload) => {
  return axios.delete(`${Constants.API_SERVER}/api/projects/${payload.projectId}/tasks/${payload.taskId}/GCPs/delall/`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

const requestGCPFileExport = (payload) => {
  return axios.post(`${Constants.API_SERVER}/api/missions/${payload.missionId}/export`,  JSON.stringify(payload.body),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log(error)
    })
}

export default {
  requestGetAllGCPInfo,
  requestAddGCPInfo,
  requestDeleteGCPInfo,
  requestGCPFileExport
}
