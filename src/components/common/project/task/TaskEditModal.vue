<template>
  <base-modal>
    <div slot="title"
         class="headline">태스크 수정
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            label="Name"
            v-model="getEditTask.task.name"
            required>
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            :items="getAlgorithmItem"
            label="알고리즘"
            v-model="getEditTask.task.algorithm"
            return-object
          ></v-select>
        </v-flex>
        <v-layout row>
          <v-flex xs12 sm6>
            <v-menu
              ref="shootingDateMenu"
              :close-on-content-click="false"
              v-model="shootingDateMenu"
              :nudge-right="40"
              :return-value.sync="shootingDate"
              lazy
              transition="scale-transition"
              offset-y
            >
              <v-text-field
                slot="activator"
                v-model="shootingDate"
                label="촬영 날짜"
                append-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                v-model="shootingDate"
                no-title scrollable
                locale="ko-kr"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="shootingDateMenu = false">취소</v-btn>
                <v-btn flat color="primary" @click="$refs.shootingDateMenu.save(shootingDate)">확인</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 sm6>
            <v-menu
              ref="shootingTimeMenu"
              :close-on-content-click="false"
              v-model="shootingTimeMenu"
              :nudge-right="40"
              :return-value.sync="shootingTime"
              lazy
              transition="scale-transition"
              offset-y
            >
              <v-text-field
                slot="activator"
                v-model="shootingTime"
                label="촬영 시간"
                append-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker
                v-if="shootingTimeMenu"
                v-model="shootingTime"
                format="24hr"
                full-width
                @change="$refs.shootingTimeMenu.save(shootingTime)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="_onPatchTask">
      수정
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import {mapMutations} from 'vuex'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import StringUtil from "@/utils/utils/stringUtil"

	export default {
    props: [
      'project_id'
    ],
    data: () => ({
      shootingDateMenu: false,
      shootingTimeMenu: false,
      shootingDate: new Date().toISOString().substr(0, 10),
      shootingTime: new Date().toISOString().substr(11, 5),
    }),
		computed: {
      ...mapGetters([
        'getProject',
        'getEditTask',
        'getRemoveTask',
        'getAlgorithmItem',
        'isOpenAddModal',
        'isOpenEditModal',
        'isOpenRemoveModal'
      ])
    },
    methods: {
      _onPatchTask() {
        let task = this.getEditTask
        task.project_id = this.project_id
        task.task.base_date = this.getRequestTime()
        console.log(task);
        this.requestPatchTask(task)
        this.CLOSE_MODAL()
      },

      getRequestTime() {
        let date = new Date();
        let timezoneOffset = date.getTimezoneOffset();
        let timezone = this.getTimezoneData(timezoneOffset);
        console.log("[getRequestTime] timezoneOffset : " + timezone);

        let requestStartDate = this.shootingDate + "T" + this.shootingTime + ":00";
        requestStartDate += timezone;

        console.log("[getRequestTime] requestStartUri : " + requestStartDate);

        return requestStartDate
      },

      getTimezoneData(timezone) {
        let sign = (timezone <= 0);
        let hour = StringUtil.pad(Math.abs(timezone) / 60, 2);
        let minute = StringUtil.pad(Math.abs(timezone) % 60, 2);

        return ((sign) ? "+" : "-") + hour.toString() + ":" + minute.toString();
      },

      ...mapMutations([
        'OPEN_ADD_MODAL',
        'OPEN_EDIT_MODAL',
        'OPEN_REMOVE_MODAL',
        'CLOSE_MODAL'
      ]),
      ...mapActions([
        'requestGetProject',
        'requestPatchTask',
        'requestDeleteTask'
      ])
    },


    watch: {
      getEditTask(val, oldVal) {
        console.log("[getEditTask] val ", val);
        if (val.task.base_date) {
          let date = new Date(val.task.base_date);

          // "2018-12-28T01:49:00Z"
          let formatDate = StringUtil.getConvertDateFormat(date, StringUtil.REQUEST_TIMESTAMP_FORMAT);

          this.shootingDate = formatDate.split('T')[0];
          this.shootingTime = formatDate.split('T')[1].substr(0, 5);
        }
      }
    },
    components: {
		  BaseModal
    }
	}
</script>

<style scoped>

</style>
