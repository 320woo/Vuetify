<template>
  <div>
    <v-card>
      <v-list>
        <v-list-tile
          v-for="(item, i) in weekFarmInfos"
          :key="item.subject"
          avatar
        >
          <v-list-tile-avatar>
            <v-icon>assignment</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.subject }}<a :href="item.downUrl"><v-icon color="blue">get_app</v-icon></a></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script>
  import utilsAPI from '@/utils/api/utilsAPI'
  import xml_js from 'xml-js'

  export default {
    name: 'WeekFarmInfoList',
    data: () => {
      return {
        weekFarmInfos: []
      }
    },
    async created() {
      await this.loadWeekFarmInfo()
    },
    methods: {
      async loadWeekFarmInfo() {
        try {
          const xml = await utilsAPI.getWeekFarmInfo(1, 10)
          const infojson = xml_js.xml2json(xml, {compact: true, spaces: 2})
          const info = JSON.parse(infojson)
          console.log('loadWeekFarmInfo:', info)

          const response = info.response
          const resultCode = parseInt(response.header.resultCode._text)
          if (resultCode === 0) {
            const weekFarmInfos = response.body.items.item.map(item => {
              return {
                downUrl: item.downUrl._cdata,
                fileName: item.fileName._cdata,
                hitCt: item.hitCt._cdata,
                regDt: item.regDt._cdata,
                subject: item.subject._cdata,
                writerNm: item.writerNm._cdata
              }
            })
            this.weekFarmInfos = weekFarmInfos.slice(0, 5)
            console.log(this.weekFarmInfos)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
