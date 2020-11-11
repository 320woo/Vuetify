// 'use strict'
module.exports = {
  NODE_ENV: JSON.stringify('production'),
  API_SERVER: JSON.stringify(process.env.API_SERVER_URL_INNER || ''),
  ROOT_API: JSON.stringify(process.env.API_SERVER_URL_OUTER || 'http://211.189.132.21:8095'),
  MQTT_HOST: JSON.stringify(process.env.MQTT_URL_OUTER || 'ws://211.189.132.21:9001')
  // {모바일 빌드}시 아래 코드 사용
  // API_SERVER: '"http://211.189.132.21:8095"',
}
