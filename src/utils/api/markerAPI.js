import axios from "axios";
import Constants from "@/components/common/constants";
import StringUtil from "@/utils/utils/stringUtil"

const MARKER_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.MARKER_URL;
const UPDATE_MARKER_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.UPDATE_MARKER_URL;
const MARKER_COMMENT_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.MARKER_COMMENT_URL;
const UPDATE_MARKER_COMMENT_URL = Constants.ANNOTATION_MANAGER_SERVER_URL + Constants.UPDATE_MARKER_COMMENT_URL;

let parsingUrl = function (url, payload) {

  let pUrl = url.replace(Constants.PROJECTS_ID, payload.project_id)
    .replace(Constants.TASKS_ID, payload.task_id);

  // console.log("[parsingUrl] markerId : " + markerId);
  if (url.includes(Constants.MARKER_ID) && payload.marker_id) {
    pUrl = pUrl.replace(Constants.MARKER_ID, payload.marker_id)
  }

  if (url.includes(Constants.COMMENT_ID) && payload.comment_id) {
    pUrl = pUrl.replace(Constants.COMMENT_ID, payload.comment_id)
  }

  return pUrl;
};

function converterFormData(convertData) {
  let fd = new FormData(convertData);

  Object.keys(convertData).map(key => {
    let data;

    if (convertData[key] instanceof Object) {
      if (key === 'images') {
        convertData[key].forEach((item) => {
          fd.append(key, item.file)
        });
        data = null;
      } else {
        data = JSON.stringify(convertData[key]);
      }
    } else {
      data = convertData[key];
    }

    if (data) {
      fd.append(key, data)
    }
  });

  return fd;
}

export default {

  /**
   *
   * @param payload {project_id:"", task_id: "", content: {}}
   * @param successCallback
   * @param failCallback
   */
  addMarker(payload, successCallback, failCallback) {
    let url = parsingUrl(MARKER_URL, payload);
    console.log("[addMarker] url : " + url, payload.content);
    axios.post(url, payload.content)
      .then((response) => {
        if (response.status === 201) {
          console.log("[addMarker] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[addMarker] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[addMarker] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: "", content: {}}
   * @param successCallback
   * @param failCallback
   */
  updateMarker(payload, successCallback, failCallback) {
    let url = parsingUrl(UPDATE_MARKER_URL, payload);

    console.log("[updateMarker] url : " + url, payload.content);
    axios.patch(url, payload.content)
      .then((response) => {
        if (response.status === 206) {
          console.log("[updateMarker] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[updateMarker] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[updateMarker] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id: "", task_id: ""}
   * @param successCallback
   * @param failCallback
   */
  getMarkerList(payload, successCallback, failCallback) {
    let url = parsingUrl(MARKER_URL, payload);

    url = `${url}?info=all`;
    console.log("[getMarkerList] url : " + url);
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getMarkerList] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getMarkerList] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[getMarkerList] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: ""}
   * @param successCallback
   * @param failCallback
   */
  deleteMarker(payload, successCallback, failCallback) {
    let url = parsingUrl(UPDATE_MARKER_URL, payload);

    console.log("[deleteMarker] url : " + url);
    axios.delete(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[deleteMarker] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[deleteMarker] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[deleteMarker] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: "", content: {}}
   * @param successCallback
   * @param failCallback
   */
  addMarkerComment(payload, successCallback, failCallback) {
    let url = parsingUrl(MARKER_COMMENT_URL, payload);
    console.log("[addMarkerComment] url : " + url, payload.content);

    axios.post(url, StringUtil.converterFormData(payload.content, Constants.KEY_FORM_DATA_IMAGES))
      .then((response) => {
        if (response.status === 201) {
          console.log("[addMarkerComment] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[addMarkerComment] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[addMarkerComment] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: "", comment_id: "", content: {}}
   * @param successCallback
   * @param failCallback
   */
  updateMarkerComment(payload, successCallback, failCallback) {
    let url = parsingUrl(UPDATE_MARKER_COMMENT_URL, payload);
    console.log("[updateMarkerComment] url : " + url, payload.content);
    axios.patch(url, payload.content)
      .then((response) => {
        if (response.status === 206) {
          console.log("[updateMarkerComment] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[updateMarkerComment] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[updateMarkerComment] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: ""}
   * @param successCallback
   * @param failCallback
   */
  getMarkerComment(payload, successCallback, failCallback) {
    let url = parsingUrl(MARKER_COMMENT_URL, payload);
    console.log("[getMarkerComment] url : " + url);
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getMarkerComment] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getMarkerComment] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[getMarkerComment] error", error);
        failCallback();
      });
  },

  /**
   *
   * @param payload {project_id:"", task_id: "", marker_id: "", comment_id: ""}
   * @param successCallback
   * @param failCallback
   */
  getMarkerCommentList(payload, successCallback, failCallback) {
    let url = parsingUrl(UPDATE_MARKER_COMMENT_URL, payload);
    console.log("[getMarkerCommentList] url : " + url);
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[getMarkerCommentList] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[getMarkerCommentList] fail");
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
   * @param payload {project_id:"", task_id: "", marker_id: "", comment_id: ""}
   * @param successCallback
   * @param failCallback
   */
  deleteMarkerComment(payload, successCallback, failCallback) {
    let url = parsingUrl(UPDATE_MARKER_COMMENT_URL, payload);
    console.log("[deleteMarkerComment] url : " + url);
    axios.delete(url)
      .then((response) => {
        if (response.status === 200) {
          console.log("[deleteMarkerComment] success", response.data);
          successCallback(response.data);
        } else {
          console.log("[deleteMarkerComment] fail");
          failCallback();
        }
      })
      .catch((error) => {
        console.log("[deleteMarkerComment] error", error);
        failCallback();
      });
  },
}
