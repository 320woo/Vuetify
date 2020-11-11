import axios from "axios";
import Constants from "@/components/common/constants";

const PROJECT_URL = `${Constants.TASK_MANAGER_SERVER_URL}/api/projects/`;

axios.interceptors.response.use(
  (response) => {
    return response
  }
  , (error) => {
    return error.response
  }
)

export default {
  fetchTask(payload, ...args) {
    let taskURL = `${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}`;
    if (args[0] === Constants.TASK_INFO_ALL) {
      taskURL += '/?taskinfo=all';
    } else if (args[0] === Constants.TASK_INFO_SUMMARY) {
      taskURL += '/?taskinfo=summary';
    }
    if (args.length > 1) {
      taskURL += `&order=${args[1]}$sorttype=${args[2]}`
    }

    return axios.get(taskURL)
      .then((response) => {
        console.log('Task 요청: ',taskURL)
        if (response.statusText === 'OK') {
          console.log("Task 정보 가져오기 성공", response.data);
          return response;
        } else {
          console.log("Task 정보 가져오기 실패")
          return response;
        }
      })
  },
  createTask(payload) {
    return axios.post(`${PROJECT_URL}${payload.project_id}/tasks/`,
      {
        "name": payload.task.name,
        "algorithm": payload.task.algorithm,
        "base_date": payload.task.base_date
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.statusText === 'Created') {
          console.log("태스크 생성 성공", response.data)
          return response
        } else {
          console.log("태스크 생성 실패")
          return response
        }
      })
  },
  updateTask(payload) {
    return axios.patch(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task.task_id}/`,
      {
        "name": payload.task.name,
        "algorithm": payload.task.algorithm,
        "base_date": payload.task.base_date
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.statusText === 'OK') {
          console.log("태스크 갱신 성공", response.data)
          return response
        } else {
          console.log("태스크 갱신 실패")
          return response
        }
      })
  },
  duplicateTask(payload) {
    return axios.post(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task.task_id}/duplicate/`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.statusText === 'Created') {
          console.log("태스크 복사 성공", response.data)
          return response
        } else {
          console.log("태스크 복사 실패")
          return response
        }
      })
  },
  deleteTask(payload) {
    return axios.delete(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log('delteTask response => ', response)
        if (response.statusText === 'OK') {
          console.log("태스크 삭제 성공", response.data);
          return response
        } else {
          console.log("태스크 삭제 실패")
          return response
        }
      })
  },
  startTask(payload) {
    return axios.post(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/start/`,)
      .then((response) => {
        if (response.data.returnCode === 0) {
          console.log("태스크 실행 성공", response.data)
          return response
        } else {
          console.log("태스크 실행 실패")
          return response
        }
      })
  },
  cancelTask(payload) {
    return axios.post(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/cancel/`,)
      .then((response) => {
        console.log(response)
        if (response.statusText === 'OK') {
          console.log("태스크 정지 성공", response.data)
          return response
        } else {
          console.log("태스크 정지 실패")
          return response
        }
      })
  },

  /**
   *
   * @param payload
   * {
        "storagefiles":[75,76,77,78,79]
     }
   * @returns {Promise<AxiosResponse<T> | never>}
   */
  setImageInfoToTask(payload) {
    let param = {
      "storagefiles" : payload.storagefiles
    }

    return axios.post(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/setimages/`, param)
      .then((response) => {
        return response
      })
  },

  assetsDownloadUrl(payload) {
    return `${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/tms/assets/${payload.asset_name}`
  },


  getHistogram(payload) {
    return axios.get(`${PROJECT_URL}${payload.project_id}/tasks/${payload.task_id}/histogram/`)
      .then((response) => {
        return response.data
      })
  }
}
