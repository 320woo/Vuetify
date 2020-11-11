<template>
  <v-layout
    align-center
    jusify-center
    wrap>
    <v-icon>
      subdirectory_arrow_right
    </v-icon>
    <div>{{ title }}</div>
    <div> ({{ subTitle }})</div>
    <v-spacer></v-spacer>
    <div> {{ date }}</div>
    <v-spacer></v-spacer>
    <v-btn round color="primary" dark @click="onClickAddMissionReport()">수락</v-btn>
  </v-layout>
</template>

<script>
  export default {
    name: "ScheduleItem",

    props: {
      missionRequestId: {
        type: Number,
        default: null
      },
      requestMissionTypeId: {
        type: Number,
        default: null
      },
      title: {
        type: String,
        required: true
      },
      subTitle: {
        type: String,
        required: true
      },
      date: {
        type: String
      },
    },

    methods: {
      onClickAddMissionReport() {
        this.$router.push({
          name: 'addMissionGenerateReport',
          params: {
            "requestMissionTypeId": this.requestMissionTypeId.toString()
          }
        })
      },

      onClickEditMissionReport() {
        console.log("[onClickEditMissionReport] this.requestMissionTypeId : " + this.requestMissionTypeId)
        this.$router.push({
          name: 'editMissionGenerateReport',
          params: {
            "missionRequestId": this.missionRequestId.toString(),
            "requestMissionTypeId": this.requestMissionTypeId.toString(),
            "missionId": "" // Todo : 해당 라인 수정 예정
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
