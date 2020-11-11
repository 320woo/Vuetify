import axios from "axios";
import Constants from "@/components/common/constants";

const getWeatherInfo = (type, yyyymmdd, hhmm, lon, lat) => {
  return axios.get(`${Constants.API_SERVER}/api/utility/weather?type=${type}&yyyymmdd=${yyyymmdd}&hhmm=${hhmm}&lon=${lon}&lat=${lat}`)
  //return axios.get(`http://localhost:8888/api/utility/weather?type=${type}&yyyymmdd=${yyyymmdd}&hhmm=${hhmm}&lon=${lon}&lat=${lat}`)
    .then((response) => {
      return response.data
    })
}

function getPastWeatherInfo(stnId, yyyymmdd) {
  return axios.get(`${Constants.API_SERVER}/api/utility/pastWeather?stnId=${stnId}&yyyymmdd=${yyyymmdd}`)
    .then((response) => {
      return response.data
    })
}

export default {
  getWeatherInfo,
  getPastWeatherInfo
}
