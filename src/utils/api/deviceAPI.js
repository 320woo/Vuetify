import axios from "axios";
import Constants from "@/components/common/constants";

let parsingUrl = function (url, payload) {
  let pUrl =  url.replace(Constants.ID, payload.deviceid);

  if (url.includes(Constants.START_TIME) && payload.starttime) {
    pUrl = pUrl.replace(Constants.START_TIME, payload.starttime)
  }

  if (url.includes(Constants.END_TIME) && payload.endtime) {
    pUrl = pUrl.replace(Constants.END_TIME, payload.endtime)
  }

  return pUrl;
};

export default {

  /**config
   *
   * @param payload {content: {}}
   * @param successCallback
   * @param failCallback
   */
  addDevice(payload, successCallback, failCallback) {
    console.log("[addDevice] url : " + Constants.IOT_DEVICE_URL, payload);
    axios.post(Constants.IOT_DEVICE_URL, payload)
      .then((response) => {
        if (response.status === 201) {
          console.log("[addDevice] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[addDevice] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[addDevice] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {content: {}}
   * @param successCallback
   * @param failCallback
   */
  updateDevice(payload, successCallback, failCallback) {
    let url = parsingUrl(Constants.IOT_DEVICE_INFO_URL, payload.content);

    console.log("[updateDevice] url : " + url, payload.content);
    axios.patch(url, payload.content)
      .then((response) => {
        if (response.status === 206) {
          console.log("[updateDevice] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[updateDevice] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[updateDevice] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {deviceid: ""}
   * @param successCallback
   * @param failCallback
   */
  getDeviceInfo(payload, successCallback, failCallback) {
    let url = parsingUrl(Constants.IOT_DEVICE_INFO_URL, payload);

    console.log("[getDeviceInfo] url : " + url);
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getDeviceInfo] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getDeviceInfo] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[getDeviceInfo] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param successCallback
   * @param failCallback
   */
  getDeviceList(successCallback, failCallback) {
    console.log("[getDeviceList] url : " + Constants.IOT_DEVICE_URL);
    axios.get(Constants.IOT_DEVICE_URL)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getDeviceList] success", response.data);
          if (successCallback) {
            successCallback(response.data);
          }
        } else {
          console.log("[getDeviceList] fail");
          if (failCallback) {
            failCallback();
          }
        }
      })
      .catch((error) => {
        console.log("[getDeviceList] error", error);
        if (failCallback) {
          failCallback();
        }
      });
  },

  /**
   *
   * @param payload {deviceid:""}
   * @param successCallback
   * @param failCallback
   */
  deleteDevice(payload, successCallback, failCallback) {
    let url = parsingUrl(Constants.IOT_DEVICE_INFO_URL, payload);

    console.log("[deleteDevice] url : " + url);
    axios.delete(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[deleteDevice] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[deleteDevice] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[deleteDevice] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {deviceid:"", starttime: 2018-12-11T08:27:30, endtime: 2018-12-11T09:27:30}
   * @param successCallback
   * @param failCallback
   */
  getSensorInfo(payload, successCallback, failCallback) {
    let url = parsingUrl(Constants.IOT_SENSOR_INFO_URL_FOR_GET, payload);
    console.log("[getSensorInfo] url : " + url);
    axios.get(url, payload)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getSensorInfo] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getSensorInfo] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[getSensorInfo] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {starttime: 2018-12-11T08:27:30, endtime: 2018-12-11T09:27:30}
   * @param successCallback
   * @param failCallback
   */
  getSensorInfoList(payload, successCallback, failCallback) {
    console.log("[getSensorInfoList] url : " + Constants.IOT_SENSOR_URL, payload.content);
    axios.get(Constants.IOT_SENSOR_URL, payload.content)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getSensorInfoList] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getSensorInfoList] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[getMarkerCommentList] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {deviceid:""}
   * @param successCallback
   * @param failCallback
   */
  deleteSensorInfo(payload, successCallback, failCallback) {
    let url = parsingUrl(Constants.IOT_SENSOR_INFO_URL, payload);
    console.log("[deleteSensorInfo] url : " + url);
    axios.delete(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[deleteSensorInfo] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[deleteSensorInfo] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[deleteSensorInfo] error", error);
        failCallback();
      });
  },
}
