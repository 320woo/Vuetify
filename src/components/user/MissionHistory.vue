<template>
  <v-container fluid>
    <v-flex xs12 sm12 md12>
      <v-layout column>
        <div class="headline">홍길동 - 유곡리 농지 - 가을 배추 - 촬영</div>
        <v-divider></v-divider>
        <v-card color="purple" class="white--text">
          <v-layout row>
            <v-layout column>
              <v-flex xs1>
                <v-card-title primary-title>
                  <v-layout wrap align-center justify-center>
                    <div class="headline">2019.03.08</div>
                    <div class="subheading">오전 11:10</div>
                  </v-layout>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider vertical></v-divider>
            <v-flex xs11>
              <v-card-text>
                <v-layout row>
                  <v-flex xs2>
                    <v-card flat tile class="d-flex">
                      <v-img
                        :src="`https://picsum.photos/500/300?image=10`"
                        aspect-ratio="1"
                        class="grey lighten-2"></v-img>
                    </v-card>
                  </v-flex>
                  <v-flex xs10 pl-3>
                    <v-layout column wrap align-start fill-height>
                      <v-layout row wrap align-center justify-center>
                        <div class="headline text-sm-left">2019.04.10</div>
                        <v-spacer></v-spacer>
                        <v-btn>history</v-btn>
                      </v-layout>
                      <v-layout row wrap align-center justify-center>
                        <v-btn>Waypoint plan</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn>Waypoint</v-btn>
                      </v-layout>
                      <v-layout row wrap align-center justify-center>
                        <v-btn>원본보기</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn>GCS에 내보내기</v-btn>
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
    </v-flex>
  </v-container>
</template>

<script>
  export default {
    name: "MissionHistory4user",
  }
</script>

<style scoped>

</style>
