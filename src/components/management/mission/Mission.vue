<template>
  <v-container>
    <v-card class="card-header"
            color="#E6EDFF">
      <v-container fluid>
        <v-layout column wrap class="ml-auto">
          <v-card class="card-header"
                  color="#E6EDFF">
            <v-container fluid>
              <v-layout align-center
                        justify-center
                        row
                        wrap>
                <v-flex class="card-header-title">
                  <v-layout
                    align-center
                    jusify-center
                    wrap>
                    <img src="@/assets/prepand_title.png">
                    <span class="ml-1">임무 등록</span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <v-card>
            <v-container fluid>
              <v-layout row>
                <v-flex>
                  <v-card-title>
                    <v-layout column>
                      <v-layout row >
                        <!-- 현재 영역의 해상도 기반으로 동작하는데 여기선 md로 인식됨 12칸중 3칸 차지  xs sm md 등등..-->
                        <v-flex md6>
                          <v-text-field
                            v-model="missionName"
                            hint="힌트를 넣고 싶으면 여기에 내용 넣으세요"
                            label="임무명"
                          ></v-text-field>
                          <v-text-field
                            v-model="userName"
                            label="사용자명"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row >
                        <v-text-field
                          class="mr-3"
                          v-model="missionType"
                          label="임무종류"
                        ></v-text-field>
                        <v-text-field
                          class="ml-3"
                          v-model="missionType2"
                          label="세부임무"
                        ></v-text-field>
                      </v-layout>
                      <v-layout row >
                        <v-flex md6>
                          <v-text-field
                            v-model="managerName"
                            label="담당자"
                          ></v-text-field>
                          <v-text-field
                            v-model="missionLocation"
                            label="작업지역"
                          ></v-text-field>
                          <v-menu
                            ref="startDateMenu"
                            :close-on-content-click="false"
                            v-model="startDateMenu"
                            :nudge-right="40"
                            :return-value.sync="startDate"
                            lazy
                            transition="scale-transition"
                            offset-y
                            max-width="170ox"
                            min-width="150px"
                          >
                            <v-text-field
                              slot="activator"
                              v-model="startDate"
                              label="시작 날짜"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                            <v-date-picker
                              v-model="startDate"
                              no-title scrollable
                              locale="ko-kr"
                            >
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="startDateMenu = false">취소</v-btn>
                              <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">확인</v-btn>
                            </v-date-picker>
                          </v-menu>

                          <v-text-field
                            v-model="area"
                            label="면적"
                          ></v-text-field>

                          <v-select
                            :items="missionStatusList"
                            label="진행 상태"
                            v-model="missionStatus"
                            return-object
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-card-title>
                  <v-card-actions align-center
                                  justify-center>
                    <v-btn flat color="orange" @click="registerMission">등록</v-btn>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
    <!--
    <div class="mission">
        <v-app>
            hello vue!!
        </v-app>
    </div>
    -->
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import dbAPI from '@/utils/api/dbAPI'
  export default {
    name: 'Mission',
    data : () => ({
      missionName : "",
      userName : "",
      missionType : "",
      missionType2 : "",
      managerName : "",
      missionLocation : "",
      startDateMenu: false,
      startDate: new Date().toISOString().substr(0, 10),
      missionStatusList: ['준비중', '진행중', '완료', '취소'],
      area : "",
      missionStatus : "",
    }),
    computed: {
       ...mapGetters([
        'getCreateMission'
      ])
    },
    mounted() {},
    methods: {
      ...mapActions([
        'requestCreateMission',
        'openGlobalModal'
      ]),
      // Add User
      async registerMission() {
        alert("missionName: "+this.missionName+"\n"
              +"userName: "+this.userName+"\n"
              +"missionType: "+this.missionType+"\n"
              +"missionType2: "+this.missionType2+"\n"
              +"managerName: "+this.managerName+"\n"
              +"missionLocation: "+this.missionLocation+"\n"
              +"startDate: "+this.startDate+"\n"
              +"area: "+this.area+"\n"
              +"missionStatus: "+this.missionStatus);

        const missionInfo = JSON.parse(JSON.stringify({
              'missionName': this.missionName,
              'userName': this.userName,
              'missionType': this.missionType,
              'missionType2': this.missionType2,
              'managerName': this.managerName,
              'missionLocation': this.missionLocation,
              'startDate': this.startDate,
              'area': this.area,
              'missionStatus': this.missionStatus,
              }))

        try {
          // 여기서 task를 만들어서 insert mission 에 task id와 request task id를 넘기십시오
          let result = await dbAPI.query('insert.mission', missionInfo)
          //Math.round(new Date(missionInfo.startDate).getTime()/1000)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            alert("성공입니다")
          }
        }
        catch(err) {
            console.log(err)
            alert("실패입니다")
            // 실패하면 task id를 삭제 하십시오...
        }
        //this.requestAddUser(missionInfo)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
