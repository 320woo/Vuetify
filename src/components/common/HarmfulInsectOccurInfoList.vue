<template>
  <div>
    <v-card>
      <v-list>
        <v-list-tile
          v-for="(item, i) in harmfulInsectOccurInfos"
          :key="item.cntntsSj"
          avatar
        >
          <v-list-tile-avatar>
            <v-icon>assignment</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.cntntsSj }}<a :href="item.downFile"><v-icon color="blue">get_app</v-icon></a></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script>
  import dbAPI from '@/utils/api/dbAPI'
  import axios from 'axios'
  import Constants from '@/components/common/constants'
  import utilsAPI from '@/utils/api/utilsAPI'
  import xml_js from 'xml-js'

  export default {
    name: 'HarmfulInsectOccurInfoList',
    data: () => {
      return {
        harmfulInsectOccurInfos: []
      }
    },
    async created() {
      await this.loadHarmfulInsectOccurInfo()
    },
    methods: {
      async loadHarmfulInsectOccurInfo() {
        try {
          const xml = await utilsAPI.getHarmfulInsectOccurInfo((new Date()).getFullYear())
          const infojson = xml_js.xml2json(xml, {compact: true, spaces: 2})
          const info = JSON.parse(infojson)
          console.log('loadHarmfulInsectOccurInfo:', info)
          const response = info.response
          const resultCode = parseInt(response.header.resultCode._text)
          if (resultCode === 0) {
            const harmfulInsectOccurInfos = response.body.items.item.map(item => {
              return {
                cntntsNo: item.cntntsNo._cdata,
                cntntsRdcnt: item.cntntsRdcnt._cdata,
                cntntsSj: item.cntntsSj._cdata,
                downFile: item.downFile._cdata,
                pblicteYear: item.pblicteYear._cdata,
                registDt: item.registDt._cdata,
                rtnOrginlFileNm: item.rtnOrginlFileNm._cdata,
                svcDt: item.svcDt._cdata,
                svcDtx: item.svcDtx._cdata,
                updusrEsntlNm: item.updusrEsntlNm._cdata
              }
            })
            this.harmfulInsectOccurInfos = harmfulInsectOccurInfos.slice(0, 5)
            console.log(this.harmfulInsectOccurInfos)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
