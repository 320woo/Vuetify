let Mqtt = require('mqtt')

import Constants from '@/components/common/constants'
import StringUtil from '@/utils/utils/stringUtil'

export default class MPMqttClient {

  constructor() {
    this.mqttClient = Mqtt.connect(Constants.MQTT_HOST)
    this.topicList = []

    this.mqttClient.on('connect', () => {
      console.log("[MPMqttClient] connect")
      this.topicList.forEach((topic) => {
        // console.log("[MPMqttClient] subscribe topic : " + topic)
        this.mqttClient.subscribe(topic, this.onSubscribe)
      })
    })

    this.mqttClient.on('message', (topic, message) => {
      console.log("[MPMqttClient] onMessage (topic : " + topic + ", message : " + message)
      if (this.mesageCallback) {
        this.mesageCallback(topic, message)
      } else {
        console.log("[MPMqttClient] onMessage is not plugged callback")
      }
    })
  }

  setTopic(topic) {
    if (!this.topicList.find((data) => {
      return data === topic
    })) {
      this.topicList.push(topic)
      if (this.mqttClient.connected) {
        this.mqttClient.subscribe(topic, this.onSubscribe)
      }
    }
  }

  onSubscribe(err) {
    if (err) {
      console.log("[MPMqttClient] onSubscribe err : ", err)
    }
  }

  setMessageCallback(callback) {
    this.mesageCallback = callback
  }

  delete() {
    console.log("[MPMqttClient] delete")
    this.topicList.forEach((topic) => {
      this.mqttClient.unsubscribe(topic)
    })

    this.topicList.splice(0, this.topicList.length)
    this.mqttClient.end(true)
  }

  static regexTopic(topic) {
    let regTopic = topic

    regTopic = StringUtil.replaceAll(regTopic, "/", "\\/")
    regTopic = StringUtil.replaceAll(regTopic, "+", "(\\w+)")
    regTopic = StringUtil.replaceAll(regTopic, "*", "(\\w+)")

    return regTopic
  }

  static matchTopic(topic1, topic2) {
    let spliceTopic1 = topic1.split('/')
    let spliceTopic2 = topic2.split('/')

    let isMatch = true
    spliceTopic1.forEach((data, index) => {
      if (data !== "+" && data !== "*" &&
        spliceTopic2[index] !== "+" && spliceTopic2[index] !== "*") {
        if (data !== spliceTopic2[index]) {
          isMatch = false
        }
      }
    })

    return isMatch
  }
}
