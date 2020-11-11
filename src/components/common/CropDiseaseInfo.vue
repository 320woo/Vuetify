<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12> [ {{ cropName }} 에 대한 질병/병해충 정보 ] </v-flex>
      <v-layout row wrap>
        <v-flex v-for="(item, i) in crop_disease" :key="i" xs3>
          <v-img
            :src="item.thumbImg"
            height="80"
            width="120"
            @click.stop="openDetailInfo(item.detailUrl)"
          />
          {{ item.korName }}
        </v-flex>
      </v-layout>
      <br />
    </v-layout>
    <v-dialog v-model="showDialog" persistent max-width="900px">
      <v-card>
        <v-card-title primary-title>
          <div v-html="detailInfo"></div>
        </v-card-title>
        <v-card-actions>
          <v-btn color="blue" @click="closeDialog()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Constants from '@/components/common/constants'

export default {
  name: 'CropDiseaseList',
  props: {
    cropName: String,
    default: undefined
  },
  data: () => {
    return {
      crop_disease: [],
      detailInfo: '',
      showDialog: false
    }
  },
  async created() {
    await this.loadCropDisease()
  },
  methods: {
    openDetailInfo: function(url) {
      let detail_url = encodeURIComponent(url + '&serviceType=AA002')
      let request_url = `${Constants.API_SERVER}/api/utility/crop_disease/detail?url=${detail_url}`
      //let request_url = `http://localhost:8082/api/utility/crop_disease/detail?url=${detail_url}`
      console.log('request_url ====> ', request_url)
      axios.get(request_url).then(response => {
        //return response.data
        this.detailInfo = response.data
        // TODO: 일단 Dialog에 그대로 출력함. javascript 코드 등 동작되지 않도록 처리하고, 출력 내용 정리 필요..
      })
      this.showDialog = true
    },
    closeDialog: function() {
      this.showDialog = false
    },
    xmlToJson: function(xml) {
      // Create the return object
      var obj = {}

      if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
          obj['@attributes'] = {}
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j)
            obj['@attributes'][attribute.nodeName] = attribute.nodeValue
          }
        }
      } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue
      }

      // do children
      // If just one text node inside
      if (
        xml.hasChildNodes() &&
        xml.childNodes.length === 1 &&
        xml.childNodes[0].nodeType === 3
      ) {
        obj = xml.childNodes[0].nodeValue
      } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i)
          var nodeName = item.nodeName
          if (typeof obj[nodeName] == 'undefined') {
            obj[nodeName] = this.xmlToJson(item)
          } else {
            if (typeof obj[nodeName].push == 'undefined') {
              var old = obj[nodeName]
              obj[nodeName] = []
              obj[nodeName].push(old)
            }
            obj[nodeName].push(this.xmlToJson(item))
          }
        }
      }
      return obj
    },
    async loadCropDisease() {
      if (this.cropName == null) {
        return
      }

      // 병충해 조회
      return axios
        .get(
          `${Constants.API_SERVER}/api/utility/crop_disease?cropName=${this.cropName}&displayCount=10`
        ) // displayCount는 10의 배수만 동작함.
        //axios.get(`http://localhost:8082/api/utility/crop_disease?cropName=${this.first_interest_crop_name}&displayCount=10`) // displayCount는 10의 배수만 동작함.
        .then(response => {
          var xml = response.data
          var xmlDOM = new DOMParser().parseFromString(xml, 'text/xml')
          let o = this.xmlToJson(xmlDOM)
          console.log('list====>', o.service.list.item)
          this.crop_disease = o.service.list.item
          this.crop_disease.length = 8 // 8개만 처리.
        })
    }
  },
  watch: {
    async cropName() {
      await this.loadCropDisease()
    }
  }
}
</script>
