'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: JSON.stringify('development'),
  API_SERVER: JSON.stringify('http://211.189.132.21:8095'),
  ROOT_API: JSON.stringify('http://localhost:8080'),
  MQTT_HOST: JSON.stringify('ws://211.189.132.21:9001')
})
