const MAIN_TITLE = '태양광 발전시설 관리'

// Map Tool Mode
const MODE_MAP_TOOL_NONE = 'none'
const MODE_MAP_TOOL_DISTANCE = 'distance'
const MODE_MAP_TOOL_METRIC = 'metric'
const MODE_MAP_TOOL_VOLUME = 'volume'
const MODE_MAP_TOOL_MARKER = 'marker'
const MODE_MAP_TOOL_WAYPOINT_PLAN = 'waypointplan'
const MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN = 'analysisSplayBasePlan'
const MODE_MAP_TOOL_ANALYSIS_SPAY_DIFFERENT_PLAN = 'analysisSplayDifferentPlan'
const MODE_MAP_TOOL_SPAY_BASE_PLAN = 'splayBasePlan'
const MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN = 'splayDifferentPlan'

const API_SERVER = process.env.API_SERVER
const API_SERVER_OUTER = process.env.ROOT_API
const MQTT_HOST = process.env.MQTT_HOST
const TASK_MANAGER_SERVER_URL = API_SERVER
const TMS_SERVER_URL = API_SERVER
const ANNOTATION_MANAGER_SERVER_URL = API_SERVER
const FILE_SERVER_URL = `${API_SERVER}/api/filemanager`
const AUTH_URL = `${API_SERVER}/api/auth`
const CONTAINER_MANAGER_SERVER_URL = `${API_SERVER}/api/container`
const UTILITY_URL = `${API_SERVER}/api/utility`
const VOLUME_CALCULATE_URL = `${API_SERVER}/api/utility/volume/`
const INFO_URL = `${API_SERVER}/api/informations/basics/`
const CUSTOM_FIELD_FACILITY_URL = `${API_SERVER}/api/informations/basic/customfields/`
const CUSTOM_FIELD_CHECK_HISTORY_URL = `${API_SERVER}/api/informations/basic/customfields/`
// mqtt server (1883, 9001)
const WEB_SERVER = API_SERVER
const IOT_DEVICE_URL = `${API_SERVER}/api/iotud/`
const IOT_SENSOR_URL = `${API_SERVER}/api/iotinfo/`
const DB_SERVER_URL = `${API_SERVER}/api/db`
const MISSION_SERVER_URL = `${API_SERVER}/api/missions`

// Tile Map
const PROJECTS_ID = '{projects_id}'
const TASKS_ID = '{tasks_id}'
const MARKER_ID = '{marker_id}'
const COMMENT_ID = '{comment_id}'
const ID = '{id}'
const START_TIME = '{start_time}'
const END_TIME = '{end_time}'
// 주소
const ADDRESS_NAME = '{address_name}'
const ADDRESS_LATITUDE = '{latitude}'
const ADDRESS_LONGITUDE = '{longitude}'

// 지역
const ENUM_LOCAL_AREA = {
  SIDO: { value: 'SIDO' },
  SIGG: { value: 'SIGG' },
  EMD: { value: 'EMD' },
  RI: { value: 'RI' }
}

const BASIC_ID = '{basic_id}'

const KEY_FORM_DATA_IMAGES = 'images'

// 가공해야할 URL
const TASKS_URL = `/api/projects/${PROJECTS_ID}/tasks/${TASKS_ID}`
const GET_TILE_JSON = `${TASKS_URL}/tms/orthophoto/tiles.json`
const GET_NDVI_TILE_JSON = `${TASKS_URL}/tms/ndviop/tiles.json`
const GET_EO_TILE_JSON = `${TASKS_URL}/tms/eo/tiles.json`
const GET_DSM_TILE_JSON = `${TASKS_URL}/tms/dsm/tiles.json`
const MARKER_URL = `/api/projects/${PROJECTS_ID}/tasks/${TASKS_ID}/marker/`
const UPDATE_MARKER_URL = `${MARKER_URL}${MARKER_ID}/`
const MARKER_COMMENT_URL = `${UPDATE_MARKER_URL}comments/`
const UPDATE_MARKER_COMMENT_URL = `${MARKER_COMMENT_URL}${COMMENT_ID}`
const IOT_DEVICE_INFO_URL = `${IOT_DEVICE_URL}${ID}`
const IOT_SENSOR_INFO_URL = `${IOT_SENSOR_URL}${ID}`
const IOT_SENSOR_INFO_URL_FOR_GET = `${IOT_SENSOR_URL}?deviceid=${ID}&starttime=${START_TIME}&endtime=${END_TIME}`
const ADDRESS_TO_COORDINATE_URL = `${API_SERVER}/api/utility/searchaddr?query=${ADDRESS_NAME}`
const ADDRESS_TO_GEO_DATA_URL = `${API_SERVER}/api/utility/addrboundary?&crs=EPSG:3857&addrname=${ADDRESS_NAME}`
const REVERSE_TO_GEO_DATA_URL = `${API_SERVER}/api/utility/reverse-geocode?&type=BOTH&crs=EPSG:4326&x=${ADDRESS_LONGITUDE}&y=${ADDRESS_LATITUDE}`

// Image List url
const IMAGE_LIST_URL = `${TMS_SERVER_URL}/imagelist.json`

// BaseMap API Key
const BASE_MAP_API_KEY_FOR_8080 = 'A91904A4-2131-3FE1-BD71-5DBE051C7139'

const BASE_SATELLITE_MAP_URL = `http://api.vworld.kr/req/wmts/1.0.0/${BASE_MAP_API_KEY_FOR_8080}/Satellite/{z}/{y}/{x}.jpeg`
const BASE_HYBRID_MAP_URL = `http://api.vworld.kr/req/wmts/1.0.0/${BASE_MAP_API_KEY_FOR_8080}/Hybrid/{z}/{y}/{x}.png`
// const ADDRESS_TO_GEO_DATA_URL = `http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&key=${BASE_MAP_API_KEY_FOR_8080}&sig_kor_nm:like:${ADDRESS_NAME}`

const REQUEST_MARKER_PARAM_COORD = {
  gps_x: 0,
  gps_y: 0 // marker 삽입 좌표 {gps_x, gps_y}
}

const REQUEST_ANALYSIS_PARAM = {
  // 살포 영역
  'spray_area': [
    // 첫번째 spray_area가 디폴트 살포영역
    // REQUEST_SPRAY_AREA_PARAM
  ]
}

const REQUEST_SPRAY_AREA_PARAM = {
  'amount': 0,    // 살포량
  'base': false,  // 기본영역 여부
  'size': 0,      // 면적 m2
  'comment': '',  // 영역 코멘트
  'area':
    [
      // { 'longitude': 123.4567, 'latitude': 37.4568 },
    ]
}

const REQUEST_MARKER_PARAM = {
  data: {
    type: 'location',
    coordinate: [
      // {
      //   "gps_x": 0,
      //   "gps_y": 0 // marker 삽입 좌표 {gps_x, gps_y}
      // }
    ]
  },
  title: '' // marker 의 이름
}

const REQUEST_MARKER_COMMENT_PARAM = {
  comment: '', // marker 에 첨부되는 comment
  images: [],
  URLs: []
}

const REQUEST_VOLUME_CALCULATE_PARAM = {
  options: {
    project_id: '',
    task_id: '',
    area: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Coord
          ]
        ]
      }
    }
  }
}

const TIMELINE_DATA = {
  property: '',
  data: [
    // Example Object
    // {
    //   "taskId": "",
    //   "date": "",
    //   "value": 0
    // }
  ]
}

const ANNOTATION_METADATA = {
  value: '',
  description: ''
}

// My area setting
const AREA_BOUNDARY = {
  area: []
}

const AREA_POSITION = {
  latitude: 0.0,
  longitude: 0.0
}

// API TaskInfo Options
const TASK_INFO_ALL = 'all'
const TASK_INFO_SUMMARY = 'summary'
const TASK_ORDER_CREATE_AT = 'created_at'
const TASK_ORDER_NAME = 'name'
const TASK_ORDER_DESCRIPTION = 'description'
const TASK_ORDER_TOUCHED_AT = 'touched_at'
const TASK_ORDER_BASE_DATE = 'base_date'
const TASK_SORT_ASC = 'asc'
const TASK_SORT_DESC = 'desc'

// Algorithm
const TASK_ALGORITHM_ODM = 'ODM'
const TASK_ALGORITHM_SCAN = 'Scan'
const TASK_ALGORITHM_NDVI = 'NDVI'
const TASK_ALGORITHM_TEMPERATURE = '온도'
const TASK_ALGORITHM_GEOTIFF = 'GeoTiff'
const TASK_ALGORITHM_NONETYPE = 'NoneType'
const TASK_ALGORITHM_AI = 'AI'

// Mission Category
const MISSION_CATEGORY_ANALYSIS = '분석'
const MISSION_CATEGORY_MANURE = '시비'
const MISSION_CATEGORY_SOWING = '파종'
const MISSION_CATEGORY_PHOTO = '촬영'
const MISSION_CATEGORY_MAP = '지도제작'
const MISSION_CATEGORY_PESTICIDE = '방제'

const ENUM_MISSION_TYPE = {
  PICTURE: 0,
  CREATE_MAP: 1,
  REPORT: 2,
  PLANTATION_FERTILIZATION: 3,
  PLANTATION_SOWING: 4,
  PLANTATION_CONTROL: 5
}

const ENUM_MISSION_DETAIL_TYPE = {
  MTYPE_PICTURE: 0,
  MTYPE_PICTURE_NIR: 1,
  MTYPE_ORTHO_MAP: 2,
  MTYPE_NDVI_MAP: 3,
  MTYPE_VEGE_ANALYSIS_: 4,
  MTYPE_DAMAGE_ANALYSIS_: 5,
  MTYPE_GRADE_ANALYSIS_: 6,
  MTYPE_FERTILIZER_NORMAL: 7,
  MTYPE_FERTILIZER_DIFF: 8,
  MTYPE_SOWING: 9,
  MTYPE_PESTICIDE: 10,
  MTYPE_GEOTIFF: 11,
  MTYPE_AI_MAP: 12
}

// Mission types
const MISSION_TYPES = [
  {
    type: 0,
    category: MISSION_CATEGORY_PHOTO,
    name: '일반촬영',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PICTURE
  },
  {
    type: 1,
    category: MISSION_CATEGORY_PHOTO,
    name: '특수촬영',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PICTURE
  },
  {
    type: 2,
    category: MISSION_CATEGORY_MAP,
    name: '정사영상',
    algorithm: TASK_ALGORITHM_ODM,
    typeDefine: ENUM_MISSION_TYPE.CREATE_MAP
  },
  {
    type: 3,
    category: MISSION_CATEGORY_MAP,
    name: 'NDVI',
    algorithm: TASK_ALGORITHM_NDVI,
    typeDefine: ENUM_MISSION_TYPE.CREATE_MAP
  },
  {
    type: 4,
    category: MISSION_CATEGORY_ANALYSIS,
    name: '생육분석',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.REPORT
  },
  // {
  //   type: 5,
  //   category: MISSION_CATEGORY_ANALYSIS,
  //   name: '피해분석',
  //   algorithm: TASK_ALGORITHM_NONETYPE,
  //   typeDefine: ENUM_MISSION_TYPE.REPORT
  // },
  // {
  //   type: 6,
  //   category: MISSION_CATEGORY_ANALYSIS,
  //   name: '경사도분석',
  //   algorithm: TASK_ALGORITHM_NONETYPE,
  //   typeDefine: ENUM_MISSION_TYPE.REPORT
  // },
  {
    type: 7,
    category: MISSION_CATEGORY_MANURE,
    name: '일반시비',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PLANTATION_FERTILIZATION
  },
  {
    type: 8,
    category: MISSION_CATEGORY_MANURE,
    name: '차증시비',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PLANTATION_FERTILIZATION
  },
  {
    type: 9,
    category: MISSION_CATEGORY_SOWING,
    name: '파종',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PLANTATION_SOWING
  },
  {
    type: 10,
    category: MISSION_CATEGORY_PESTICIDE,
    name: '방제',
    algorithm: TASK_ALGORITHM_NONETYPE,
    typeDefine: ENUM_MISSION_TYPE.PLANTATION_CONTROL
  },
  {
    type: 11,
    category: MISSION_CATEGORY_MAP,
    name: 'GeoTIFF',
    algorithm: TASK_ALGORITHM_GEOTIFF,
    typeDefine: ENUM_MISSION_TYPE.CREATE_MAP
  },
  {
    type: 12,
    category: MISSION_CATEGORY_MAP,
    name: 'AI',
    algorithm: TASK_ALGORITHM_AI,
    typeDefine: ENUM_MISSION_TYPE.CREATE_MAP
  }
]

// type_id를 찾아서 없으면 빈 객체를 리턴
MISSION_TYPES.findMissionType = function(type_id) {
  return this.find(type => type.type === type_id) || {}
}


// Server Type
const CONTAINER_SERVER_TYPE_ODM = 'ODM'
const CONTAINER_SERVER_TYPE_SCAN = 'SCAN'
const CONTAINER_SERVER_TYPE_NDVI = 'NDVI'
const CONTAINER_SERVER_TYPE_THERMAL = 'Thermal'
const CONTAINER_SERVER_TYPE_GEOTIFF = 'GeoTiff'
const CONTAINER_SERVER_TYPE_AI = 'AI'

const FORMAT_CONVERT_DATE = 'YYYY년 MM월 DD일 HH:mm'
const FORMAT_CONVERT_TIMELINE_DATE = 'YYYY.MM.DD[\n]HH:mm'

const SESSION_EXPIRE_MODAL_TITLE = '세션 만료'
const SESSION_EXPIRE_MODAL_CONTENT =
  '세션이 만료되었습니다. 로그인 페이지로 이동합니다.'

const ENUM_TASK_STATUS = {
  QUEUED: { value: 10, name: 'QUEUED' },
  RUNNING: { value: 20, name: 'RUNNING' },
  FAILED: { value: 30, name: 'FAILED' },
  COMPLETED: { value: 40, name: 'COMPLETED' },
  CANCELED: { value: 50, name: 'CANCELED' }
}

const ENUM_MAP_MODE = {
  ALL_PROJECT_MAP: { value: 0, name: 'ALL_PROJECT_MAP' },
  PROJECT_MAP: { value: 1, name: 'PROJECT_MAP' },
  TASK_MAP: { value: 2, name: 'TASK_MAP' }
}

const ENUM_ANNOTATION_TYPE = {
  LOCATION: 'location',
  DISTANCE: 'distance',
  METRIC: 'metric',
  VOLUME: 'volume'
}

const ENUM_DETAIL_IMAGE_VIEW_TYPE = {
  TYPE_MAP: 'type_map',
  TYPE_PROVIDER_MAP: 'type_provider_map',
  TYPE_IMAGE: 'type_image'
}

const ENUM_TABLE_ACTIVE_TYPE = {
  INACTIVE: 0,
  ACTIVE: 1
}

const MAP_PROCESS_TYPE = {
  WAYPOINT_VIEW: 'waypoint_view'
}

const ENUM_FILTER_ALGORITHM_MODE = {
  ODM: { value: 0, name: 'ODM', display: '지도제작(정사영상)' },
  NDVI: { value: 1, name: 'NDVI', display: '지도제작(NDVI)' },
  GEOTIFF: { value: 2, name: 'GeoTiff', display: '지도제작(GeoTIFF)' },
  AI: { value: 3, name: 'AI', display: '지도제작(AI도복검출)' },
  NONETYPE: { value: 4, name: 'NoneType', display: '일반임무' }
}

// MQTT Topic
const TOPIC_TASK_STATUS = '/mp/+/jobstatus/'

export default {
  API_SERVER,
  API_SERVER_OUTER,
  MQTT_HOST,
  MAIN_TITLE,

  MODE_MAP_TOOL_NONE,
  MODE_MAP_TOOL_DISTANCE,
  MODE_MAP_TOOL_METRIC,
  MODE_MAP_TOOL_VOLUME,
  MODE_MAP_TOOL_MARKER,
  MODE_MAP_TOOL_WAYPOINT_PLAN,
  MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN,
  MODE_MAP_TOOL_ANALYSIS_SPAY_DIFFERENT_PLAN,
  MODE_MAP_TOOL_SPAY_BASE_PLAN,
  MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN,

  TMS_SERVER_URL,
  TASK_MANAGER_SERVER_URL,
  ANNOTATION_MANAGER_SERVER_URL,
  FILE_SERVER_URL,
  MARKER_URL,
  UPDATE_MARKER_URL,
  MARKER_COMMENT_URL,
  UPDATE_MARKER_COMMENT_URL,
  AUTH_URL,
  CONTAINER_MANAGER_SERVER_URL,
  DB_SERVER_URL,
  UTILITY_URL,
  MISSION_SERVER_URL,

  VOLUME_CALCULATE_URL,
  INFO_URL,
  CUSTOM_FIELD_FACILITY_URL,
  CUSTOM_FIELD_CHECK_HISTORY_URL,

  PROJECTS_ID,
  TASKS_ID,
  MARKER_ID,
  COMMENT_ID,
  ID,
  START_TIME,
  END_TIME,
  BASIC_ID,
  ADDRESS_NAME,
  ADDRESS_LATITUDE,
  ADDRESS_LONGITUDE,

  TASKS_URL,
  GET_TILE_JSON,
  GET_NDVI_TILE_JSON,
  GET_EO_TILE_JSON,
  GET_DSM_TILE_JSON,
  IMAGE_LIST_URL,

  BASE_MAP_API_KEY_FOR_8080,
  BASE_SATELLITE_MAP_URL,
  BASE_HYBRID_MAP_URL,
  ADDRESS_TO_COORDINATE_URL,
  ADDRESS_TO_GEO_DATA_URL,
  REVERSE_TO_GEO_DATA_URL,

  TASK_INFO_ALL,
  TASK_INFO_SUMMARY,
  TASK_ORDER_CREATE_AT,
  TASK_ORDER_NAME,
  TASK_ORDER_DESCRIPTION,
  TASK_ORDER_TOUCHED_AT,
  TASK_ORDER_BASE_DATE,
  TASK_SORT_ASC,
  TASK_SORT_DESC,

  REQUEST_MARKER_PARAM,
  REQUEST_MARKER_COMMENT_PARAM,
  REQUEST_VOLUME_CALCULATE_PARAM,
  REQUEST_MARKER_PARAM_COORD,
  REQUEST_ANALYSIS_PARAM,
  REQUEST_SPRAY_AREA_PARAM,

  TASK_ALGORITHM_ODM,
  TASK_ALGORITHM_SCAN,
  TASK_ALGORITHM_NDVI,
  TASK_ALGORITHM_TEMPERATURE,
  TASK_ALGORITHM_GEOTIFF,
  TASK_ALGORITHM_AI,

  CONTAINER_SERVER_TYPE_ODM,
  CONTAINER_SERVER_TYPE_SCAN,
  CONTAINER_SERVER_TYPE_NDVI,
  CONTAINER_SERVER_TYPE_THERMAL,
  CONTAINER_SERVER_TYPE_GEOTIFF,
  CONTAINER_SERVER_TYPE_AI,

  SESSION_EXPIRE_MODAL_TITLE,
  SESSION_EXPIRE_MODAL_CONTENT,

  WEB_SERVER,
  TIMELINE_DATA,
  ANNOTATION_METADATA,

  FORMAT_CONVERT_DATE,
  FORMAT_CONVERT_TIMELINE_DATE,

  ENUM_TASK_STATUS,
  ENUM_MAP_MODE,
  ENUM_ANNOTATION_TYPE,
  ENUM_DETAIL_IMAGE_VIEW_TYPE,

  IOT_DEVICE_URL,
  IOT_DEVICE_INFO_URL,
  IOT_SENSOR_URL,
  IOT_SENSOR_INFO_URL,
  IOT_SENSOR_INFO_URL_FOR_GET,

  KEY_FORM_DATA_IMAGES,
  ENUM_LOCAL_AREA,
  ENUM_MISSION_TYPE,
  ENUM_TABLE_ACTIVE_TYPE,
  ENUM_FILTER_ALGORITHM_MODE,

  MAP_PROCESS_TYPE,

  TOPIC_TASK_STATUS,

  MISSION_CATEGORY_ANALYSIS,
  MISSION_CATEGORY_MANURE,
  MISSION_CATEGORY_SOWING,
  MISSION_CATEGORY_PHOTO,
  MISSION_CATEGORY_MAP,
  MISSION_CATEGORY_PESTICIDE,

  MISSION_TYPES,

  AREA_BOUNDARY,
  AREA_POSITION
}
