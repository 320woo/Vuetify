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

const getContainerList = () => {
  return axios.get(`${Constants.CONTAINER_MANAGER_SERVER_URL}/`)
    .then((response) => {
      return response
    })
}

const addContainer = (container) => {
  return axios.post(`${Constants.CONTAINER_MANAGER_SERVER_URL}/`,
    {
      'server_type': container.server_type,
      'hostname': container.hostname,
      'port': container.port
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response
    })
}

const updateContainer = (container) => {
  return axios.patch(`${Constants.CONTAINER_MANAGER_SERVER_URL}/${container.id}/`,
    {
      'server_type': container.server_type,
      'hostname': container.hostname,
      'port': container.port
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      return response
    })
}

const deleteContainer = (container) => {
  return axios.delete(`${Constants.CONTAINER_MANAGER_SERVER_URL}/${container.id}/`)
    .then((response) => {
      return response
    })
}

export default {
  getContainerList,
  addContainer,
  updateContainer,
  deleteContainer
}
