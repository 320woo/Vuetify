<template>
  <v-app>
    <v-container fluid>
      <!------------------------ 홈화면에 채울 내용 ----------BEGIN--------------->
      <v-layout row wrap>
        <v-flex px-2 pt-2 xs12>
          <h3>최근 임무 요청 목록</h3>

          <v-data-table
            :headers="mission_headers"
            :items="missionRequestData"
            class="elevation-5"
            :pagination.sync="pagination"
          >
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-center">{{ props.item.full_name }}</td>
                <td class="text-xs-center">{{ props.item.mission_type_category }}</td>
                <td class="text-xs-center address-width">{{ props.item.area_name }}</td>
                <td class="text-xs-center">{{ props.item.tel_num }}</td>
                <td class="text-xs-center">{{ convertDate(props.item.wish_dat) }}</td>
                <td class="text-xs-center">{{ convertDate(props.item.req_dat) }}</td>
                <td class="text-xs-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        small
                        fab
                        dark
                        color="teal"
                        v-on="on"
                        @click="zoomInRequestMissionOnMap(props.item)"
                      >
                        <v-icon
                          dark>
                          map
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>지도 보기</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        small
                        fab
                        dark
                        color="teal"
                        v-on="on"
                        @click="$router.push({ name: 'schedule', query: {mission_request_id: props.item.mission_request_id} })"
                      >
                        <v-icon
                          dark>
                          calendar_today
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>임무 보기</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
          <!-- <v-sheet color="grey lighten-1" height="300">
            <h3>최근 임무 요청 목록</h3>
            <v-btn flat to="/schedule">요청자 | 임무 | 지역 | 전화번호 | 희망일 | 요청등록일</v-btn>
            <br>
            <v-btn flat to="/schedule">홍길동 | 촬영 | 전남 | 010-1234-1234 | 2019/03/04 | 2019/03/01</v-btn>
            <br>
            <v-btn flat to="/schedule">홍길동 | 촬영 | 전남 | 010-1234-1234 | 2019/03/04 | 2019/03/01</v-btn>
            <br>
            <v-btn flat to="/schedule">홍길동 | 촬영 | 전남 | 010-1234-1234 | 2019/03/04 | 2019/03/01</v-btn>
            <br>
            <v-btn flat to="/schedule">홍길동 | 촬영 | 전남 | 010-1234-1234 | 2019/03/04 | 2019/03/01</v-btn>
            <br>
          </v-sheet>-->
        </v-flex>
        <v-flex px-2 pt-2 xs12>
          <h3>최근 요청 위치</h3>
          <HomeMap class="homeMap" ref="homeMap" parent-name="ProviderHome" :area-list="missionRequestList"></HomeMap>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex pa-1 xs12 sm6 md6 lg6>
          <v-card>
            <v-card-title class="grey lighten-2" primary-title>월별 전체 요청/완료 현황</v-card-title>
            <v-container>
              <bar-chart :data="missionStateData" :options="missionStateOptions"></bar-chart>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex pa-1 xs12 sm6 md6 lg6>
          <v-card>
            <v-card-title class="grey lighten-2" primary-title>임무별 요청 현황</v-card-title>
            <v-container>
              <line-chart :data="missionTypeData" :options="missionTypeOptions"></line-chart>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex pa-1 xs12>
          <v-card>
            <v-card-title primary-title>
              <h3>지역별 임무 요청/완료 현황 (현재 월)</h3>
              <v-spacer></v-spacer>
              <v-select
                v-model="selected_region"
                label="서비스 지역"
                item-text="province"
                item-value="region_id"
                :items="service_regions"
                @change="loadSelectedAreaStatistic"
              />
            </v-card-title>
            <v-container>
              <line-chart :data="areaStateData" :options="areaStateOptions"></line-chart>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>

      <!------------------------ 홈화면에 채울 내용 -----------END---------------->
    </v-container>
  </v-app>
</template>

<script>
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import dbAPI from '@/utils/api/dbAPI'
  import BarChart from '@/components/common/BarCharts'
  import LineChart from '@/components/common/LineCharts'
  import StringUtil from '@/utils/utils/stringUtil'
  import HomeMap from '@/components/common/HomeMap'
  import Constants from '@/components/common/constants'

  export default {
    name: 'ProviderHome',
    components: {
      ConfirmModal,
      BarChart,
      LineChart,
      HomeMap
    },
    data: () => ({
      title: '공급자',
      mission_headers: [
        { text: '요청자', align: 'center', sortable: false, value: 'full_name' },
        { text: '임무', align: 'center', sortable: false, value: 'mission_type_category' },
        { text: '지역', align: 'center', sortable: false, value: 'area_name' },
        { text: '전화번호', align: 'center', sortable: false, value: 'tel_num' },
        { text: '희망일', align: 'center', sortable: false, value: 'wish_dat' },
        { text: '요청등록일', align: 'center', sortable: false, value: 'req_dat' },
        { text: '동작', align: 'center', sortable: false, value: 'action' }
      ],
      missionRequestData: [],
      pagination: {
        rowsPerPage: 5,
        sortBy: 'req_dat',
        descending: true
      },
      regions: [],
      service_regions: [{region_id: 0, province: '전체'}],
      selected_region: 0,
      selected_region_name: '',
      company: {},
      // Chart data
      areaStateData: {
        labels: [],
        datasets: [
          {
            label: '요청',
            borderColor: '#e74c3c',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 1,
            data: [],
            type: 'line'
          },
          {
            label: '완료',
            borderColor: '#47cc9c',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 1,
            data: [],
            type: 'line'
          },
          {
            label: '취소',
            borderColor: 'gray',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 1,
            data: [],
            type: 'line'
          }
        ]
      },
      areaStateOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 15,
              minRotation: 15
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: 100
            }
          }]
        },
        title: {
          display: false,
          text: 'Chart.js Line Chart - Legend'
        }
      },
      missionTypeData: {
        labels: [],
        datasets: [
          {
            label: '촬영',
            borderColor: 'black',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'line'
          },
          {
            label: '파종',
            borderColor: '#e74c3c',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'line'
          },
          {
            label: '시비',
            borderColor: '#47cc9c',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'line'
          },
          {
            label: '방제',
            borderColor: 'orange',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'line'
          }
        ]
      },
      missionTypeOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 15,
              minRotation: 15
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: 100
            }
          }]
        },
        title: {
          display: false,
          text: 'Chart.js Line Chart - Legend'
        }
      },
      // Chart data
      missionStateData: {
        labels: [],
        datasets: [
          {
            label: '요청건수',
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'bar'
          },
          {
            label: '완료건수',
            borderColor: '#47cc9c',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2,
            data: [],
            type: 'bar'
          }
        ]
      },
      missionStateOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 15,
              minRotation: 15
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: 100
            }
          }]
        },
        title: {
          display: false,
          text: 'Chart.js Line Chart - Legend'
        }
      },
      missionRequestList: []
    }),
    async created() {
      await this.loadRegions()
      await this.loadProviderInfo()
      await this.getMissionRequestAll()
      await this.getStatistics()
    },
    computed: {
    },
    methods: {
      async getMissionRequestAll() {
        let missionDataResult = await dbAPI.query('select.mission_request.only_request')
        this.missionRequestData = missionDataResult.rows.sort()

        console.log('[getMissionRequestAll] this.missionRequestData : ', this.missionRequestData)
        // this.areaBoundaryList = this.missionRequestData.map((data) => {
        //   return data.area_boundary.area
        // })
        this.missionRequestList = this.missionRequestData
        console.log('[getMissionRequestAll] this.missionRequestList : ', this.missionRequestList)
      },
      async getStatistics() {
        await this.getStatisticGroupByState()
        await this.getStatisticGroupByType()
        await this.getStatisticGroupByArea()
      },
      async getStatisticGroupByState() {
        try {
          let result = await dbAPI.query('select.mission.statistic.latest.groupby.state')
          let stateData = Object.assign({}, this.missionStateData)
          stateData.labels = Array.from(new Set(result.rows.map(v => v.months))).sort()
          let states = {}
          stateData.labels.forEach(months => {
            const monthFiltered = result.rows.filter(v => v.months == months)
            const total = monthFiltered.reduce((total, curr) => total + parseInt(curr.count), 0)
            let info = {reqcount: 0, state3count: 0}
            info.reqcount = total

            const state3 = monthFiltered.filter(v => v.state == 3)
            info.state3count = state3.length == 1 ? parseInt(state3[0].count) : 0
            states[months] = info
          })
          console.log('states:', states)
          stateData.datasets[0].data = Object.entries(states).map(v => v[1].reqcount) // 요청 개수
          stateData.datasets[1].data = Object.entries(states).map(v => v[1].state3count) // 완료 개수
          let reqCountMax = stateData.datasets[0].data.reduce((prev, curr) => prev > curr ? prev : curr, 0)
          reqCountMax = Math.max(Math.ceil(reqCountMax / 10) * 10, 10)
          this.missionStateOptions.scales.yAxes[0].ticks.max = reqCountMax
          this.missionStateData = stateData
        } catch (err) {
          console.log(err)
        }
      },
      async getStatisticGroupByType() {
        try {
          let result = await dbAPI.query('select.mission.statistic.latest.groupby.type')
          let typeData = Object.assign({}, this.missionTypeData)
          typeData.labels = Array.from(new Set(result.rows.map(v => v.months))).sort()
          let types = {}
          let maxValue = 0
          typeData.labels.forEach(months => {
            const monthFiltered = result.rows.filter(v => v.months == months)
            let info = {[Constants.MISSION_CATEGORY_PHOTO]: 0,
              [Constants.MISSION_CATEGORY_SOWING]: 0,
              [Constants.MISSION_CATEGORY_MANURE]: 0,
              [Constants.MISSION_CATEGORY_PESTICIDE]: 0}
            for (let [key, value] of Object.entries(info)) {
              const typeValues = monthFiltered.filter(v => Constants.MISSION_TYPES.findMissionType(v.mission_type).category == key)
              const typeCount = typeValues.reduce((total, curr) => total + parseInt(curr.count), 0)
              info[key] = typeCount
              maxValue = Math.max(maxValue, typeCount)
            }
            types[months] = info
          })
          console.log('types:', types, maxValue)
          typeData.datasets[0].data = Object.entries(types).map(v => v[1][Constants.MISSION_CATEGORY_PHOTO])
          typeData.datasets[1].data = Object.entries(types).map(v => v[1][Constants.MISSION_CATEGORY_SOWING])
          typeData.datasets[2].data = Object.entries(types).map(v => v[1][Constants.MISSION_CATEGORY_MANURE])
          typeData.datasets[3].data = Object.entries(types).map(v => v[1][Constants.MISSION_CATEGORY_PESTICIDE])
          maxValue = Math.max(Math.ceil(maxValue / 10) * 10, 10)
          this.missionTypeOptions.scales.yAxes[0].ticks.max = maxValue
          this.missionTypeData = typeData
        } catch (err) {
          console.log(err)
        }
      },
      async getStatisticGroupByArea() {
        try {
          let result = await dbAPI.query('select.mission.statistic.latest.area', {month: new Date(), area_prefix: `${this.selected_region_name || ''}%`})
          let stateData = Object.assign({}, this.areaStateData)
          const dateLabels = Array.from(new Set(result.rows.map(v => v.days))).sort()
          stateData.labels = dateLabels.map(v => v.substr(v.length - 2))
          let states = {}
          dateLabels.forEach(days => {
            const dayFiltered = result.rows.filter(v => v.days == days)
            const total = dayFiltered.reduce((total, curr) => total + parseInt(curr.count), 0)
            let info = {reqcount: 0, state3count: 0, staate4count: 0}
            info.reqcount = total

            const state3 = dayFiltered.filter(v => v.state == 3)
            info.state3count = state3.length == 1 ? parseInt(state3[0].count) : 0

            const state4 = dayFiltered.filter(v => v.state == 4)
            info.state4count = state4.length == 1 ? parseInt(state4[0].count) : 0
            states[days] = info
          })
          console.log('area states:', states)
          stateData.datasets[0].data = Object.entries(states).map(v => v[1].reqcount) // 요청 개수
          stateData.datasets[1].data = Object.entries(states).map(v => v[1].state3count) // 완료 개수
          stateData.datasets[2].data = Object.entries(states).map(v => v[1].state4count) // 완료 개수
          let reqCountMax = stateData.datasets[0].data.reduce((prev, curr) => prev > curr ? prev : curr, 0)
          reqCountMax = Math.max(Math.ceil(reqCountMax / 10) * 10, 10)
          this.areaStateOptions.scales.yAxes[0].ticks.max = reqCountMax
          this.areaStateData = stateData
        } catch (err) {
          console.log(err)
        }
      },
      async loadRegions() {
        // 서비스 지역 코드 조회
        try {
          let result = await dbAPI.publicQuery("select.region.all", {})
          this.regions = result.rows
        } catch (err) {
          console.log(err)
        }
      },
      async loadProviderInfo() {
        // 공급자 정보 조회
        try {
          let result = await dbAPI.query("select.provider_info.me", {})
          console.log("select.provider_info.me", result)
          if (result.rowCount === 1) {
            this.company = result.rows[0]

            console.log("this.company.service_region", this.company.service_region)
            this.service_regions = this.company.service_region.split(",").map(v => this.regions.find(r => r.region_id == v))
            this.service_regions.splice(0, 0, {region_id: 0, province: '전체'})
            this.selected_region_name = ''
          }
        } catch (err) {
          console.log(err)
        }
      },
      async loadSelectedAreaStatistic(selected) {
        console.log('selected area', selected)
        const region = this.regions.find(r => r.region_id == selected)
        if (region == null) {
          this.selected_region_name = ''
        }
        else {
          this.selected_region_name = region.region_id == 0 ? '' : region.province
        }
        await this.getStatisticGroupByArea()
      },
      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
      },
      zoomInRequestMissionOnMap(item) {
        console.log('zoom-in', item)
        let areaBoundaryList = item.area_boundary.area
        let areaPoints = areaBoundaryList.flat()
        this.$refs.homeMap.fitMapAreaPoints(areaPoints)
      }
    }
  }
</script>

<style scoped>
  .homeMap {
    z-index: 0;
    width: 100%;
    /*height: 280px;*/
    left: 0;
    top: 0;
  }

  .address-width {
    min-width: 150px;
  }
</style>
