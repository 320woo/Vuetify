<template>
  <base-modal>
    <div slot="title"
         class="headline">태스크 추가
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            label="Name"
            v-model="newTask.task.name"
            required>
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            :items="getAlgorithmItem"
            label="알고리즘"
            v-model="newTask.task.algorithm"
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
           @click="_closeModal()">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="_onAddTask()">
      생성
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

      newTask: {
        project_id: '',
        task: {
          name: '',
          algorithm: '',
          base_date: '',
        },
      }
    }),

		computed: {
      ...mapGetters([
        'getProject',
        'getAlgorithmItem',
        'getEditTask',
        'getRemoveTask',
        'isOpenAddModal',
        'isOpenEditModal',
        'isOpenRemoveModal'
      ])
    },

    created() {
      console.log("[created] ");
      let createDate = new Date();
      this.shootingDate = StringUtil.getConvertDateFormat(createDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[0]);
      this.shootingTime = StringUtil.getConvertDateFormat(createDate, StringUtil.REQUEST_TIMESTAMP_FORMAT.split('T')[1]).substr(0, 5);
    },

    methods: {
      _onAddTask() {
        this.newTask.project_id = this.project_id
        this.newTask.task.base_date = this.getRequestTime();
        this.requestCreateTask(JSON.parse(JSON.stringify(this.newTask)))
        this._closeModal()
      },
      _closeModal() {
        this.CLOSE_MODAL()

        for (let key in this.newTask) {
          if(this.newTask[key] instanceof  Object) {
            for(let inKey in this.newTask[key]) {
              this.newTask[key][inKey] = '';
            }
          }
          else
            this.newTask[key] = '';
        }
      },

      getRequestTime() {
        let date = new Date();
        let timezoneOffset = date.getTimezoneOffset();
        let timezone = this.getTimezoneData(timezoneOffset);
        console.log("[getRequestTime] timezoneOffset : " + timezone);

        let requestStartDate = this.shootingDate + "T" + this.shootingTime + ":00";
        requestStartDate += timezone;

        console.log("[getRequestTime] requestStartDate : " + requestStartDate);

        return requestStartDate
      },

      getTimezoneData(timezone) {
        let sign = (timezone <= 0);
        let hour = StringUtil.pad(Math.abs(timezone) / 60, 2);
        let minute = StringUtil.pad(Math.abs(timezone) % 60, 2);

        return ((sign) ? "+" : "-") + hour.toString() + ":" + minute.toString();
      },

      ...mapMutations([
        'CLOSE_MODAL'
      ]),
      ...mapActions([
        'requestGetProject',
        'requestCreateTask',
        'requestPatchTask',
        'requestDeleteTask'
      ])
    },
    components: {
		  'BaseModal': BaseModal
    }
	}
</script>

<style scoped>

</style>
