<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center justify-center row wrap>
            <v-flex class="task_title">
              <v-layout row align-center jusify-center>
                <img src="@/assets/prepand_title.png"/>
                <v-flex class="ml-1 task_title_name">농업주제도</v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm4>
              <v-overflow-btn
                v-model="thematicMap"
                :items="thematicMapList"
                label="주제도 선택"
                editable
                item-value="text"
                persistent-hint
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-layout>
        <iframe v-if="thematicMap === '전체단지 살포현황'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/31.%EC%A0%84%EC%B2%B4%EB%8B%A8%EC%A7%80%20%EC%82%B4%ED%8F%AC%ED%98%84%ED%99%A9%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
        <iframe v-if="thematicMap === '토양센서정보'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/32.%ED%86%A0%EC%96%91%EC%84%BC%EC%84%9C%EC%A0%95%EB%B3%B4.html"></iframe>
        <iframe v-if="thematicMap === '토양센서위치'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/33.%ED%86%A0%EC%96%91%EC%84%BC%EC%84%9C%EC%9C%84%EC%B9%98.html"></iframe>
        <iframe v-if="thematicMap === '작물-필지별 수확량'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/34.%EC%9E%91%EB%AC%BC-%ED%95%84%EC%A7%80%EB%B3%84%20%EC%88%98%ED%99%95%EB%9F%89%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
        <iframe v-if="thematicMap === '작물분포도'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/35.%EC%9E%91%EB%AC%BC%EB%B3%84%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
        <iframe v-if="thematicMap === '품종분포도'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/36.%ED%92%88%EC%A2%85%EB%B3%84%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
        <iframe v-if="thematicMap === '파종시기'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/37.%ED%95%84%EC%A7%80%EB%B3%84%20%EC%9E%91%EB%AC%BC%EB%B3%84%20%ED%8C%8C%EC%A2%85%EC%8B%9C%EA%B8%B0%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
        <iframe v-if="thematicMap === '식생지수'" frameborder="0" class="map" src="http://211.189.132.21:8095/thematic_map/42.NDVI%20%EC%A3%BC%EC%A0%9C%EB%8F%84.html"></iframe>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'ThematicMap',
    components: {
    },
    data: () => ({
      // Dropdown box
      thematicMap: '전체단지 살포현황',
      thematicMapList: ['전체단지 살포현황','토양센서정보','토양센서위치','작물-필지별 수확량','작물분포도','품종분포도','파종시기','식생지수'],

    }),
    methods: {
    },
  }
</script>

<style scoped>
  .map {
    width:100%;
    height:900px;
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
