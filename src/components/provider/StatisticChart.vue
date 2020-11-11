<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center justify-center row wrap>
            <v-flex class="task_title">
              <v-layout row align-center jusify-center>
                <img src="@/assets/prepand_title.png"/>
                <v-flex class="ml-1 task_title_name">농업 통계 분석차트</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm4>
              <v-overflow-btn
                v-model="statisticChart"
                :items="statisticChartList"
                label="통계 분석차트 선택"
                editable
                item-value="text"
                persistent-hint
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-layout>
        <template v-if="statisticChart === `${EnumStatistics.SPRAY_AMOUNT_STATISTICS}`">
          <v-layout row wrap>
            <v-flex class="xs6 pr-1 my-1">
            <v-card>
              <v-card-title class="headline font-weight-regular blue-grey white--text">전체 단지 월별 작물별 방제량 변화</v-card-title>
              <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/01.월별_전체필지살포량_방제.html"></iframe>
            </v-card>
            </v-flex>
            <v-flex class="xs6 pl-1 my-1">
            <v-card>
              <v-card-title class="headline font-weight-regular blue-grey white--text">전체 단지 월별 시비량 변화</v-card-title>
              <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/01.월별_전체필지살포량_시비.html"></iframe>
            </v-card>
            </v-flex>
            <v-flex class="xs6 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">
                  <v-combobox
                  v-model="select"
                  :items="items"
                  dark
                ></v-combobox>필지 월별 작물별 방제량 변화</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/02.월별_특정필지살포량_방제.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    dark
                  ></v-combobox>필지 월별 작물별 시비량 변화</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/02.월별_특정필지살포량_시비.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
        <template v-if="statisticChart === `${EnumStatistics.COST_STATISTICS}`">
          <v-layout row wrap>
            <v-flex class="xs6 pr-1 my-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">전체 필지 월별 시비 비용 변화</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/05.월별_전체필지비용_시비.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 pl-1 my-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    dark
                  ></v-combobox>필지 월별 시비 비용 변화</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/06.월별_특정필지비용_시비.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
        <template v-if="statisticChart === `${EnumStatistics.SPRAY_STATISTICS}`">
          <v-layout row wrap>
            <v-flex class="xs12 my-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">연별 살포제 총 살포량</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/10.연간_살포제별_살포량.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
        <template v-if="statisticChart === `${EnumStatistics.SOIL_SENSOR_STATISTICS}`">
          <v-layout row wrap>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 시간별 함수량</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/11-1.월간_시간별_함수량.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 시간별 EC</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/11-2.월간_시간별_EC.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 시간별 지온</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/11-3.월간_시간별_지온.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 시간별 PH</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/11-4.월간_시간별_ph.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 일별 함수량</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/16-1.월간_일별_함수량.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 일별 EC</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/16-2.월간_일별_EC.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 일별 지온</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/16-3.월간_일별_지온.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 일별 ph</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/16-4.월간_일별_ph.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2019년 월별 평균 함수량</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/19-1.연간_월별_평균_함수량.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2019년 월별 평균 EC</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/19-2.연간_월별_평균_EC.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pr-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2019년 월별 평균 지온</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/19-3.연간_월별_평균_지온.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2019년 월별 평균 ph</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/19-4.연간_월별_평균_ph.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
        <template v-if="statisticChart === `${EnumStatistics.FLIGHT_STATISTICS}`">
          <v-layout row wrap>
            <v-flex class="xs12 my-1 pr-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 6월 일별 비행 횟수</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/20.월간_일별_비행횟수.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1 pl-1">
              <v-card>
                <v-card-title class="headline font-weight-regular blue-grey white--text">2020년 월별 비행 횟수</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/21.연간_월별_비행횟수.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  const EnumStatistics = {
    SPRAY_AMOUNT_STATISTICS: '살포량 통계',
    COST_STATISTICS: '비용 통계',
    SPRAY_STATISTICS: '살포제 통계',
    SOIL_SENSOR_STATISTICS: '토양센서',
    FLIGHT_STATISTICS: '비행'
  }

  export default {
    name: 'statisticChart',
    components: {
    },
    data: () => ({
      EnumStatistics,

      select: '충청북도 괴산군 불정면 탑촌리 1119',
      items: ['충청북도 괴산군 불정면 탑촌리 1119'],

      // Dropdown box
      statisticChart: EnumStatistics.SPRAY_AMOUNT_STATISTICS,
      statisticChartList: [EnumStatistics.SPRAY_AMOUNT_STATISTICS,
        EnumStatistics.COST_STATISTICS,
        EnumStatistics.SPRAY_STATISTICS,
        EnumStatistics.SOIL_SENSOR_STATISTICS,
        EnumStatistics.FLIGHT_STATISTICS]

    }),
    methods: {
    },
  }
</script>

<style scoped>
  .map {
    width:100%;
    height:600px;
  }

  .task_title {
    color: #191d5c;
    font-size: large;
    font-weight: bold;
  }

  .task_title_name {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task_header_card {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .list-move {
    transition: transform 1s;
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 1s;
  }

  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
