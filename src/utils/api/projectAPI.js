import axios from "axios";
import Constants from "@/components/common/constants";

const PROJECT = Constants.TASK_MANAGER_SERVER_URL + '/api/projects/';

axios.interceptors.response.use(
  (response) => {
    return response
  }
  , (error) => {
    return error.response
  }
)

export default {
  fetchProjectList(option) {
    let fetchProjectListURL = PROJECT;
    if (option === Constants.TASK_INFO_ALL) {
      fetchProjectListURL += '?taskinfo=all';
    }
    else if (option === Constants.TASK_INFO_SUMMARY) {
      fetchProjectListURL += '?taskinfo=summary';
    }
    else {
      fetchProjectListURL = PROJECT
    }
    return axios.get(fetchProjectListURL)
      .then((response) => {
        if (response.statusText === 'OK') {
          console.log("프로젝트 목록 가져오기 성공", response.data);
          return response
        } else {
          console.log("프로젝트 목록 가져오기 실패", response);
          return response
        }
      })
      .catch((error) => {
        console.log(error);
      })
  },
  getProject(payload, option) {
    let getProjectURL = PROJECT + payload;
    if (option === Constants.TASK_INFO_ALL) {
      getProjectURL += '/?taskinfo=all';
    }
    else if (option === Constants.TASK_INFO_SUMMARY) {
      getProjectURL += '/?taskinfo=summary';
    }
    else {
      console.log(getProjectURL)
      getProjectURL = PROJECT + payload
    }

    return axios.get(getProjectURL)
      .then((response) => {
        console.log('프로젝트 요청: ', getProjectURL)
        if (response.statusText === 'OK') {
          console.log("프로젝트 정보 가져오기 성공", response.data);
          return response
        } else {
          console.log("프로젝트 정보 가져오기 실패", response);
          return response
        }
      })
      .catch((error) => {
        return alert(error);
      })
  },
  addProject(payload) {
    return axios.post(PROJECT, {
      "name": payload.name,
      "description": payload.description
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.statusText === 'Created') {
          console.log("프로젝트 추가 성공", response.data);
          return response;
        } else {
          console.log("프로젝트 추가 실패");
          return response
        }
      })
  },
  updateProject(payload) {
    return axios.patch(PROJECT + payload.project_id + '/',
      {
        "name": payload.name,
        "description": payload.description
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.statusText === 'OK') {
          console.log("프로젝트 갱신 성공", response.data);
          return response;
        } else {
          console.log("프로젝트 갱신 실패")
          return response;
        }
      })
  },
  deleteProject(payload) {
    return axios.delete(PROJECT + payload + '/', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.statusText === 'No Content') {
          console.log("프로젝트 삭제 성공", response.data);
          return response;
        } else {
          console.log("프로젝트 삭제 실패")
          return response;
        }
      })
  }
}
