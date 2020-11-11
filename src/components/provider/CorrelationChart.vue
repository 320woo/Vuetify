<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center justify-center row wrap>
            <v-flex class="task_title">
              <v-layout row align-center jusify-center>
                <img src="@/assets/prepand_title.png"/>
                <v-flex class="ml-1 task_title_name">농업 상관관계 분석차트</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm4>
              <v-overflow-btn
                v-model="correlationChart"
                :items="correlationChartList"
                label="상관관계 분석차트 선택"
                editable
                item-value="text"
                persistent-hint
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-layout>
        <template v-if="correlationChart === `${EnumCorrelation.WEATHER_SOIL_SENSOR_CORRELATION}`">
          <v-layout row wrap>
            <v-flex class="xs6 my-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">기상, 토양센서 상관관계</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/42.기상_토양센서_상관관계.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs6 my-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">기상/토양 변화 (20년 06월)</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/A02.한달간-기상-토양변화.html"></iframe>
              </v-card>
            </v-flex>
            <v-flex class="xs12 my-1">
              <v-card >
                <v-card-title class="headline font-weight-regular blue-grey white--text">식생지수 비교 (8월25일 : 9월11일)</v-card-title>
                <iframe frameborder="0" class="map" src="http://211.189.132.21:8095/output/A03.괴산군_NDVI_비교.html"></iframe>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  const EnumCorrelation = {
    WEATHER_SOIL_SENSOR_CORRELATION: '기상-토양센서 상관관계'
  }
  export default {
    name: 'correlationChart',
    components: {
    },
    data: () => ({
      EnumCorrelation,

      // Dropdown box
      correlationChart: EnumCorrelation.WEATHER_SOIL_SENSOR_CORRELATION,
      correlationChartList: [EnumCorrelation.WEATHER_SOIL_SENSOR_CORRELATION],

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
