import axios from "axios";
import Constants from "@/components/common/constants";

// File type
const SRC = 'src'; // 원본 이미지 가져오기(tiff, jpg..)
const IMAGE = 'image'; // 원본을 jpg화한 이미지 가져오기
const THUMB = 'thumb'; // thumbnail 이미지 가져오기
const EXIF = 'exif'; // exif 정보 가져오기

const PROJECT_ID = 'project_id'
const TASK_ID = 'task_id'
const FILE_ID = 'file_id'
const ASSET_NAME = 'name'

// taskinfo: {[PROJECT_ID]: 'project id', [TASK_ID]: 'task id'}
// opt: {[FILE_ID]: 'file id', [ASSET_NAME]: 'asset file name'}
function FileManagerUrl(taskinfo, opt) {  // taskinfo는 필수, opt는 속성에 따라 optional
  function fileServerUrl() { return Constants.FILE_SERVER_URL }
  function projectUrl() { return `${fileServerUrl()}/projects/${taskinfo[PROJECT_ID]}/tasks/?info=summary` }
  function taskUrl() { return `${fileServerUrl()}/projects/${taskinfo[PROJECT_ID]}/tasks/${taskinfo[TASK_ID]}` }
  function filesUrl() { return `${taskUrl()}/files` }
  function getFileUrl(type) { return `${filesUrl()}/${opt[FILE_ID]}/?type=${type}` }
  function getStorageFileUrl(type) { return `${fileServerUrl()}/storage/files/${opt[FILE_ID]}/?type=${type}` }
  function fileSearchUrl() { return `${fileServerUrl()}/storage/files/search` }

  return {
    get sourceUrl() { return getFileUrl(SRC) },       // opt[FILE_ID]
    get imageUrl() { return getFileUrl(IMAGE) },      // opt[FILE_ID]
    get thumbnailUrl() { return getFileUrl(THUMB) },  // opt[FILE_ID]
    get storageImageUrl() { return getStorageFileUrl(IMAGE) },      // opt[FILE_ID]
    get storageThumbnailUrl() { return getStorageFileUrl(THUMB) },      // opt[FILE_ID]
    get uploadUrl() { return filesUrl() },
    get listUrl() { return filesUrl() },
    get assetsUrl() { return `${taskUrl()}/assets/${opt[ASSET_NAME]}` },  // opt[ASSET_NAME]
    get projectUrl() { return projectUrl() },
    get searchUrl() { return fileSearchUrl() }
  }
}

const TaskInfo = (pid, tid) => ({[PROJECT_ID]: pid, [TASK_ID]: tid})
const AssetName = (name) => ({[ASSET_NAME]: name})
const FileId = (fid) => ({[FILE_ID]: fid})

/* 사용법
  1. uploadUrl 얻기 (같은 내용 다른 표현 3가지)
  1-1. uploadUrl 얻기
  const {uploadUrl} = FileManagerUrl({[PROJECT_ID]: 'pid', [TASK_ID]: 'tid'})

  1-2. uploadUrl 얻기 (FileManager에서 쓰는 key 형식이 일치할 때)
  const tinfo = {
    project_id: 'pid',
    task_id: 'tid'
  }
  const uploadUrl = FileManagerUrl(tinfo).uploadUrl

  1-3. uploadUrl 얻기 (key가 PROJECT_ID, TASK_ID와 다를 때)
  const taskinfo = {
    projectId: 'pid',
    selectedTaskId: 'tid'
  }
  const uploadUrl = FileManagerUrl(TaskInfo(taskinfo.projectId, taskinfo.selectedTaskId)).uploadUrl

  2. assetsUrl 얻기
  const {assetsUrl} = FileManagerUrl(tinfo, AssetName('filename'))
 */

const fetchTaskFileList = ({projectId, taskId}) => {
  const fetchFileListURL = FileManagerUrl(TaskInfo(projectId, taskId)).listUrl + '/?exif=full'

  return axios.get(fetchFileListURL)
    .then((response) => {
      return response
    })
}

const getProjectFileList = ({projectId}) => {
  const projectFileURL =  FileManagerUrl(TaskInfo(projectId)).projectUrl;

  return axios.get(projectFileURL)
    .then((response) => {
      return response
    })
}

const getFileInfoList = (storageIds) => {
  const fileSearchURL =  FileManagerUrl().searchUrl;

  let param = {
    "storage_ids": storageIds,
    "exif": {
      "summary": false
    }
  }

  return axios.post(fileSearchURL, param)
    .then((response) => {
      return response
    })
}

export default {
  FileManagerUrl,
  TaskInfo,
  AssetName,
  FileId,
  fetchTaskFileList,
  getProjectFileList,
  getFileInfoList,

  PROJECT_ID,
  TASK_ID,
  FILE_ID,
  ASSET_NAME,
}
