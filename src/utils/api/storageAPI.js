import axios from "axios";
import Constants from "@/components/common/constants";
import StringUtil from "../utils/stringUtil";


/**
 *
 * @param payload
   {
     req_time: moment().format(),
     tag: `area:${areaId}, diary:${diaryId}`,
     comment: "uploaded from web" 예)
     images: image 객체
   }
 * @returns {Promise<AxiosResponse<T> | never>}
 */
const uploadImages = (payload) => {

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files`
  let formData = StringUtil.converterFormData(payload, Constants.KEY_FORM_DATA_IMAGES)

  console.log('[post] url:'+url)
  console.log('       payload: '+JSON.stringify(payload))
  //return axios.get(`http://localhost:8888/api/filemanager/storage/files?req_time=${req_time}&tag=${tag}&images=${images}`)
  return axios.post(url, formData)
    .then((response) => {
      return response.data
    })
}

// Request: POST /api/filemanager/storage/files/delete
// Headers: Content-Type: application/json
// {
//     "storage_ids": [1, 2, 3]
// }
// Response:
// {
//     "message": "OK",
//     "files": ["2", "3"]
// }

const deleteImages = (storageIds) => {
  let payload = {
    storage_ids: storageIds
  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/delete`

  console.log('[post] url:'+url)
  console.log('       payload: '+JSON.stringify(payload))
  //return axios.get(`http://localhost:8888/api/filemanager/storage/files?req_time=${req_time}&tag=${tag}&images=${images}`)
  return axios.post(url, payload)
    .then((response) => {
      return response.data
    })
}

const searchImages = (tag) => {
  let payload = {
    file: {
      tag: tag
    }
  }

//   let payload = {
//     "storage_ids": null, // optional
//     "ACLs": null, // optional (default: 1 (read))
//     "file": { // optional
//         "fileName": ".jpg", // optional
//         "tag": tag,// optional
//         "comment":null, // optional
//         "fileSize": [2000000, 3000000], // optional
//         "reqTime": ["2019-04-08T00:00:00.000+9", "2019-05-08T23:59:59.999+9"] // optional
//     },
//     "exif": { // optional
//         "summary": true, // optional
//         "gpsTime": [start, end], // optional
//         "gpsLat": [start,end], // optional
//         "gpsLng": [start,end], // optional
//         "gpsAlt": [start, end], // optional
//     }
//  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/search`

  console.log('[post] url:'+url)
  console.log('payload: '+JSON.stringify(payload))
  //return axios.post(`http://localhost:8888/api/filemanager/storage/files/search`)
  return axios.post(url, payload)
    .then((response) => {
      return response.data
    })
}

const searchImagesByStorageIds = (storageids) => {
  let payload = {
    storage_ids: storageids,
    exif: {"searchOnly":false},
  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/search`

  console.log('[post] url:', url)
  console.log('payload:', JSON.stringify(payload))
  //return axios.post(`http://localhost:8888/api/filemanager/storage/files/search`)
  return axios.post(url, payload).then(response => {
    return response
  })
}

const searchFilesByStorageIds = (storageids) => {
  let payload = {
    storage_ids: storageids,
  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/search`

  console.log('[post] url:', url)
  console.log('payload:', JSON.stringify(payload))
  //return axios.post(`http://localhost:8888/api/filemanager/storage/files/search`)
  return axios.post(url, payload).then(response => {
    return response
  })
}

const searchFiles = () => {
  let payload = {
  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/search`

  console.log('[post] url:', url)
  console.log('payload:', JSON.stringify(payload))
  //return axios.post(`http://localhost:8888/api/filemanager/storage/files/search`)
  return axios.post(url, payload).then(response => {
    return response
  })
}


const searchImagesByTagPattern = (tagPattern) => {
  let payload = {
    conditions: [{ field: 'tag', operator: 'ilike', pattern: tagPattern }]
  }

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/search`

  console.log('[post] url:', url)
  console.log('payload:', JSON.stringify(payload))
  //return axios.post(`http://localhost:8888/api/filemanager/storage/files/search`)
  return axios.post(url, payload).then(response => {
    return response.data
  })
}

const downloadImage = (storageId, type) => {
  // Request: GET /api/filemanager/storage/files/:storage_id
  // query: type=image|thumb

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/`+storageId

  //return axios.get(`http://localhost:8888/api/filemanager/storage/files/:storage_id?type=thumb`)
  return axios.get(url+'?'+'type='+type)
    .then((response) => {
      return response.data
    })
}

const downloadFile = (storageId) => {
  // Request: GET /api/filemanager/storage/files/:storage_id
  // query: type=image|thumb

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/`+storageId

  //return axios.get(`http://localhost:8888/api/filemanager/storage/files/:storage_id?type=thumb`)
  // window.location.assign(url);

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", name) //or any other extension
  document.body.appendChild(link)
  link.click()

  // return axios.get(url)
  //   .then((response) => {
  //     return response.data
  //   })
}


const downloadImageUrl = (storageId, type) => {
  // Request: GET /api/filemanager/storage/files/:storage_id
  // query: type=image|thumb

  let url = `${Constants.API_SERVER}/api/filemanager/storage/files/${storageId}?type=${type}`

  //return axios.get(`http://localhost:8888/api/filemanager/storage/files/:storage_id?type=thumb`)
  return url
}

const uploadUrl = () => {
  return `${Constants.API_SERVER}/api/filemanager/storage/files`
}

export default {
  uploadImages,
  deleteImages,
  searchImages,
  searchFiles,
  searchImagesByTagPattern,
  searchImagesByStorageIds,
  searchFilesByStorageIds,
  downloadImage,
  downloadFile,
  downloadImageUrl,
  uploadUrl
}
