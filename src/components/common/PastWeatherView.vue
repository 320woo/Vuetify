<template>
  <v-card>
    <v-card-title>
      <span class="headline">날씨 검색</span>
    </v-card-title>
    <v-card-text>
      <v-layout column wrap pa-3>
        <v-flex>
          <v-layout row wrap>
            <v-select
              v-model="cityName"
              label="지역(시/도)"
              :items="citiesEnum"
              @change="cityChanged(null)"
            />
            <v-select
              v-model="stationId"
              label="관측 지점"
              :items="stationsEnum"
              item-text="name"
              item-value="id"
              @change="stationChanged()"
            />
          </v-layout>
        </v-flex>
        <v-flex v-show="showWeatherAPIError">
          <span class="red--text">날씨 자료를 가져올 수 없습니다.</span>
        </v-flex>
        <v-flex>
          <v-layout row wrap>
            <v-text-field v-model="weatherInfo.sunshine" label="일조량(h)"/>
            <v-text-field v-model="weatherInfo.rainfall" label="강수량(mm)"/>
            <v-text-field v-model="weatherInfo.temperature" label="기온(℃)"/>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
      <v-btn color="blue darken-1" flat :disabled="stationId == null" @click="closePopup(weatherInfo)">적용</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import dbAPI from '@/utils/api/dbAPI'
  import weatherAPI from '@/utils/api/weatherAPI'
  import StringUtil from '@/utils/utils/stringUtil'

  export default {
    name: "PastWeatherView",
    props: {
      date: {
        type: Date,
        default: new Date()
      },
      area_coord: {
        type: Object,
        default: {latitude: 37.5714, longitude: 126.9658}
      }
    },
    data: () => ({
      cityName: '강원도',
      stationId: null,
      stationCodes: [],
      citiesEnum: [],
      stationsEnum: [],
      weatherInfo: {},
      showWeatherAPIError: false
    }),
    async created() {
      console.log('[created] PastWeatherView')
      await this.loadStations()
      await this.loadNearestStationCode()
    },
    mounted() {
      console.log('[mounted] PastWeatherView')
    },
    computed: {},
    methods: {
      initData() {
        this.showWeatherAPIError = false
        this.cityChanged(null)
        this.weatherInfo = {}
      },
      cityChanged(withStationId) {
        console.log("changed city name: ", this.cityName, 'withStationId: ', withStationId)

        const selected = this.stationCodes.filter(item => item.city == this.cityName)
        selected.sort((a, b) => a.name.localeCompare(b.name))
        console.log('selectedStations:', selected, this.cityName)
        this.stationsEnum = selected
        this.stationId = withStationId
        this.stationChanged()
      },
      stationChanged() {
        console.log("changed station id: ", this.stationId)
        if (this.stationId != null) {
          const selectedStation = this.stationCodes.find(v => v.id == this.stationId)
          if (selectedStation != null) {
            console.log('selected station: ', selectedStation)
            this.getWeatherInfo(selectedStation.id)
          }
        }
      },
      async loadStations() {
        try {
          const result = await dbAPI.publicQuery('select.kma_station_code.city')
          this.stationCodes = result.rows
          this.citiesEnum = Array.from(new Set(this.stationCodes.map(v => v.city))).sort()
          this.cityChanged(null)
          console.log(result)
        } catch (err) {
          console.log(err)
        }
      },
      async loadNearestStationCode() {
        console.log('coord', this.area_coord)
        try {
          const result = await dbAPI.publicQuery('select.kma_station_code.nearest_lat_lng', {lat: this.area_coord.latitude, lng: this.area_coord.longitude, limit:10})
          console.log(result)
          if (result.rowCount >= 1) {
            this.cityName = result.rows[0].city
            this.cityChanged(result.rows[0].id)
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getWeatherInfo(stnId) {
        this.weatherInfo = {}
        this.showWeatherAPIError = false

        let today = new Date()
        let today00 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        if (this.date >= today00) {
          // 예보 아직 미지원
          console.log('과거 날씨만 가져올 수 있습니다.')
          return
        }

        const day = this.convertDate(this.date)
        try {
          const result = await weatherAPI.getPastWeatherInfo(stnId, day)
          if (result.rowCount == 1) {
            const weather = result.rows[0].weather
            let wi = {}
            wi.sunshine = weather.SUM_SS_HR || 0 //(합계 일조 시간)
            wi.rainfall = weather.SUM_RN || 0 //(일강수량)
            wi.temperature = weather.AVG_TS || 0 //(평균 지면 온도)
            this.weatherInfo = wi
          }
          else {
            console.log(result)
            this.showWeatherAPIError = true
          }
        } catch (err) {
          console.log(err)
          alert('날씨 정보를 가져올 수 없습니다.')
          this.showWeatherAPIError = true
        }
      },
      closePopup(opt) {
        this.$emit('onClose', opt)
        this.initData()
      },
      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYYMMDD')
      },
    }
  }
</script>

<style scoped>

</style>
