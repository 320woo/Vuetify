import Constants from '@/components/common/constants'
import StringUtils from '@/utils/utils/stringUtil'

let DB_KEY_LATITUDE = 'latitude'
let DB_KEY_LONGITUDE = 'longitude'

let MAP_KEY_LATITUDE = 'lat'
let MAP_KEY_LONGITUDE = 'lng'

export default {
  DB_KEY_LATITUDE,
  DB_KEY_LONGITUDE,

  MAP_KEY_LATITUDE,
  MAP_KEY_LONGITUDE,

  getConvertDBToMapJson(areaList) {
    let convertAreaList = []
    areaList.forEach(data => {
      let convertLatLngList = data.map(item => {
        return {
          [MAP_KEY_LATITUDE]: item[DB_KEY_LATITUDE],
          [MAP_KEY_LONGITUDE]: item[DB_KEY_LONGITUDE]
        }
      })

      convertAreaList.push({ area: convertLatLngList })
    })

    return convertAreaList
  },

  getConvertMapToDBJson(areaList) {
    let areaBoundary = StringUtils.clone(Constants.AREA_BOUNDARY)
    let areaSize = 0

    areaList.forEach(data => {
      areaBoundary.area.push(data.area.map(item => {
        return {
          [DB_KEY_LATITUDE]: item[MAP_KEY_LATITUDE],
          [DB_KEY_LONGITUDE]: item[MAP_KEY_LONGITUDE]
        }
      }))

      areaSize += data.size
    })

    return {areaBoundary: areaBoundary, areaSize: areaSize}
  }
}
