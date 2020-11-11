<template>
  <v-container>
    <div v-if="progressBar">
      <v-progress-circular
        class="progress"
        :size="70"
        :width="7"
        color="purple"
        indeterminate>
      </v-progress-circular>
    </div>
    <div v-else>
      <v-layout column>
        <v-layout row>
          <v-layout column wrap>
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
                      <span class="ml-1">장치 정보</span>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
            <transition-group name="list">
              <template
                v-for="index in getViewItemCount()">
                <device-list
                  :key="index"
                  :deviceInfo="getDeviceInfo(index)"
                  @selected-device="getIoTSensorInfo">
                </device-list>
              </template>
            </transition-group>
            <v-card>
              <v-container fluid>
                <v-layout column>
                  <v-flex>
                    <div class="text-xs-center">
                      <v-pagination
                        v-model="viewPageNum"
                        :length="getTotalPage"
                        :total-visible="7"
                      ></v-pagination>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-layout>
          <v-layout column wrap class="ml-5">
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
                      <span class="ml-1">장치 추가</span>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
            <v-card>
              <v-container fluid>
                <v-layout column>
                  <v-flex>
                    <v-card-title>
                      <v-layout column>
                        <v-text-field
                          v-model="deviceName"
                          label="장치 이름"
                        ></v-text-field>
                        <v-text-field
                          v-model="deviceId"
                          hint="앱 -> 설정 -> Device ID 확인"
                          label="장치 아이디"
                        ></v-text-field>
                      </v-layout>
                    </v-card-title>
                    <v-card-actions align-center
                                    justify-center>
                      <v-btn flat color="orange" @click="registerDevice">등록</v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-layout>
        </v-layout>
        <v-layout row>
          <v-layout column wrap class="mt-3">
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
                      jusify-start
                      wrap>
                      <img src="@/assets/prepand_title.png">
                      <span class="ml-1">위치정보</span>
                    </v-layout>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs8 sm2>
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
                        :allowed-dates="isAllowedStartDates"
                        locale="ko-kr"
                      >
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="startDateMenu = false">취소</v-btn>
                        <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">확인</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs8 sm2>
                    <v-menu
                      ref="startTimeMenu"
                      :close-on-content-click="false"
                      v-model="startTimeMenu"
                      :nudge-right="40"
                      :return-value.sync="startTime"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="startTime"
                        label="시작 시간"
                        prepend-icon="access_time"
                        readonly
                      ></v-text-field>
                      <v-time-picker
                        v-if="startTimeMenu"
                        v-model="startTime"
                        format="24hr"
                        full-width
                        @change="$refs.startTimeMenu.save(startTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs8 sm2>
                    <v-menu
                      ref="endDateMenu"
                      :close-on-content-click="false"
                      v-model="endDateMenu"
                      :nudge-right="40"
                      :return-value.sync="endDate"
                      lazy
                      transition="scale-transition"
                      offset-y
                      max-width="170ox"
                      min-width="150px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="endDate"
                        label="종료 날짜"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker
                        v-model="endDate"
                        no-title
                        scrollable
                        :allowed-dates="isAllowedEndDates"
                        locale="ko-kr"
                      >
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="endDateMenu = false">취소</v-btn>
                        <v-btn flat color="primary" @click="$refs.endDateMenu.save(endDate)">확인</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs8 sm2>
                    <v-menu
                      ref="endTimeMenu"
                      :close-on-content-click="false"
                      v-model="endTimeMenu"
                      :nudge-right="40"
                      :return-value.sync="endTime"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="endTime"
                        label="종료 시간"
                        prepend-icon="access_time"
                        readonly
                      ></v-text-field>
                      <v-time-picker
                        v-if="endTimeMenu"
                        v-model="endTime"
                        format="24hr"
                        full-width
                        @change="$refs.endTimeMenu.save(endTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
            <v-card>
              <v-container fluid>
                <v-layout column>
                  <v-flex d-flex>
                    <DeviceMap class="deviceMap"></DeviceMap>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-layout>
        </v-layout>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
  import DeviceList from '@/components/management/device/DeviceList'
  import DeviceMap from '@/components/management/device/DeviceMap'
  import * as types from '@/vuex/mutation-types'
  import StringUtil from '@/utils/utils/stringUtil'

  const REQUEST_DATA_TERM = 2; //hour

  export default {
    name: "Device",
    components: {
      DeviceList,
      DeviceMap
    },

    data: () => ({
      startDateMenu: false,
      startTimeMenu: false,
      endDateMenu: false,
      endTimeMenu: false,
      deviceName: "",
      deviceId: "",
      viewPageNum: 1,
      viewItemCount: 2,
      progressBar: false,
      currentDate: new Date().toISOString().substr(0, 10),
      startDate: new Date().toISOString().substr(0, 10),
      startTime: new Date().toISOString().substr(11, 5),
      endDate: new Date().toISOString().substr(0, 10),
      endTime: new Date().toISOString().substr(11, 5),
    }),

    created() {
      console.log("[created] ");

      this.initData();
      this.progressBar = true;

      this.$store.dispatch(types.GET_IOT_DEVICE_LIST, {
        callback: (data) => {
          console.log("[callback] GET_IOT_DEVICE_LIST result : " + data);
          this.progressBar = false;
        }
      });
      this.$store.commit(types.SELECTED_IOT_DEVICE, {deviceId: ""});
    },

    methods: {
      initData() {
        let startDate = new Date();
        let endDate = new Date();

        startDate.setHours(startDate.getHours() - REQUEST_DATA_TERM);
        this.startDate = StringUtil.getConvertDateFormat(startDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[0]);
        this.startTime = StringUtil.getConvertDateFormat(startDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[1]).substr(0, 5);
        this.endDate = StringUtil.getConvertDateFormat(endDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[0]);
        this.endTime = StringUtil.getConvertDateFormat(endDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[1]).substr(0, 5);
      },

      registerDevice() {
        if (this.deviceName.length > 0 && this.deviceId.length > 0) {
          let userId = this.$session.get('account_id');

          console.log("[registerDevice] userId : " + userId);
          this.$store.dispatch(types.ADD_IOT_DEVICE, {
            user: userId,
            deviceid: this.deviceId,
            name: this.deviceName
          })
        }
      },

      getDeviceInfo(index) {
        let _index = this.getIndex(index);
        let data;
        if (this.getDeviceList.length > _index) {
          data = this.getDeviceList[_index];
        } else {
          data = {id: -1, name: "", deviceid: ""};
        }
        return data;
      },

      getIndex(index) {
        return (this.viewPageNum - 1) * this.viewItemCount + (index - 1)
      },

      changeCurrentPage(index) {
        this.viewPageNum = Math.floor((index / this.viewItemCount)) + 1;
      },

      getViewItemCount() {
        let count;
        if (this.getDeviceList.length >= this.viewItemCount * this.viewPageNum) {
          count = this.viewItemCount;
        } else {
          count = this.viewItemCount - (this.viewItemCount * this.viewPageNum - this.getDeviceList.length);
        }
        console.log("[getViewItemCount] count : " + count);
        return count;
      },

      getIoTSensorInfo(deviceId) {
        console.log("[getIoTSensorInfo] deviceId : " + deviceId);
        let requestTime = this.getRequestTime();

        this.$store.dispatch(types.GET_IOT_SENSOR, {
          deviceid: deviceId,
          starttime: requestTime.startTime,
          endtime: requestTime.endTime
        })
      },

      getRequestTime() {
        let date = new Date();
        let timezoneOffset = date.getTimezoneOffset();
        let timezone = this.getTimezoneData(timezoneOffset);
        console.log("[getRequestTime] timezoneOffset : " + timezone);

        let requestStartDate = this.startDate + "T" + this.startTime + ":00";
        let requestEndDate = this.endDate + "T" + this.endTime + ":00";
        requestStartDate += timezone;
        requestEndDate += timezone;
        let requestStartUri = encodeURIComponent(requestStartDate);
        let requestEndUri = encodeURIComponent(requestEndDate);

        console.log("[currentTime] requestStartUri : " + requestStartUri + ", requestEndUri : " + requestEndUri);

        return {startTime: requestStartUri, endTime: requestEndUri}
      },

      getTimezoneData(timezone) {
        let sign = (timezone <= 0);
        let hour = StringUtil.pad(Math.abs(timezone) / 60, 2);
        let minute = StringUtil.pad(Math.abs(timezone) % 60, 2);

        return ((sign) ? "+" : "-") + hour.toString() + ":" + minute.toString();
      },

      isAllowedStartDates(val) {
        console.log("[isAllowedStartDates] val", val);
        return this.endDate >= val;
      },

      isAllowedEndDates(val) {
        console.log("[isAllowedEndDates] val", val);
        return this.currentDate >= val;
      },
    },

    computed: {
      getTotalPage() {
        return Math.ceil(this.getDeviceList.length / this.viewItemCount);
      },

      getDeviceList() {
        this.progressBar = false;
        console.log("[getDeviceList] ");
        return this.$store.getters.getDeviceInfoList;
      },
    },
  }
</script>

<style scoped>
  .deviceMap {
    z-index: 0;
    width: auto;
    height: auto;
    left: 0;
    top: 0;
  }

  .progress {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
</style>
