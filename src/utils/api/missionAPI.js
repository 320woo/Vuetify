import axios from "axios";
import Constants from "@/components/common/constants";
import StringUtil from "../utils/stringUtil";


const setImagesToTask = (payload) => {
  
  let url = `${Constants.API_SERVER}/api/missions/` + payload.mission_id + '/setimages'

  //return axios.get(`http://localhost:8888/api/filemanager/storage/files?req_time=${req_time}&tag=${tag}&images=${images}`)
  return axios.post(url, payload)
    .then((response) => {
      return response
    })
}

export default {
  setImagesToTask
}
