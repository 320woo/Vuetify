import axios from "axios";
import Constants from "@/components/common/constants";

export default {

  calculateVolume(payload, successCallback, failCallback) {
    let param = Constants.REQUEST_VOLUME_CALCULATE_PARAM;

    param.options.project_id = payload.projectId;
    param.options.task_id = payload.taskId;
    param.options.storage_path = payload.storage_path
    param.options.area.geometry.coordinates[0] = payload.coordinates;

    console.log("[calculateVolume] param", param);
    axios.post(Constants.VOLUME_CALCULATE_URL, param)
      .then((response) => {
        if (response.status === 200) {
          console.log("[calculateVolume] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[calculateVolume] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[calculateVolume] error", error);
        failCallback();
      });
  },

  getWeekFarmInfo(pageNo, numOfRows) {
    return axios.get(`${Constants.UTILITY_URL}/weekFarmInfo?pageNo=${pageNo || 1}&numOfRows=${numOfRows || 100}`)
      .then((response) => {
        return response.data
      })
  },
  getHarmfulInsectOccurInfo(year) {
    return axios.get(`${Constants.UTILITY_URL}/harmfulInsectOccurInfo?year=${year}`)
      .then((response) => {
        return response.data
      })
  }
}
